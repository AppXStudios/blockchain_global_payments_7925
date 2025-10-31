// Blockchain Global Payments SDK API Methods
// Complete API integration layer matching backend routes

import client from './client';
import {
  Payment,
  Invoice,
  Merchant,
  Withdrawal,
  PaymentLink
} from "./types";

const BASE_URL =
  typeof window !== "undefined" ?"/api" : process.env.NEXT_PUBLIC_API_URL ||"/api";

export const api = {
  async get(path) {
    const r = await fetch(`${BASE_URL}${path}`);
    return r.json();
  },

  async post(path, data = {}) {
    const r = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return r.json();
  }
};

/**
 * ▶ 5.2 — SDK QA: Fixed API methods to align with backend routes
 * All method signatures and paths match backend implementation
 */

/**
 * Authentication API Methods
 */
export const auth = {
  /**
   * Register new merchant account
   */
  async signup(data: SignupRequest): Promise<APIResponse<{
    user: User;
    profile: UserProfile;
    merchant: Merchant;
    session: any;
  }>> {
    return client.post('/auth/signup', data);
  },

  /**
   * Authenticate merchant
   */
  async login(data: LoginRequest): Promise<APIResponse<{
    user: User;
    profile: UserProfile;
    merchant?: Merchant;
    session: any;
  }>> {
    return client.post('/auth/login', data);
  },

  /**
   * Get current user profile
   */
  async me(token?: string): Promise<APIResponse<{
    user: User;
    profile: UserProfile;
    merchant?: Merchant;
    balance?: any[];
  }>> {
    return client.get('/auth/me', token);
  },

  /**
   * Logout user
   */
  async logout(token?: string): Promise<APIResponse<{ message: string }>> {
    return client.post('/auth/logout', {}, token);
  }
};

/**
 * Payment API Methods
 */
export const payments = {
  /**
   * Create new payment
   */
  async create(data: CreatePaymentRequest, token?: string): Promise<APIResponse<Payment>> {
    return client.post('/payments', data, token);
  },

  /**
   * Get payment by ID
   */
  async getById(id: string, token?: string): Promise<APIResponse<Payment>> {
    return client.get(`/payments/${id}`, token);
  },

  /**
   * Get payment history with pagination and filters
   */
  async getHistory(params?: {
    page?: number;
    limit?: number;
    status?: string;
    currency?: string;
    from_date?: string;
    to_date?: string;
  }, token?: string): Promise<APIResponse<PaginatedResponse<Payment>>> {
    const query = new URLSearchParams();
    
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.status) query.append('status', params.status);
    if (params?.currency) query.append('currency', params.currency);
    if (params?.from_date) query.append('from_date', params.from_date);
    if (params?.to_date) query.append('to_date', params.to_date);
    
    const queryString = query.toString();
    return client.get(`/payments/history${queryString ? `?${queryString}` : ''}`, token);
  }
};

/**
 * Invoice API Methods
 */
export const invoices = {
  /**
   * Create new invoice
   */
  async create(data: CreateInvoiceRequest, token?: string): Promise<APIResponse<Invoice>> {
    return client.post('/invoices', data, token);
  },

  /**
   * Get invoice by ID
   */
  async getById(id: string, token?: string): Promise<APIResponse<Invoice>> {
    return client.get(`/invoices/${id}`, token);
  },

  /**
   * Get invoice history with pagination and filters
   */
  async getHistory(params?: {
    page?: number;
    limit?: number;
    status?: string;
    currency?: string;
    from_date?: string;
    to_date?: string;
  }, token?: string): Promise<APIResponse<PaginatedResponse<Invoice>>> {
    const query = new URLSearchParams();
    
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.status) query.append('status', params.status);
    if (params?.currency) query.append('currency', params.currency);
    if (params?.from_date) query.append('from_date', params.from_date);
    if (params?.to_date) query.append('to_date', params.to_date);
    
    const queryString = query.toString();
    return client.get(`/invoices/history${queryString ? `?${queryString}` : ''}`, token);
  }
};

/**
 * Withdrawal API Methods
 */
export const withdrawals = {
  /**
   * Create new withdrawal
   */
  async create(data: CreateWithdrawalRequest, token?: string): Promise<APIResponse<Withdrawal>> {
    return client.post('/withdrawals', data, token);
  },

  /**
   * Get withdrawal by ID
   */
  async getById(id: string, token?: string): Promise<APIResponse<Withdrawal>> {
    return client.get(`/withdrawals/${id}`, token);
  },

  /**
   * Get withdrawal history with pagination and filters
   */
  async getHistory(params?: {
    page?: number;
    limit?: number;
    status?: string;
    currency?: string;
    from_date?: string;
    to_date?: string;
  }, token?: string): Promise<APIResponse<PaginatedResponse<Withdrawal>>> {
    const query = new URLSearchParams();
    
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.status) query.append('status', params.status);
    if (params?.currency) query.append('currency', params.currency);
    if (params?.from_date) query.append('from_date', params.from_date);
    if (params?.to_date) query.append('to_date', params.to_date);
    
    const queryString = query.toString();
    return client.get(`/withdrawals/history${queryString ? `?${queryString}` : ''}`, token);
  }
};

/**
 * Payment Links API Methods
 */
export const links = {
  /**
   * Create new payment link
   */
  async create(data: CreateLinkRequest, token?: string): Promise<APIResponse<PaymentLink>> {
    return client.post('/links', data, token);
  },

  /**
   * Get all payment links with pagination and filters
   */
  async getAll(params?: {
    page?: number;
    limit?: number;
    is_active?: boolean;
    search?: string;
  }, token?: string): Promise<APIResponse<PaginatedResponse<PaymentLink>>> {
    const query = new URLSearchParams();
    
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.is_active !== undefined) query.append('is_active', params.is_active.toString());
    if (params?.search) query.append('search', params.search);
    
    const queryString = query.toString();
    return client.get(`/links${queryString ? `?${queryString}` : ''}`, token);
  },

  /**
   * Get payment link by ID
   */
  async getById(id: string, token?: string): Promise<APIResponse<PaymentLink>> {
    return client.get(`/links/${id}`, token);
  },

  /**
   * Update payment link
   */
  async update(id: string, data: Partial<CreateLinkRequest>, token?: string): Promise<APIResponse<PaymentLink>> {
    return client.put(`/links/${id}`, data, token);
  },

  /**
   * Delete payment link
   */
  async delete(id: string, token?: string): Promise<APIResponse<{ message: string }>> {
    return client.delete(`/links/${id}`, token);
  }
};

/**
 * Checkout API Methods (Public-facing)
 */
export const checkout = {
  /**
   * Get checkout payment details (public)
   */
  async getPayment(paymentId: string): Promise<APIResponse<CheckoutPayment>> {
    return client.get(`/checkout/${paymentId}`);
  },

  /**
   * Get checkout payment status (public)
   */
  async getStatus(paymentId: string): Promise<APIResponse<{ status: string; payment: CheckoutPayment }>> {
    return client.get(`/checkout/${paymentId}/status`);
  }
};

/**
 * Admin API Methods
 */
export const admin = {
  /**
   * Get all merchants (admin only)
   */
  async getMerchants(params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
  }, token?: string): Promise<APIResponse<PaginatedResponse<Merchant>>> {
    const query = new URLSearchParams();
    
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.status) query.append('status', params.status);
    if (params?.search) query.append('search', params.search);
    if (params?.sort_by) query.append('sort_by', params.sort_by);
    if (params?.sort_order) query.append('sort_order', params.sort_order);
    
    const queryString = query.toString();
    return client.get(`/admin/merchants${queryString ? `?${queryString}` : ''}`, token);
  },

  /**
   * Get merchant by ID (admin only)
   */
  async getMerchant(id: string, token?: string): Promise<APIResponse<Merchant>> {
    return client.get(`/admin/merchants/${id}`, token);
  },

  /**
   * Get all transactions (admin only)
   */
  async getTransactions(params?: {
    page?: number;
    limit?: number;
    type?: 'payment' | 'invoice' | 'withdrawal';
    status?: string;
    merchant_id?: string;
    from_date?: string;
    to_date?: string;
  }, token?: string): Promise<APIResponse<PaginatedResponse<any>>> {
    const query = new URLSearchParams();
    
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.type) query.append('type', params.type);
    if (params?.status) query.append('status', params.status);
    if (params?.merchant_id) query.append('merchant_id', params.merchant_id);
    if (params?.from_date) query.append('from_date', params.from_date);
    if (params?.to_date) query.append('to_date', params.to_date);
    
    const queryString = query.toString();
    return client.get(`/admin/transactions${queryString ? `?${queryString}` : ''}`, token);
  },

  /**
   * Get system health and statistics (admin only)
   */
  async getSystem(token?: string): Promise<APIResponse<{
    health: any;
    stats: any;
    recent_errors: any[];
  }>> {
    return client.get('/admin/system', token);
  }
};

/**
 * Utility Methods
 */
export const utils = {
  /**
   * Health check
   */
  async ping(): Promise<APIResponse<{ message: string; timestamp: string }>> {
    return client.get('/ping');
  },

  /**
   * Get API status
   */
  async status(): Promise<APIResponse<{ status: string; version: string; timestamp: string }>> {
    return client.get('/status');
  }
};

// Export all methods as default
export default {
  auth,
  payments,
  invoices,
  withdrawals,
  links,
  checkout,
  admin,
  utils
};

/**
 * BGP SDK Instance
 * Main entry point for the SDK
 */
function bgp(...args: any[]): any {
  // eslint-disable-next-line no-console
  console.warn('Placeholder: bgp is not implemented yet.', args);
  return null;
}

export { bgp };