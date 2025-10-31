// ===========================
// CORE ENTITY TYPES
// ===========================

export interface Merchant {
  id: string;
  email?: string;
  name?: string;
  custody_account_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Payment {
  id: string;
  payment_id?: string;
  merchant_id?: string;
  status?: string;
  price_amount?: number;
  price_currency?: string;
  pay_amount?: number;
  pay_currency?: string;
  pay_address?: string;
  actually_paid?: number;
  parent_payment_id?: string | null;
  extra?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface Invoice {
  id: string;
  merchant_id?: string;
  amount?: number;
  currency?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Withdrawal {
  id: string;
  merchant_id?: string;
  crypto_currency?: string;
  fiat_currency?: string;
  amount?: number;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PaymentLink {
  id: string;
  merchant_id?: string;
  url?: string;
  amount?: number;
  currency?: string;
  created_at?: string;
  updated_at?: string;
}

// ===========================
// API RESPONSE TYPES
// ===========================

export interface APIResponse<T = any> {
  success?: boolean;
  data?: T;
  error?: string;
  message?: string;
  code?: string;
}
