/**
 * Date formatting utilities for consistent date display across the app
 * All dates default to Indonesian locale (id-ID)
 */

export type DateFormatStyle = "short" | "medium" | "long" | "full" | "relative";

/**
 * Format a date string or Date object to Indonesian locale
 *
 * @param date - Date string or Date object
 * @param style - Format style: "short", "medium", "long", "full", or "relative"
 * @returns Formatted date string
 *
 * @example
 * formatDate("2024-01-15") // "15 Jan 2024"
 * formatDate("2024-01-15", "long") // "15 Januari 2024"
 * formatDate("2024-01-15", "full") // "Senin, 15 Januari 2024"
 * formatDate("2024-01-15", "short") // "15/01/2024"
 */
export function formatDate(
  date: string | Date | undefined | null,
  style: DateFormatStyle = "medium"
): string {
  if (!date) return "-";

  const dateObj = typeof date === "string" ? new Date(date) : date;

  // Check for invalid date
  if (isNaN(dateObj.getTime())) return "-";

  const locale = "id-ID";

  switch (style) {
    case "short":
      return dateObj.toLocaleDateString(locale);

    case "medium":
      return dateObj.toLocaleDateString(locale, {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

    case "long":
      return dateObj.toLocaleDateString(locale, {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

    case "full":
      return dateObj.toLocaleDateString(locale, {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });

    case "relative":
      return getRelativeTime(dateObj);

    default:
      return dateObj.toLocaleDateString(locale, {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
  }
}

/**
 * Format a date with time
 *
 * @param date - Date string or Date object
 * @param includeSeconds - Whether to include seconds
 * @returns Formatted date and time string
 *
 * @example
 * formatDateTime("2024-01-15T14:30:00") // "15 Jan 2024, 14:30"
 */
export function formatDateTime(
  date: string | Date | undefined | null,
  includeSeconds: boolean = false
): string {
  if (!date) return "-";

  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) return "-";

  const locale = "id-ID";

  return dateObj.toLocaleString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    ...(includeSeconds && { second: "2-digit" }),
  });
}

/**
 * Get relative time string (e.g., "2 hari yang lalu")
 *
 * @param date - Date string or Date object
 * @returns Relative time string
 */
export function getRelativeTime(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSeconds < 60) return "Baru saja";
  if (diffMinutes < 60) return `${diffMinutes} menit yang lalu`;
  if (diffHours < 24) return `${diffHours} jam yang lalu`;
  if (diffDays === 1) return "Kemarin";
  if (diffDays < 7) return `${diffDays} hari yang lalu`;
  if (diffWeeks === 1) return "1 minggu yang lalu";
  if (diffWeeks < 4) return `${diffWeeks} minggu yang lalu`;
  if (diffMonths === 1) return "1 bulan yang lalu";
  if (diffMonths < 12) return `${diffMonths} bulan yang lalu`;
  if (diffYears === 1) return "1 tahun yang lalu";
  return `${diffYears} tahun yang lalu`;
}

/**
 * Format time only
 *
 * @param date - Date string or Date object
 * @returns Formatted time string (HH:mm)
 */
export function formatTime(date: string | Date | undefined | null): string {
  if (!date) return "-";

  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) return "-";

  return dateObj.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Check if date is today
 */
export function isToday(date: string | Date): boolean {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const today = new Date();
  return (
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  );
}

/**
 * Check if date is yesterday
 */
export function isYesterday(date: string | Date): boolean {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    dateObj.getDate() === yesterday.getDate() &&
    dateObj.getMonth() === yesterday.getMonth() &&
    dateObj.getFullYear() === yesterday.getFullYear()
  );
}
