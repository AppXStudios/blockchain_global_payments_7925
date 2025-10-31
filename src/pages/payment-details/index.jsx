import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { payments } from '../../../lib/sdk/api';
import { formatCurrency } from '../../lib/utils/formatCurrency';
import PaymentStatusBadge from '../payment-management/components/PaymentStatusBadge';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const PaymentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Load payment data
  const fetchPayment = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await payments?.getById(id);
      
      if (response?.success && response?.data) {
        setPayment(response?.data);
      } else {
        setError('Payment not found');
      }
    } catch (err) {
      setError(err?.message || 'Failed to load payment details');
    } finally {
      setLoading(false);
    }
  };

  // Refresh payment status
  const refreshPayment = async () => {
    try {
      setRefreshing(true);
      const response = await payments?.getById(id);
      
      if (response?.success && response?.data) {
        setPayment(response?.data);
      }
    } catch (err) {
      console.error('Failed to refresh payment:', err);
    } finally {
      setRefreshing(false);
    }
  };

  // Copy to clipboard function
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard?.writeText(text);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  useEffect(() => {
    if (id) {
      fetchPayment();
    }
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg p-8 shadow-sm text-center">
            <Icon name="AlertCircle" size={48} className="text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Payment</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="space-x-3">
              <Button onClick={fetchPayment}>Try Again</Button>
              <Button variant="outline" onClick={() => navigate('/dashboard/payments')}>
                Back to Payments
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600">
          <Link to="/dashboard" className="hover:text-primary">Dashboard</Link>
          <Icon name="ChevronRight" size={16} />
          <Link to="/dashboard/payments" className="hover:text-primary">Payments</Link>
          <Icon name="ChevronRight" size={16} />
          <span className="text-gray-900">Payment Details</span>
        </nav>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Payment Details</h1>
            <p className="text-gray-600">ID: {payment?.payment_id || payment?.id}</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              onClick={refreshPayment}
              loading={refreshing}
              iconName="RefreshCw"
            >
              Refresh
            </Button>
            <PaymentStatusBadge status={payment?.status} />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Primary Payment Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Overview */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Price Amount</label>
                  <p className="text-xl font-semibold text-gray-900">
                    {formatCurrency(payment?.price_amount, payment?.price_currency)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Pay Amount</label>
                  <p className="text-xl font-semibold text-gray-900">
                    {formatCurrency(payment?.pay_amount, payment?.pay_currency)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Actually Paid</label>
                  <p className="text-lg font-medium text-green-600">
                    {payment?.actually_paid ? formatCurrency(payment?.actually_paid, payment?.pay_currency) : 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Network</label>
                  <p className="text-lg font-medium text-gray-900">{payment?.network || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Payment Address */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Address</h3>
              {payment?.pay_address ? (
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <code className="flex-1 text-sm font-mono text-gray-800 break-all">
                    {payment?.pay_address}
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(payment?.pay_address)}
                    iconName="Copy"
                  >
                    Copy
                  </Button>
                </div>
              ) : (
                <p className="text-gray-500">No payment address available</p>
              )}
            </div>

            {/* NOWPayments Metadata */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">NOWPayments Integration</h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-500">Payment ID</span>
                  <span className="text-sm text-gray-900">{payment?.payment_id || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-500">Order ID</span>
                  <span className="text-sm text-gray-900">{payment?.order_id || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-500">Network Precision</span>
                  <span className="text-sm text-gray-900">{payment?.network_precision || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-500">Smart Contract</span>
                  <span className="text-sm text-gray-900 font-mono break-all">
                    {payment?.smart_contract || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-sm font-medium text-gray-500">Fee Paid by User</span>
                  <span className="text-sm text-gray-900">
                    {payment?.is_fee_paid_by_user ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Information */}
          <div className="space-y-6">
            {/* Transaction Timeline */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Created</label>
                  <p className="text-sm text-gray-900">
                    {payment?.created_at ? new Date(payment.created_at)?.toLocaleString() : 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Last Updated</label>
                  <p className="text-sm text-gray-900">
                    {payment?.updated_at ? new Date(payment.updated_at)?.toLocaleString() : 'N/A'}
                  </p>
                </div>
                {payment?.valid_until && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Valid Until</label>
                    <p className="text-sm text-gray-900">
                      {new Date(payment.valid_until)?.toLocaleString()}
                    </p>
                  </div>
                )}
                {payment?.expiration_estimate_date && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Expires</label>
                    <p className="text-sm text-gray-900">
                      {new Date(payment.expiration_estimate_date)?.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Payout Information */}
            {(payment?.payout_address || payment?.payout_currency) && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payout Details</h3>
                <div className="space-y-3">
                  {payment?.payout_currency && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Payout Currency</label>
                      <p className="text-sm text-gray-900">{payment?.payout_currency}</p>
                    </div>
                  )}
                  {payment?.payout_address && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Payout Address</label>
                      <p className="text-sm text-gray-900 font-mono break-all">{payment?.payout_address}</p>
                    </div>
                  )}
                  {payment?.payout_extra_id && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Payout Extra ID</label>
                      <p className="text-sm text-gray-900">{payment?.payout_extra_id}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                <Button 
                  fullWidth 
                  variant="outline"
                  onClick={() => navigate('/dashboard/payments')}
                  iconName="ArrowLeft"
                >
                  Back to Payments
                </Button>
                {payment?.success_url && (
                  <Button 
                    fullWidth 
                    variant="outline"
                    onClick={() => window.open(payment?.success_url, '_blank')}
                    iconName="ExternalLink"
                  >
                    Success URL
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetails;