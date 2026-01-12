/**
 * Normalize a date to midnight UTC and convert to ISO string.
 * Useful for form submissions where time component is not relevant.
 *
 * @param date - The date to normalize (can be Date, string, null, or undefined)
 * @returns ISO string of date at midnight UTC, or null if no date provided
 *
 * @example
 * ```typescript
 * normalizeDateToISO(new Date('2024-03-15T14:30:00Z')) // '2024-03-15T00:00:00.000Z'
 * normalizeDateToISO('2024-03-15') // '2024-03-15T00:00:00.000Z'
 * normalizeDateToISO(null) // null
 * ```
 */
export function normalizeDateToISO(date: Date | string | null | undefined): string | null {
  if (!date) {
    return null;
  }

  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const normalized = new Date(dateObj);
  normalized.setUTCHours(0, 0, 0, 0);

  return normalized.toISOString();
}
