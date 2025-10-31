-- Migration: Create Complete Blockchain Global Payments Schema
-- Created: 2025-10-31 07:13:15
-- Purpose: Complete database schema for BGP platform with NOWPayments integration

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Custom Types
CREATE TYPE merchant_status AS ENUM ('pending', 'active', 'suspended', 'inactive');
CREATE TYPE payment_status AS ENUM ('waiting', 'confirming', 'confirmed', 'sending', 'partially_paid', 'finished', 'failed', 'refunded', 'expired');
CREATE TYPE invoice_status AS ENUM ('waiting', 'confirming', 'confirmed', 'finished', 'failed', 'refunded', 'expired');
CREATE TYPE withdrawal_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'cancelled');
CREATE TYPE user_role AS ENUM ('merchant', 'admin', 'support');
CREATE TYPE webhook_event_type AS ENUM ('payment', 'invoice', 'withdrawal', 'system');

-- Core User Tables
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    phone TEXT,
    role user_role DEFAULT 'merchant',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Merchant Management
CREATE TABLE merchants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    business_name TEXT NOT NULL,
    business_email TEXT,
    business_phone TEXT,
    business_address TEXT,
    website_url TEXT,
    status merchant_status DEFAULT 'pending',
    verification_level INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- NOWPayments Custody Integration
CREATE TABLE custody_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
    nowpayments_user_id TEXT UNIQUE NOT NULL,
    api_key TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Payment Management
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
    payment_id TEXT UNIQUE NOT NULL, -- NOWPayments payment ID
    order_id TEXT,
    status payment_status DEFAULT 'waiting',
    price_amount DECIMAL(20,8) NOT NULL,
    price_currency TEXT NOT NULL DEFAULT 'USD',
    pay_amount DECIMAL(28,12),
    actually_paid DECIMAL(28,12),
    pay_currency TEXT,
    pay_address TEXT,
    payin_extra_id TEXT,
    smart_contract TEXT,
    network TEXT,
    network_precision INTEGER,
    time_limit INTEGER,
    burning_percent DECIMAL(5,2),
    expiration_estimate_date TIMESTAMPTZ,
    is_fixed_rate BOOLEAN DEFAULT false,
    is_fee_paid_by_user BOOLEAN DEFAULT false,
    valid_until TIMESTAMPTZ,
    outcome_amount DECIMAL(28,12),
    outcome_currency TEXT,
    ipn_callback_url TEXT,
    success_url TEXT,
    cancel_url TEXT,
    partially_paid_url TEXT,
    payout_address TEXT,
    payout_currency TEXT,
    payout_extra_id TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Invoice Management
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
    invoice_id TEXT UNIQUE NOT NULL, -- NOWPayments invoice ID
    order_id TEXT,
    order_description TEXT,
    status invoice_status DEFAULT 'waiting',
    price_amount DECIMAL(20,8) NOT NULL,
    price_currency TEXT NOT NULL DEFAULT 'USD',
    pay_currency TEXT,
    ipn_callback_url TEXT,
    invoice_url TEXT,
    success_url TEXT,
    cancel_url TEXT,
    partially_paid_url TEXT,
    payout_address TEXT,
    payout_currency TEXT,
    payout_extra_id TEXT,
    fixed_rate BOOLEAN DEFAULT false,
    due_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Withdrawal Management
CREATE TABLE withdrawals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
    withdrawal_id TEXT UNIQUE NOT NULL, -- NOWPayments withdrawal ID
    status withdrawal_status DEFAULT 'pending',
    requested_amount DECIMAL(28,12) NOT NULL,
    currency TEXT NOT NULL,
    address TEXT NOT NULL,
    extra_id TEXT,
    ipn_callback_url TEXT,
    processed_amount DECIMAL(28,12),
    network_fee DECIMAL(28,12),
    actual_amount DECIMAL(28,12),
    hash TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Payment Links
CREATE TABLE payment_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    price_amount DECIMAL(20,8) NOT NULL,
    price_currency TEXT NOT NULL DEFAULT 'USD',
    pay_currency TEXT,
    success_url TEXT,
    cancel_url TEXT,
    link_url TEXT UNIQUE,
    is_active BOOLEAN DEFAULT true,
    usage_count INTEGER DEFAULT 0,
    max_uses INTEGER,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Webhook Events Log
CREATE TABLE webhook_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type webhook_event_type NOT NULL,
    payment_id TEXT,
    invoice_id TEXT,
    withdrawal_id TEXT,
    payload JSONB NOT NULL,
    signature TEXT,
    source_ip TEXT,
    processed BOOLEAN DEFAULT false,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Notification Settings
CREATE TABLE notification_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
    email_notifications BOOLEAN DEFAULT true,
    sms_notifications BOOLEAN DEFAULT false,
    webhook_notifications BOOLEAN DEFAULT true,
    payment_updates BOOLEAN DEFAULT true,
    invoice_updates BOOLEAN DEFAULT true,
    withdrawal_updates BOOLEAN DEFAULT true,
    security_alerts BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- API Keys Management
CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
    key_name TEXT NOT NULL,
    api_key TEXT UNIQUE NOT NULL,
    permissions JSONB DEFAULT '["read"]'::jsonb,
    is_active BOOLEAN DEFAULT true,
    last_used_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Performance Indexes
CREATE INDEX idx_merchants_user_id ON merchants(user_id);
CREATE INDEX idx_merchants_status ON merchants(status);
CREATE INDEX idx_custody_accounts_merchant_id ON custody_accounts(merchant_id);
CREATE INDEX idx_payments_merchant_id ON payments(merchant_id);
CREATE INDEX idx_payments_payment_id ON payments(payment_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_created_at ON payments(created_at);
CREATE INDEX idx_invoices_merchant_id ON invoices(merchant_id);
CREATE INDEX idx_invoices_invoice_id ON invoices(invoice_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_withdrawals_merchant_id ON withdrawals(merchant_id);
CREATE INDEX idx_withdrawals_status ON withdrawals(status);
CREATE INDEX idx_payment_links_merchant_id ON payment_links(merchant_id);
CREATE INDEX idx_webhook_events_processed ON webhook_events(processed);
CREATE INDEX idx_webhook_events_created_at ON webhook_events(created_at);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE custody_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawals ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- User Profiles
CREATE POLICY "users_manage_own_profiles" ON user_profiles
    FOR ALL TO authenticated
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());

-- Merchants
CREATE POLICY "users_manage_own_merchants" ON merchants
    FOR ALL TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- Admin access to all merchants
CREATE POLICY "admin_view_all_merchants" ON merchants
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles up
            WHERE up.id = auth.uid() AND up.role = 'admin'
        )
    );

-- Custody Accounts
CREATE POLICY "users_manage_own_custody_accounts" ON custody_accounts
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM merchants m
            WHERE m.id = custody_accounts.merchant_id AND m.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM merchants m
            WHERE m.id = custody_accounts.merchant_id AND m.user_id = auth.uid()
        )
    );

-- Payments
CREATE POLICY "users_manage_own_payments" ON payments
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM merchants m
            WHERE m.id = payments.merchant_id AND m.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM merchants m
            WHERE m.id = payments.merchant_id AND m.user_id = auth.uid()
        )
    );

-- Admin access to all payments
CREATE POLICY "admin_view_all_payments" ON payments
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles up
            WHERE up.id = auth.uid() AND up.role = 'admin'
        )
    );

-- Invoices
CREATE POLICY "users_manage_own_invoices" ON invoices
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM merchants m
            WHERE m.id = invoices.merchant_id AND m.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM merchants m
            WHERE m.id = invoices.merchant_id AND m.user_id = auth.uid()
        )
    );

-- Withdrawals
CREATE POLICY "users_manage_own_withdrawals" ON withdrawals
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM merchants m
            WHERE m.id = withdrawals.merchant_id AND m.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM merchants m
            WHERE m.id = withdrawals.merchant_id AND m.user_id = auth.uid()
        )
    );

-- Payment Links
CREATE POLICY "users_manage_own_payment_links" ON payment_links
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM merchants m
            WHERE m.id = payment_links.merchant_id AND m.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM merchants m
            WHERE m.id = payment_links.merchant_id AND m.user_id = auth.uid()
        )
    );

-- Webhook Events - Admin only
CREATE POLICY "admin_manage_webhook_events" ON webhook_events
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles up
            WHERE up.id = auth.uid() AND up.role = 'admin'
        )
    );

-- Notification Settings
CREATE POLICY "users_manage_own_notification_settings" ON notification_settings
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM merchants m
            WHERE m.id = notification_settings.merchant_id AND m.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM merchants m
            WHERE m.id = notification_settings.merchant_id AND m.user_id = auth.uid()
        )
    );

-- API Keys
CREATE POLICY "users_manage_own_api_keys" ON api_keys
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM merchants m
            WHERE m.id = api_keys.merchant_id AND m.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM merchants m
            WHERE m.id = api_keys.merchant_id AND m.user_id = auth.uid()
        )
    );

-- Utility Functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_merchants_updated_at BEFORE UPDATE ON merchants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_custody_accounts_updated_at BEFORE UPDATE ON custody_accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_withdrawals_updated_at BEFORE UPDATE ON withdrawals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payment_links_updated_at BEFORE UPDATE ON payment_links FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notification_settings_updated_at BEFORE UPDATE ON notification_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_api_keys_updated_at BEFORE UPDATE ON api_keys FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Business Logic Functions
CREATE OR REPLACE FUNCTION get_merchant_by_user_id(user_uuid UUID)
RETURNS TABLE(
    merchant_id UUID,
    business_name TEXT,
    status merchant_status
) AS $$
BEGIN
    RETURN QUERY
    SELECT m.id, m.business_name, m.status
    FROM merchants m
    WHERE m.user_id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION create_merchant_with_custody(
    user_uuid UUID,
    business_name TEXT,
    nowpayments_user_id TEXT,
    api_key TEXT
)
RETURNS UUID AS $$
DECLARE
    new_merchant_id UUID;
BEGIN
    -- Create merchant
    INSERT INTO merchants (user_id, business_name)
    VALUES (user_uuid, business_name)
    RETURNING id INTO new_merchant_id;
    
    -- Create custody account
    INSERT INTO custody_accounts (merchant_id, nowpayments_user_id, api_key)
    VALUES (new_merchant_id, nowpayments_user_id, api_key);
    
    -- Create default notification settings
    INSERT INTO notification_settings (merchant_id)
    VALUES (new_merchant_id);
    
    RETURN new_merchant_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create user profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- NOTE: Mock data will be created through the application signup process
-- rather than directly inserting into user_profiles to avoid foreign key constraint violations