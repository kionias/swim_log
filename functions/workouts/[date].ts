interface Env {
  VITE_SUPABASE_URL?: string;
  VITE_SUPABASE_ANON_KEY?: string;
  ASSETS?: {
    fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
  };
}

const AVAILABLE_STATIC_LOG_IMAGES = new Set([
  '20260826', '20260827', '20260828', '20260831',
  '20260901', '20260902', '20260903', '20260904',
  '20260907', '20260908', '20260909', '20260910',
  '20260911', '20260914', '20260915', '20260916',
  '20260917', '20260918'
]);

function formatKoreanDate(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  const dayNames = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  return `${year}년 ${month}월 ${day}일 ${dayNames[d.getDay()] || ''}`.trim();
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, params, env } = context;
  const date = params.date as string;

  // For SPA client routes, fetch root index.html asset instead of context.next()
  let assetResponse: Response;
  try {
    if (env && env.ASSETS) {
      assetResponse = await env.ASSETS.fetch(new URL('/', request.url));
    } else {
      assetResponse = await fetch(new URL('/', request.url));
    }
  } catch {
    assetResponse = await context.next();
  }

  const domain = new URL(request.url).origin;
  const cleanDate = date ? date.replace(/-/g, '') : '';
  const formattedDate = formatKoreanDate(date);

  // Default values
  let title = `${formattedDate} 수영 기록 | SWIM LOG`;
  let description = `${formattedDate} 수영 운동 상세 기록입니다. 오늘의 총 수영 거리를 확인해 보세요.`;
  let ogImageUrl = `${domain}/image/og_tag_image_01.png`;

  // 1. Static pre-rendered image fallback
  if (cleanDate && AVAILABLE_STATIC_LOG_IMAGES.has(cleanDate)) {
    ogImageUrl = `${domain}/log_image/${cleanDate}.png`;
  }

  // 2. Dynamic Supabase query
  const supabaseUrl = env?.VITE_SUPABASE_URL || 'https://ytqrojdwkvgbgcvvaybd.supabase.co';
  const supabaseKey = env?.VITE_SUPABASE_ANON_KEY || 'sb_publishable_fWNEoG25YfEk3p7d17Gfcg_15OmctXE';

  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/workouts?workout_date=eq.${date}&select=total_distance,og_image_url,workout_sets(id)`,
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
        workout_sets?: Array<{ id: string }>;
      }>;

      if (workouts && workouts.length > 0) {
        const totalDistance = workouts.reduce((sum, w) => sum + (w.total_distance || 0), 0);
        const totalSets = workouts.reduce((sum, w) => sum + (w.workout_sets?.length || 0), 0);
        const formattedDist = `${totalDistance.toLocaleString()}m`;
        const setsText = totalSets > 0 ? `, ${totalSets}개 세트 완료` : '';

        title = `${formattedDate} 수영 기록 — 총 거리 ${formattedDist}${setsText} | SWIM LOG`;
        description = `${formattedDate} 수영 운동 기록: 오늘의 총 수영 거리 ${formattedDist}${setsText}. SWIM LOG에서 상세 기록을 확인하세요.`;

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
  const transformed = new HTMLRewriter()
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
    .transform(assetResponse);

  const headers = new Headers(transformed.headers);
  headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');

  return new Response(transformed.body, {
    status: 200,
    headers,
  });
};
