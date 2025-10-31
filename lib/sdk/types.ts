// Blockchain Global Payments SDK Type Definitions
// Complete type system for BGP API integration

/**
 * Common status types based on database enums
 */
export type PaymentStatus = 
  | 'waiting' |'confirming' |'confirmed' |'sending' |'partially_paid' |'finished' |'failed' |'refunded' |'expired';

export type InvoiceStatus = 
  | 'waiting' |'confirming' |'confirmed' |'finished' |'failed' |'refunded' |'expired';

export type WithdrawalStatus = 
  | 'pending' |'processing' |'completed' |'failed' |'cancelled';

export type MerchantStatus = 
  | 'pending' |'active' |'suspended' |'inactive';

export type UserRole = 
  | 'merchant' |'admin' |'support';

export type WebhookEventType = 
  | 'payment' |'invoice' |'withdrawal' |'system';

/**
 * HTTP method types
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * User & Authentication Types
 */
export interface User {
  id: string;
  email: string;
  created_at?: string;
  updated_at?: string;
  last_sign_in_at?: string;
  email_confirmed_at?: string;
  phone?: string;
  phone_confirmed_at?: string;
  user_metadata?: Record<string, any>;
  app_metadata?: Record<string, any>;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  avatar_url?: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Merchant {
  id: string;
  user_id: string;
  business_name: string;
  business_email?: string;
  business_phone?: string;
  business_address?: string;
  website_url?: string;
  status: MerchantStatus;
  verification_level: number;
  created_at: string;
  updated_at: string;
}

export interface Balance {
  currency: string;
  available: number;
  pending: number;
  total: number;
}

/**
 * Authentication Request Types
 */
export interface SignupRequest {
  email: string;
  password: string;
  full_name?: string;
  business_name: string;
  business_email?: string;
  business_phone?: string;
  website_url?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Payment Types
 */
export interface Payment {
  id: string;
  merchant_id: string;
  payment_id: string;
  order_id?: string;
  price_amount: number;
  price_currency: string;
  pay_amount?: number;
  pay_currency?: string;
  pay_address?: string;
  payin_extra_id?: string;
  outcome_amount?: number;
  outcome_currency?: string;
  payout_address?: string;
  payout_currency?: string;
  payout_extra_id?: string;
  actually_paid?: number;
  status: PaymentStatus;
  is_fixed_rate: boolean;
  is_fee_paid_by_user: boolean;
  time_limit?: number;
  burning_percent?: number;
  expiration_estimate_date?: string;
  valid_until?: string;
  network?: string;
  network_precision?: number;
  smart_contract?: string;
  ipn_callback_url?: string;
  success_url?: string;
  cancel_url?: string;
  partially_paid_url?: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePaymentRequest {
  price_amount: number;
  price_currency: string;
  pay_currency?: string;
  order_id?: string;
  order_description?: string;
  payout_address?: string;
  payout_currency?: string;
  payout_extra_id?: string;
  is_fixed_rate?: boolean;
  is_fee_paid_by_user?: boolean;
  ipn_callback_url?: string;
  success_url?: string;
  cancel_url?: string;
  partially_paid_url?: string;
}

/**
 * Invoice Types
 */
export interface Invoice {
  id: string;
  merchant_id: string;
  invoice_id: string;
  order_id?: string;
  order_description?: string;
  price_amount: number;
  price_currency: string;
  pay_currency?: string;
  payout_address?: string;
  payout_currency?: string;
  payout_extra_id?: string;
  status: InvoiceStatus;
  fixed_rate: boolean;
  due_date?: string;
  invoice_url?: string;
  ipn_callback_url?: string;
  success_url?: string;
  cancel_url?: string;
  partially_paid_url?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateInvoiceRequest {
  price_amount: number;
  price_currency: string;
  pay_currency?: string;
  order_id?: string;
  order_description?: string;
  payout_address?: string;
  payout_currency?: string;
  payout_extra_id?: string;
  fixed_rate?: boolean;
  due_date?: string;
  ipn_callback_url?: string;
  success_url?: string;
  cancel_url?: string;
  partially_paid_url?: string;
}

/**
 * Withdrawal Types
 */
export interface Withdrawal {
  id: string;
  merchant_id: string;
  withdrawal_id: string;
  currency: string;
  requested_amount: number;
  processed_amount?: number;
  actual_amount?: number;
  network_fee?: number;
  address: string;
  extra_id?: string;
  hash?: string;
  status: WithdrawalStatus;
  ipn_callback_url?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateWithdrawalRequest {
  currency: string;
  amount: number;
  address: string;
  extra_id?: string;
  ipn_callback_url?: string;
}

/**
 * Payment Link Types
 */
export interface PaymentLink {
  id: string;
  merchant_id: string;
  title: string;
  description?: string;
  price_amount: number;
  price_currency: string;
  pay_currency?: string;
  link_url?: string;
  is_active: boolean;
  max_uses?: number;
  usage_count: number;
  expires_at?: string;
  success_url?: string;
  cancel_url?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateLinkRequest {
  title: string;
  description?: string;
  price_amount: number;
  price_currency: string;
  pay_currency?: string;
  max_uses?: number;
  expires_at?: string;
  success_url?: string;
  cancel_url?: string;
}

/**
 * Checkout Types (Public-facing)
 */
export interface CheckoutPayment {
  payment_id: string;
  price_amount: number;
  price_currency: string;
  pay_amount?: number;
  pay_currency?: string;
  pay_address?: string;
  payin_extra_id?: string;
  status: PaymentStatus;
  time_limit?: number;
  valid_until?: string;
  qr_code_url?: string;
  checkout_url?: string;
  network?: string;
  smart_contract?: string;
  expiration_estimate_date?: string;
}

/**
 * API Key Types
 */
export interface APIKey {
  id: string;
  merchant_id: string;
  api_key: string;
  key_name: string;
  permissions: string[];
  is_active: boolean;
  expires_at?: string;
  last_used_at?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Notification Settings Types
 */
export interface NotificationSettings {
  id: string;
  merchant_id: string;
  email_notifications: boolean;
  sms_notifications: boolean;
  webhook_notifications: boolean;
  payment_updates: boolean;
  invoice_updates: boolean;
  withdrawal_updates: boolean;
  security_alerts: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Webhook Event Types
 */
export interface WebhookEvent {
  id: string;
  event_type: WebhookEventType;
  payload: Record<string, any>;
  signature?: string;
  source_ip?: string;
  payment_id?: string;
  invoice_id?: string;
  withdrawal_id?: string;
  processed: boolean;
  error_message?: string;
  created_at: string;
}

/**
 * Response wrapper types
 */
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  timestamp?: string;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

/**
 * Error Types
 */
export interface BGPErrorData {
  message: string;
  code?: string;
  status?: number;
  details?: any;
}

/**
 * SDK Configuration Constants
 */
export const SDK_TYPES = {
  // Status constants
  PAYMENT_STATUS: {
    WAITING: 'waiting' as const,
    CONFIRMING: 'confirming' as const,
    CONFIRMED: 'confirmed' as const,
    SENDING: 'sending' as const,
    PARTIALLY_PAID: 'partially_paid' as const,
    FINISHED: 'finished' as const,
    FAILED: 'failed' as const,
    REFUNDED: 'refunded' as const,
    EXPIRED: 'expired' as const
  },
  INVOICE_STATUS: {
    WAITING: 'waiting' as const,
    CONFIRMING: 'confirming' as const,
    CONFIRMED: 'confirmed' as const,
    FINISHED: 'finished' as const,
    FAILED: 'failed' as const,
    REFUNDED: 'refunded' as const,
    EXPIRED: 'expired' as const
  },
  WITHDRAWAL_STATUS: {
    PENDING: 'pending' as const,
    PROCESSING: 'processing' as const,
    COMPLETED: 'completed' as const,
    FAILED: 'failed' as const,
    CANCELLED: 'cancelled' as const
  },
  MERCHANT_STATUS: {
    PENDING: 'pending' as const,
    ACTIVE: 'active' as const,
    SUSPENDED: 'suspended' as const,
    INACTIVE: 'inactive' as const
  },
  USER_ROLE: {
    MERCHANT: 'merchant' as const,
    ADMIN: 'admin' as const,
    SUPPORT: 'support' as const
  },
  WEBHOOK_EVENT_TYPE: {
    PAYMENT: 'payment' as const,
    INVOICE: 'invoice' as const,
    WITHDRAWAL: 'withdrawal' as const,
    SYSTEM: 'system' as const
  }
} as const;

// Export status constants for easy import
export const PAYMENT_STATUS = SDK_TYPES.PAYMENT_STATUS;
export const INVOICE_STATUS = SDK_TYPES.INVOICE_STATUS;
export const WITHDRAWAL_STATUS = SDK_TYPES.WITHDRAWAL_STATUS;
export const MERCHANT_STATUS = SDK_TYPES.MERCHANT_STATUS;
export const USER_ROLE = SDK_TYPES.USER_ROLE;
export const WEBHOOK_EVENT_TYPE = SDK_TYPES.WEBHOOK_EVENT_TYPE;