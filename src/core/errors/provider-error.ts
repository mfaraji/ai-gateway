import { BaseError } from './base-error';

export class ProviderError extends BaseError {
  public readonly details: {
    provider: string;
    originalError: { message: string; stack: string; name: string };
  };
  constructor(
    message: string,
    public readonly provider: string,
    public readonly originalError?: Error,
  ) {
    super(message);
    this.name = 'ProviderError';
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ProviderError);
    }
    this.details = {
      provider,
      originalError: originalError
        ? {
            message: originalError.message,
            stack: originalError.stack,
            name: originalError.name,
          }
        : undefined,
    };
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      provider: this.provider,
      details: this.details,
      stack: this.stack,
    };
  }
}
