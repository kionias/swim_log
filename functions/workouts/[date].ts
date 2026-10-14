interface Env {
  VITE_SUPABASE_URL?: string;
  VITE_SUPABASE_ANON_KEY?: string;
}

// List of pre-rendered static log images available in public/log_image/
const AVAILABLE_STATIC_LOG_IMAGES = new Set([
  '20260826', '20260827', '20260828', '20260831',
  '20260901', '20260902', '20260903', '20260904',
  '20260907', '20260908', '20260909', '20260910',
  '20260911', '20260914', '20260915', '20260916',
  '20260917', '20260918'
]);

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, params, env } = context;
  const date = params.date as string;

  // Let Cloudflare serve the static HTML from the asset pipeline
  const response = await context.next();

  // Only rewrite HTML documents
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('text/html')) {
    return response;
  }

  const domain = new URL(request.url).origin;
  const cleanDate = date ? date.replace(/-/g, '') : '';

  // Default values
  let title = `${date} 수영 기록 | SWIM LOG`;
  let description = `${date} 수영 운동 상세 기록입니다. 오늘의 총 수영 거리를 확인해 보세요.`;
  let ogImageUrl = `${domain}/image/og_tag_image_01.png`;

  // If there's an existing pre-rendered static image for this date in public/log_image
  if (cleanDate && AVAILABLE_STATIC_LOG_IMAGES.has(cleanDate)) {
    ogImageUrl = `${domain}/log_image/${cleanDate}.png`;
  }

  // Query Supabase for dynamic workout details and custom og_image_url
  const supabaseUrl = env.VITE_SUPABASE_URL || 'https://ytqrojdwkvgbgcvvaybd.supabase.co';
  const supabaseKey = env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_fWNEoG25YfEk3p7d17Gfcg_15OmctXE';

  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/workouts?workout_date=eq.${date}&select=total_distance,og_image_url`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
      }
    );

    if (res.ok) {
      const workouts = (await res.json()) as Array<{
        total_distance: number;
        og_image_url: string | null;
      }>;

      if (workouts && workouts.length > 0) {
        const totalDistance = workouts.reduce((sum, w) => sum + (w.total_distance || 0), 0);
        const formattedDist = `${totalDistance.toLocaleString()}m`;
        title = `${date} 수영 기록 — 총 거리 ${formattedDist} 달성! | SWIM LOG`;
        description = `${date} 수영 운동 기록: 오늘의 총 수영 거리 ${formattedDist} 달성. SWIM LOG에서 상세 기록을 확인하세요.`;

        // Check if a workout has a public HTTP(S) og_image_url
        const customImg = workouts.find((w) => w.og_image_url && w.og_image_url.startsWith('http'))?.og_image_url;
        if (customImg) {
          ogImageUrl = customImg;
        }
      }
    }
  } catch (err) {
    // If Supabase fetch fails, rely on static fallbacks
  }

  // Use Cloudflare HTMLRewriter to rewrite meta tags in the response HTML
  return new HTMLRewriter()
    .on('meta[property="og:title"]', {
      element(e) {
        e.setAttribute('content', title);
      },
    })
    .on('meta[property="og:description"]', {
      element(e) {
        e.setAttribute('content', description);
      },
    })
    .on('meta[property="og:image"]', {
      element(e) {
        e.setAttribute('content', ogImageUrl);
      },
    })
    .on('meta[property="og:url"]', {
      element(e) {
        e.setAttribute('content', request.url);
      },
    })
    .on('meta[name="twitter:title"]', {
      element(e) {
        e.setAttribute('content', title);
      },
    })
    .on('meta[name="twitter:description"]', {
      element(e) {
        e.setAttribute('content', description);
      },
    })
    .on('meta[name="twitter:image"]', {
      element(e) {
        e.setAttribute('content', ogImageUrl);
      },
    })
    .on('title', {
      element(e) {
        e.setInnerContent(title);
      },
    })
    .transform(response);
};

