// Blockchain Global Payments SDK Error System
// Custom error classes for BGP API interactions

export class BGPError extends Error {
  public status?: number;
  public code?: string;

  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.name = 'BGPError';
    this.status = status;
    this.code = code;

    // Maintains proper stack trace for where error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BGPError);
    }
  }

  static fromResponse(response: any, status: number): BGPError {
    const message = response?.error || response?.message || 'Unknown API error';
    const code = response?.code || `HTTP_${status}`;
    return new BGPError(message, status, code);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      code: this.code,
      stack: this.stack
    };
  }
}

export class APIError extends BGPError {
  constructor(message: string, status?: number, code?: string) {
    super(message, status, code);
    this.name = 'APIError';
  }
}

export class NetworkError extends BGPError {
  constructor(message: string, status?: number, code?: string) {
    super(message, status, code);
    this.name = 'NetworkError';
  }
}

export class ValidationError extends BGPError {
  constructor(message: string, status?: number, code?: string) {
    super(message, status, code);
    this.name = 'ValidationError';
  }
}

export default BGPError;
