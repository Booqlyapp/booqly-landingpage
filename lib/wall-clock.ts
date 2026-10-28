/**
 * Business wall-clock helpers for public booking.
 * Must match Flutter `DateTime(...).toIso8601String()` (no Z / no offset shift)
 * and backend `parseBookingDateTime`.
 */

/** Local calendar date as YYYY-MM-DD (never use toISOString — shifts the day in US TZs). */
export function formatLocalDateYmd(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Parse YYYY-MM-DD as a local calendar date (not UTC midnight). */
export function parseLocalYmd(ymd: string): Date {
  const [y, m, d] = ymd.split('-').map((part) => parseInt(part, 10));
  return new Date(y, (m || 1) - 1, d || 1, 0, 0, 0, 0);
}

/** Local wall clock as `YYYY-MM-DDTHH:mm:ss.sss` without timezone suffix. */
export function formatWallClockDateTime(date: Date): string {
  const ymd = formatLocalDateYmd(date);
  const h = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  const s = String(date.getSeconds()).padStart(2, '0');
  const ms = String(date.getMilliseconds()).padStart(3, '0');
  return `${ymd}T${h}:${min}:${s}.${ms}`;
}
