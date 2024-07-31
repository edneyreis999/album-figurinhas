export class NegativeNumberNotAllowedError extends Error {
  constructor(message?: string) {
    const msg = message ?? 'Amount must be greater than 0';
    super(msg);
    this.name = 'NegativeNumberNotAllowedError';
  }
}
