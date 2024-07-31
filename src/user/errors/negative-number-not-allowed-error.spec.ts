import { NegativeNumberNotAllowedError } from './negative-number-not-allowed-error';

describe('NegativeNumberNotAllowedError', () => {
  it('should format error message correctly with message', () => {
    const error = new NegativeNumberNotAllowedError('mock message');
    expect(error.message).toEqual('mock message');
  });

  it('should throw default message when message is empty', () => {
    const error = new NegativeNumberNotAllowedError();
    expect(error.message).toEqual('Amount must be greater than 0');
  });

  it('should have NegativeNumberNotAllowedError instance', () => {
    const error = new NegativeNumberNotAllowedError();
    expect(error instanceof NegativeNumberNotAllowedError).toBeTruthy();
  });

  it('should have correct name property', () => {
    const error = new NegativeNumberNotAllowedError();
    expect(error.name).toEqual('NegativeNumberNotAllowedError');
  });

  it('should have correct stack trace', () => {
    const error = new NegativeNumberNotAllowedError();
    expect(error.stack).toBeDefined();
  });
});
