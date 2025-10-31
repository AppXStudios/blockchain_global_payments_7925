// Blockchain Global Payments SDK Error System
// Custom error class for BGP API interactions

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

export default BGPError;
function APIError(...args: any[]): any {
  // eslint-disable-next-line no-console
  console.warn('Placeholder: APIError is not implemented yet.', args);
  return null;
}

export { APIError };
function NetworkError(...args: any[]): any {
  // eslint-disable-next-line no-console
  console.warn('Placeholder: NetworkError is not implemented yet.', args);
  return null;
}

export { NetworkError };
function ValidationError(...args: any[]): any {
  // eslint-disable-next-line no-console
  console.warn('Placeholder: ValidationError is not implemented yet.', args);
  return null;
}

export { ValidationError };