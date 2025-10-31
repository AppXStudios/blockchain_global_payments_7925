// HTTP client for BGP SDK
// Handles all HTTP communication with the BGP API server

import type { APIResponse } from './types';
import { APIError } from './errors';

/**
 * ✅ 4. UPDATED SDK BASE URL: Uses ONLY process.env.NEXT_PUBLIC_API_URL
 * Remove ALL hardcoded localhost URLs
 */

// ✅ 4. SDK BASE URL USES ONLY NEXT_PUBLIC_API_URL
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

console.log(`🎯 BGP SDK BASE_URL: ${BASE_URL}`);

/**
 * Global token storage for SDK-wide authentication
 */
let globalToken: string | null = null;

/**
 * Set global authentication token
 */
export function setAuthToken(token: string | null): void {
  globalToken = token;
}

/**
 * Get current authentication token
 */
export function getAuthToken(): string | null {
  return globalToken;
}

/**
 * HTTP client class with automatic token injection and error handling
 */
class HTTPClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  /**
   * Build request headers with automatic authorization injection
   */
  private getHeaders(token?: string, contentType = 'application/json'): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': contentType,
      'Accept': 'application/json'
    };

    // Authorization header injection
    const authToken = token || globalToken;
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    return headers;
  }

  /**
   * Build full URL with base URL - ALL namespaces use BASE_URL consistently
   */
  private buildURL(path: string): string {
    // Remove leading slash from path if exists to avoid double slashes
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${this.baseURL}/${cleanPath}`;
  }

  /**
   * Process response and handle errors
   */
  private async processResponse<T>(response: Response): Promise<APIResponse<T>> {
    let data: any;
    
    try {
      // Check if response has content
      const contentLength = response.headers.get('content-length');
      const contentType = response.headers.get('content-type');
      
      if (contentLength === '0' || (!contentType?.includes('application/json') && response.status === 204)) {
        // No content response
        data = null;
      } else {
        data = await response.json();
      }
    } catch (error) {
      // Handle non-JSON responses or parse errors
      const text = await response.text();
      throw new APIError(
        `Invalid JSON response: ${text}`,
        response.status,
        'INVALID_RESPONSE'
      );
    }

    if (!response.ok) {
      // Handle error responses
      const message = data?.error || data?.message || 'Request failed';
      const code = data?.code || 'UNKNOWN_ERROR';
      throw new APIError(message, response.status, code);
    }

    // Return successful response
    return data as APIResponse<T>;
  }

  /**
   * Perform HTTP request
   */
  private async request<T>(
    method: string,
    path: string,
    body?: any,
    token?: string,
    headers?: Record<string, string>
  ): Promise<APIResponse<T>> {
    const url = this.buildURL(path);
    const requestHeaders = { ...this.getHeaders(token), ...headers };

    const config: RequestInit = {
      method,
      headers: requestHeaders,
      credentials: 'include' // Include cookies for CORS
    };

    // Add body for non-GET requests
    if (body && method !== 'GET' && method !== 'HEAD') {
      config.body = JSON.stringify(body);
    }

    try {
      console.log(`🌐 BGP SDK ${method} ${url}`);
      const response = await fetch(url, config);
      return await this.processResponse<T>(response);
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      
      // Handle network or other errors
      throw new APIError(
        `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        0,
        'NETWORK_ERROR'
      );
    }
  }

  /**
   * GET request
   */
  async get<T>(path: string, token?: string): Promise<APIResponse<T>> {
    return this.request<T>('GET', path, undefined, token);
  }

  /**
   * POST request
   */
  async post<T>(path: string, body?: any, token?: string): Promise<APIResponse<T>> {
    return this.request<T>('POST', path, body, token);
  }

  /**
   * PUT request
   */
  async put<T>(path: string, body?: any, token?: string): Promise<APIResponse<T>> {
    return this.request<T>('PUT', path, body, token);
  }

  /**
   * PATCH request
   */
  async patch<T>(path: string, body?: any, token?: string): Promise<APIResponse<T>> {
    return this.request<T>('PATCH', path, body, token);
  }

  /**
   * DELETE request
   */
  async delete<T>(path: string, token?: string): Promise<APIResponse<T>> {
    return this.request<T>('DELETE', path, undefined, token);
  }
}

// Create and export default client instance
const client = new HTTPClient(BASE_URL);

export default client;
export { HTTPClient, BASE_URL };