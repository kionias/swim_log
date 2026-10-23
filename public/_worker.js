// Cloudflare Pages / Workers script

function formatKoreanDate(dateStr) {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  const dayNames = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  return `${year}년 ${month}월 ${day}일 ${dayNames[d.getDay()] || ''}`.trim();
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Intercept workout detail routes: /workouts/YYYY-MM-DD
    const match = url.pathname.match(/^\/workouts\/(\d{4}-\d{2}-\d{2})\/?$/);
    if (match) {
      const date = match[1];

      const domain = url.origin;

      // Always fetch root index.html asset
      let assetResponse;
      try {
        if (env.ASSETS) {
          assetResponse = await env.ASSETS.fetch(new URL('/', request.url));
        } else {
          assetResponse = await fetch(new URL('/', request.url));
        }
      } catch {
        try {
          assetResponse = await env.ASSETS.fetch(request);
        } catch {
          assetResponse = await fetch(request);
        }
      }

      const formattedDate = formatKoreanDate(date);
      let title = `${formattedDate} 수영 기록 | SWIM LOG`;
      let description = `${formattedDate} 수영 운동 상세 기록입니다. 오늘의 총 수영 거리를 확인해 보세요.`;
      let ogImageUrl = `${domain}/image/og_tag_image_01.png`;

      // Dynamic Supabase query
      const supabaseUrl = env.VITE_SUPABASE_URL || 'https://ytqrojdwkvgbgcvvaybd.supabase.co';
      const supabaseKey = env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_fWNEoG25YfEk3p7d17Gfcg_15OmctXE';

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
          const workouts = await res.json();
          if (Array.isArray(workouts) && workouts.length > 0) {
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
      } catch (e) {
        // Fallback to static values if Supabase is unreachable
      }

      // Rewrite HTML meta tags using Cloudflare HTMLRewriter
      const transformed = new HTMLRewriter()
        .on('meta[property="og:title"]', { element(e) { e.setAttribute('content', title); } })
        .on('meta[property="og:description"]', { element(e) { e.setAttribute('content', description); } })
        .on('meta[property="og:image"]', { element(e) { e.setAttribute('content', ogImageUrl); } })
        .on('meta[property="og:url"]', { element(e) { e.setAttribute('content', request.url); } })
        .on('meta[name="twitter:title"]', { element(e) { e.setAttribute('content', title); } })
        .on('meta[name="twitter:description"]', { element(e) { e.setAttribute('content', description); } })
        .on('meta[name="twitter:image"]', { element(e) { e.setAttribute('content', ogImageUrl); } })
        .on('title', { element(e) { e.setInnerContent(title); } })
        .transform(assetResponse);

      const headers = new Headers(transformed.headers);
      headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');

      return new Response(transformed.body, {
        status: 200,
        headers,
      });
    }

    // Default: serve static assets / SPA routing
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }
    return fetch(request);
  }
};

