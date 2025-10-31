// ✅ 10. FINAL CLEANUP: Remove unused imports and ensure no localhost URLs
// BGP SDK Utilities
// Utility functions for the BGP SDK

import { APIError } from './errors';

/**
 * Format currency amount for display
 */
export function formatAmount(amount: number | string, currency: string): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numAmount)) {
    return '0.00';
  }

  // Format based on currency
  if (['BTC', 'ETH', 'LTC'].includes(currency.toUpperCase())) {
    return numAmount.toFixed(8);
  }
  
  return numAmount.toFixed(2);
}

/**
 * Validate payment amount
 */
export function validateAmount(amount: number | string): boolean {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return !isNaN(numAmount) && numAmount > 0;
}

/**
 * Generate unique payment reference
 */
export function generatePaymentRef(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `BGP_${timestamp}_${random}`.toUpperCase();
}

/**
 * Validate email address
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Format payment status for display
 */
export function formatPaymentStatus(status: string): string {
  const statusMap: Record<string, string> = {
    'waiting': 'Waiting for Payment',
    'confirming': 'Confirming Payment',
    'confirmed': 'Payment Confirmed',
    'sending': 'Processing Payment',
    'partially_paid': 'Partially Paid',
    'finished': 'Payment Complete',
    'failed': 'Payment Failed',
    'refunded': 'Payment Refunded',
    'expired': 'Payment Expired'
  };
  
  return statusMap[status.toLowerCase()] || status;
}

/**
 * Get status color for UI components
 */
export function getStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    'waiting': 'text-yellow-600',
    'confirming': 'text-blue-600',
    'confirmed': 'text-green-600',
    'sending': 'text-blue-500',
    'partially_paid': 'text-orange-600',
    'finished': 'text-green-700',
    'failed': 'text-red-600',
    'refunded': 'text-purple-600',
    'expired': 'text-gray-600'
  };
  
  return colorMap[status.toLowerCase()] || 'text-gray-500';
}

/**
 * Parse API error for user-friendly display
 */
export function parseAPIError(error: any): string {
  if (error instanceof APIError) {
    return error.message;
  }
  
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
}

/**
 * Build query string from parameters
 */
export function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value.toString());
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

/**
 * Deep merge objects
 */
export function deepMerge(target: any, source: any): any {
  const result = { ...target };
  
  Object.keys(source).forEach(key => {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  });
  
  return result;
}