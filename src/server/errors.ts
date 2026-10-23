/**
 * An error the user should see. It carries a message key under
 * "feedback.errors" rather than text, so actions can answer in the
 * viewer's language.
 */
export class AppError extends Error {
  constructor(
    readonly key: string,
    readonly values?: Record<string, string | number>,
  ) {
    super(key);
  }
}
