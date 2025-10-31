// BGP SDK React Integration
// Provides React-compatible SDK methods with proper error handling

import { auth, payments, invoices, withdrawals, links, checkout, admin, utils } from '../../lib/sdk/api';
import { setAuthToken, getAuthToken } from '../../lib/sdk/client';

/**
 * ▶ 5.2 — SDK QA: React integration layer for BGP SDK
 * Provides React-compatible methods with proper error handling and state management
 */

// Export authentication methods
export const bgpAuth = {
  ...auth,
  setToken: setAuthToken,
  getToken: getAuthToken,
  
  // React-specific method to handle login with token storage
  async loginWithStorage(credentials) {
    try {
      const response = await auth?.login(credentials);
      if (response?.success && response?.data?.session?.access_token) {
        setAuthToken(response?.data?.session?.access_token);
      }
      return response;
    } catch (error) {
      console.error('🚨 BGP Login error:', error);
      throw error;
    }
  },

  // React-specific method to handle logout with token cleanup
  async logoutWithCleanup() {
    try {
      const token = getAuthToken();
      const response = await auth?.logout(token);
      setAuthToken(null); // Clear stored token
      return response;
    } catch (error) {
      console.error('🚨 BGP Logout error:', error);
      setAuthToken(null); // Clear token even on error
      throw error;
    }
  }
};

// Export payment methods with automatic token injection
export const bgpPayments = {
  async create(data) {
    const token = getAuthToken();
    return payments?.create(data, token);
  },
  
  async getById(id) {
    const token = getAuthToken();
    return payments?.getById(id, token);
  },
  
  async getHistory(params = {}) {
    const token = getAuthToken();
    return payments?.getHistory(params, token);
  }
};

// Export invoice methods with automatic token injection
export const bgpInvoices = {
  async create(data) {
    const token = getAuthToken();
    return invoices?.create(data, token);
  },
  
  async getById(id) {
    const token = getAuthToken();
    return invoices?.getById(id, token);
  },
  
  async getHistory(params = {}) {
    const token = getAuthToken();
    return invoices?.getHistory(params, token);
  }
};

// Export withdrawal methods with automatic token injection
export const bgpWithdrawals = {
  async create(data) {
    const token = getAuthToken();
    return withdrawals?.create(data, token);
  },
  
  async getById(id) {
    const token = getAuthToken();
    return withdrawals?.getById(id, token);
  },
  
  async getHistory(params = {}) {
    const token = getAuthToken();
    return withdrawals?.getHistory(params, token);
  }
};

// Export payment links methods with automatic token injection
export const bgpLinks = {
  async create(data) {
    const token = getAuthToken();
    return links?.create(data, token);
  },
  
  async getAll(params = {}) {
    const token = getAuthToken();
    return links?.getAll(params, token);
  },
  
  async getById(id) {
    const token = getAuthToken();
    return links?.getById(id, token);
  },
  
  async update(id, data) {
    const token = getAuthToken();
    return links?.update(id, data, token);
  },
  
  async delete(id) {
    const token = getAuthToken();
    return links?.delete(id, token);
  }
};

// Export checkout methods (public, no token required)
export const bgpCheckout = {
  ...checkout
};

// Export admin methods with automatic token injection
export const bgpAdmin = {
  async getMerchants(params = {}) {
    const token = getAuthToken();
    return admin?.getMerchants(params, token);
  },
  
  async getMerchant(id) {
    const token = getAuthToken();
    return admin?.getMerchant(id, token);
  },
  
  async getTransactions(params = {}) {
    const token = getAuthToken();
    return admin?.getTransactions(params, token);
  },
  
  async getSystem() {
    const token = getAuthToken();
    return admin?.getSystem(token);
  }
};

// Export utility methods (public)
export const bgpUtils = {
  ...utils
};

// ▶ 5.2 — SDK QA: Default export for easy import
const bgpSDK = {
  auth: bgpAuth,
  payments: bgpPayments,
  invoices: bgpInvoices,
  withdrawals: bgpWithdrawals,
  links: bgpLinks,
  checkout: bgpCheckout,
  admin: bgpAdmin,
  utils: bgpUtils,
  setToken: setAuthToken,
  getToken: getAuthToken
};

export default bgpSDK;

// React hook for BGP SDK integration
export function useBGP() {
  return bgpSDK;
}

console.log('🎯 BGP React SDK initialized');
function bgp(...args) {
  // eslint-disable-next-line no-console
  console.warn('Placeholder: bgp is not implemented yet.', args);
  return null;
}

export { bgp };