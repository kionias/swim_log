const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];
const DAY_NAMES_FULL = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];

/**
 * Format date string "2026-09-18" into "2026년 9월 18일 금요일"
 */
export function formatKoreanDate(dateStr: string, includeDayOfWeek: boolean = true): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  const dayName = DAY_NAMES_FULL[d.getDay()];

  if (includeDayOfWeek) {
    return `${year}년 ${month}월 ${day}일 ${dayName}`;
  }
  return `${year}년 ${month}월 ${day}일`;
}

/**
 * Get day of week for "2026-09-18" -> "금요일"
 */
export function getKoreanDayOfWeek(dateStr: string, short: boolean = false): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  return short ? DAY_NAMES[d.getDay()] : DAY_NAMES_FULL[d.getDay()];
}

/**
 * Format "2026" and "9" into "2026년 9월"
 */
export function formatYearMonth(year: number, month: number): string {
  return `${year}년 ${month}월`;
}

/**
 * Returns "YYYY-MM-DD" formatted string
 */
export function formatDateKey(year: number, month: number, day: number): string {
  const m = String(month).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
}

export interface CalendarDay {
  dateKey: string; // YYYY-MM-DD
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  dayOfWeek: number; // 0 (Sun) to 6 (Sat)
}

/**
 * Generate 35~42 calendar grid cells for given year and month (1-indexed month: 1~12)
 */
export function generateCalendarDays(year: number, month: number): CalendarDay[] {
  const today = new Date();
  const todayKey = formatDateKey(today.getFullYear(), today.getMonth() + 1, today.getDate());

  const firstDayOfMonth = new Date(year, month - 1, 1);
  const lastDayOfMonth = new Date(year, month, 0);

  const startDayOfWeek = firstDayOfMonth.getDay(); // 0 for Sunday
  const daysInMonth = lastDayOfMonth.getDate();

  const days: CalendarDay[] = [];

  // Previous month padding days
  const prevMonthLastDay = new Date(year, month - 1, 0).getDate();
  const prevYear = month === 1 ? year - 1 : year;
  const prevMonth = month === 1 ? 12 : month - 1;

  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const dayNumber = prevMonthLastDay - i;
    const dateKey = formatDateKey(prevYear, prevMonth, dayNumber);
    const d = new Date(prevYear, prevMonth - 1, dayNumber);
    days.push({
      dateKey,
      dayNumber,
      isCurrentMonth: false,
      isToday: dateKey === todayKey,
      dayOfWeek: d.getDay(),
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const dateKey = formatDateKey(year, month, d);
    const dateObj = new Date(year, month - 1, d);
    days.push({
      dateKey,
      dayNumber: d,
      isCurrentMonth: true,
      isToday: dateKey === todayKey,
      dayOfWeek: dateObj.getDay(),
    });
  }

  // Next month padding days to complete full weeks (multiples of 7)
  const remaining = (7 - (days.length % 7)) % 7;
  const nextYear = month === 12 ? year + 1 : year;
  const nextMonth = month === 12 ? 1 : month + 1;

  for (let i = 1; i <= remaining; i++) {
    const dateKey = formatDateKey(nextYear, nextMonth, i);
    const d = new Date(nextYear, nextMonth - 1, i);
    days.push({
      dateKey,
      dayNumber: i,
      isCurrentMonth: false,
      isToday: dateKey === todayKey,
      dayOfWeek: d.getDay(),
    });
  }

  return days;
}
