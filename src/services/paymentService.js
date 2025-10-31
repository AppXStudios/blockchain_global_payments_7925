import { supabase } from '../lib/supabase';

const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Get auth token for API requests
const getAuthToken = async () => {
  const { data: { session } } = await supabase?.auth?.getSession();
  return session?.access_token;
};

// Create API request with auth
const apiRequest = async (endpoint, options = {}) => {
  const token = await getAuthToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers
    },
    ...options
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const data = await response?.json();

  if (!response?.ok) {
    throw new Error(data.error || 'API request failed');
  }

  return data;
};

// Payment Service Functions
export const paymentService = {
  // Create new payment
  async createPayment(paymentData) {
    try {
      const response = await apiRequest('/payments', {
        method: 'POST',
        body: JSON.stringify(paymentData)
      });
      return { data: response?.data, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get payment details
  async getPayment(paymentId) {
    try {
      const response = await apiRequest(`/payments/${paymentId}`);
      return { data: response?.data, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get payment history
  async getPayments(params = {}) {
    try {
      const queryString = new URLSearchParams(params)?.toString();
      const response = await apiRequest(`/payments?${queryString}`);
      return { data: response?.data, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get payment status (for real-time updates)
  async getPaymentStatus(paymentId) {
    try {
      const response = await apiRequest(`/checkout/${paymentId}/status`);
      return { data: response?.data, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  }
};

// Invoice Service Functions
export const invoiceService = {
  // Create new invoice
  async createInvoice(invoiceData) {
    try {
      const response = await apiRequest('/invoices', {
        method: 'POST',
        body: JSON.stringify(invoiceData)
      });
      return { data: response?.data, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get invoice details
  async getInvoice(invoiceId) {
    try {
      const response = await apiRequest(`/invoices/${invoiceId}`);
      return { data: response?.data, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get invoice history
  async getInvoices(params = {}) {
    try {
      const queryString = new URLSearchParams(params)?.toString();
      const response = await apiRequest(`/invoices?${queryString}`);
      return { data: response?.data, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  }
};

// Withdrawal Service Functions
export const withdrawalService = {
  // Create new withdrawal
  async createWithdrawal(withdrawalData) {
    try {
      const response = await apiRequest('/withdrawals', {
        method: 'POST',
        body: JSON.stringify(withdrawalData)
      });
      return { data: response?.data, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get withdrawal details
  async getWithdrawal(withdrawalId) {
    try {
      const response = await apiRequest(`/withdrawals/${withdrawalId}`);
      return { data: response?.data, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get withdrawal history
  async getWithdrawals(params = {}) {
    try {
      const queryString = new URLSearchParams(params)?.toString();
      const response = await apiRequest(`/withdrawals?${queryString}`);
      return { data: response?.data, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  }
};

// Payment Links Service Functions
export const paymentLinksService = {
  // Create new payment link
  async createPaymentLink(linkData) {
    try {
      const response = await apiRequest('/links', {
        method: 'POST',
        body: JSON.stringify(linkData)
      });
      return { data: response?.data, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get payment link details
  async getPaymentLink(linkId) {
    try {
      const response = await apiRequest(`/links/${linkId}`);
      return { data: response?.data, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get payment links
  async getPaymentLinks(params = {}) {
    try {
      const queryString = new URLSearchParams(params)?.toString();
      const response = await apiRequest(`/links?${queryString}`);
      return { data: response?.data, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Update payment link
  async updatePaymentLink(linkId, updateData) {
    try {
      const response = await apiRequest(`/links/${linkId}`, {
        method: 'PUT',
        body: JSON.stringify(updateData)
      });
      return { data: response?.data, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Delete payment link
  async deletePaymentLink(linkId) {
    try {
      const response = await apiRequest(`/links/${linkId}`, {
        method: 'DELETE'
      });
      return { data: response?.data, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  }
};

// Checkout Service Functions (Public)
export const checkoutService = {
  // Get checkout details (public endpoint)
  async getCheckoutDetails(paymentId) {
    try {
      const response = await fetch(`${API_BASE_URL}/checkout/${paymentId}`);
      const data = await response?.json();

      if (!response?.ok) {
        throw new Error(data.error || 'Failed to get checkout details');
      }

      return { data: data?.data, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get payment status for hosted checkout
  async getCheckoutStatus(paymentId) {
    try {
      const response = await fetch(`${API_BASE_URL}/checkout/${paymentId}/status`);
      const data = await response?.json();

      if (!response?.ok) {
        throw new Error(data.error || 'Failed to get payment status');
      }

      return { data: data?.data, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get payment link checkout details
  async getPaymentLinkCheckout(linkId) {
    try {
      const response = await fetch(`${API_BASE_URL}/checkout/link/${linkId}`);
      const data = await response?.json();

      if (!response?.ok) {
        throw new Error(data.error || 'Failed to get payment link details');
      }

      return { data: data?.data, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  }
};

// Admin Service Functions
export const adminService = {
  // Get merchants
  async getMerchants(params = {}) {
    try {
      const queryString = new URLSearchParams(params)?.toString();
      const response = await apiRequest(`/admin/merchants?${queryString}`);
      return { data: response?.data, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get merchant details
  async getMerchant(merchantId) {
    try {
      const response = await apiRequest(`/admin/merchants/${merchantId}`);
      return { data: response?.data, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get system transactions
  async getTransactions(params = {}) {
    try {
      const queryString = new URLSearchParams(params)?.toString();
      const response = await apiRequest(`/admin/transactions?${queryString}`);
      return { data: response?.data, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get system health
  async getSystemHealth() {
    try {
      const response = await apiRequest('/admin/system');
      return { data: response?.data, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  }
};

// Auth Service Functions
export const authService = {
  // Sign up new merchant
  async signUp(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const data = await response?.json();

      if (!response?.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      return { data: data?.data, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Sign in merchant
  async signIn(credentials) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      const data = await response?.json();

      if (!response?.ok) {
        throw new Error(data.error || 'Login failed');
      }

      return { data: data?.data, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get current user profile
  async getProfile() {
    try {
      const response = await apiRequest('/auth/me');
      return { data: response?.data, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  }
};