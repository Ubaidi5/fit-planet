/** Longest search text matched against the database; longer input is cut */
export const MAX_SEARCH_LENGTH = 80;

/**
 * Search box text as literal regex source: special characters escaped, and
 * cut to a sane length so a huge query can't make every row scan slow. Takes
 * unknown because query strings can arrive as arrays.
 */
export function literalPattern(input: unknown) {
  const text = (Array.isArray(input) ? input[0] : input) ?? "";
  return String(text).trim().slice(0, MAX_SEARCH_LENGTH).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
