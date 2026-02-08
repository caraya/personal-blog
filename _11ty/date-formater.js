import { Temporal as Polyfill } from "@js-temporal/polyfill";

/**
 * Formats a date using the Temporal API (native or polyfill).
 * Defaults to ISO 8601 format.
 * * @param {string|Date} date - The date to format.
 * @param {string|object} [format="iso"] - The output format ("iso" or Intl options).
 * @param {string} [locale="en-US"] - The locale for formatting.
 * @returns {string} The formatted date string.
 */
export function formatDate(date, format = "iso", locale = "en-US") {
  // Use native Temporal if available, otherwise fallback to the imported polyfill
  const Temporal = globalThis.Temporal || Polyfill;

  let temporalDate;

  try {
    // 1. Strict Parse: Try to parse as a standard ISO string (e.g., "2026-04-15")
    temporalDate = Temporal.PlainDate.from(date);
  } catch (e) {
    // 2. Loose Fallback: If strict parsing fails, use Date() to handle messy strings
    try {
      const fallbackDate = date instanceof Date ? date : new Date(date);

      // Check for Invalid Date
      if (isNaN(fallbackDate.getTime())) {
        return `Invalid date (${date})`;
      }

      // Convert legacy Date -> Instant -> ZonedDateTime -> PlainDate
      temporalDate = Temporal.Instant
        .fromEpochMilliseconds(fallbackDate.getTime())
        .toZonedDateTimeISO("UTC")
        .toPlainDate();
    } catch (innerErr) {
      return `Invalid date (${date})`;
    }
  }

  // Return raw ISO string (YYYY-MM-DD)
  if (format === "iso") {
    return temporalDate.toString();
  }

  // Handle "long", "short", etc., or custom option objects
  const options = typeof format === "string"
    ? { dateStyle: format }
    : format;

  return temporalDate.toLocaleString(locale, options);
}
