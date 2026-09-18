export const SWIM_QUOTES: string[] = [
  "오늘의 한 바퀴가 내일의 실력을 만든다.",
  "물속에서는 꾸준함이 가장 강한 힘이다.",
  "빠르게보다 정확하게.",
  "한 번의 스트로크도 헛되지 않는다.",
  "숨이 찰 때 멈추지 않는 사람이 물의 흐름을 지배한다.",
  "수영은 물과의 싸움이 아니라 물과 친해지는 과정이다.",
  "조용한 수면 아래서 가장 뜨거운 땀방울이 흐른다.",
  "매일의 영법 연습이 자유로운 물살을 완성한다."
];

export function getRandomQuote(): string {
  const index = Math.floor(Math.random() * SWIM_QUOTES.length);
  return SWIM_QUOTES[index];
}

/**
 * Deterministic quote for a specific date string (so refreshing doesn't constantly change it)
 */
export function getQuoteForDate(dateStr: string): string {
  if (!dateStr) return SWIM_QUOTES[0];
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash << 5) - hash + dateStr.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % SWIM_QUOTES.length;
  return SWIM_QUOTES[index];
}

