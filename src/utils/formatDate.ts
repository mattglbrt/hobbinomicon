/**
 * Format a date in a long format (e.g., "January 15, 2024")
 * @param date - Date to format
 * @returns Formatted date string
 */
export function formatDateLong(date: Date): string {
  return new Date(date).toLocaleDateString('en-us', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format a date in a short format (e.g., "Jan 15, 2024")
 * @param date - Date to format
 * @returns Formatted date string
 */
export function formatDateShort(date: Date): string {
  return new Date(date).toLocaleDateString('en-us', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
