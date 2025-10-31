import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import AdminNavigation from '../../../../components/ui/AdminNavigation';
import Button from '../../../../components/ui/Button';
import { ArrowLeft, Copy, ExternalLink, RefreshCw, User, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { formatCurrency } from '../../../../lib/utils/formatCurrency';

const AdminPaymentDetailsPage = () => {
  const { id } = useParams();
  const [payment, setPayment] = useState(null);
  const [merchantInfo, setMerchantInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const fetchPaymentDetails = async () => {
    try {
      const response = await fetch(`/api/admin/payments/${id}`);
      if (!response?.ok) throw new Error('Payment not found');
      const data = await response?.json();
      setPayment(data?.payment);
      setMerchantInfo(data?.merchant);
      setError(null);
    } catch (err) {
      setError(err?.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPaymentDetails();
  }, [id]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPaymentDetails();
  };

  const copyToClipboard = (text) => {
    navigator.clipboard?.writeText(text);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'waiting': { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      'confirming': { color: 'bg-blue-100 text-blue-800', icon: RefreshCw },
      'confirmed': { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      'sending': { color: 'bg-purple-100 text-purple-800', icon: RefreshCw },
      'partially_paid': { color: 'bg-orange-100 text-orange-800', icon: AlertCircle },
      'finished': { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      'failed': { color: 'bg-red-100 text-red-800', icon: AlertCircle },
      'refunded': { color: 'bg-gray-100 text-gray-800', icon: AlertCircle },
      'expired': { color: 'bg-red-100 text-red-800', icon: AlertCircle }
    };
    
    const config = statusConfig?.[status] || statusConfig?.['waiting'];
    const IconComponent = config?.icon;
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${config?.color}`}>
        <IconComponent className="h-3 w-3 mr-1" />
        {status?.replace('_', ' ')?.toUpperCase()}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex">
        <AdminNavigation onToggleCollapse={() => setIsCollapsed(!isCollapsed)} />
        <div className="flex-1 p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex">
        <AdminNavigation onToggleCollapse={() => setIsCollapsed(!isCollapsed)} />
        <div className="flex-1 p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Payment Not Found</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <Link to="/admin">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Admin Panel
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <AdminNavigation onToggleCollapse={() => setIsCollapsed(!isCollapsed)} />
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Link to="/admin">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Admin Payment Details</h1>
            {getStatusBadge(payment?.payment_status)}
          </div>
          <Button onClick={handleRefresh} disabled={refreshing} variant="outline">
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Payment & Merchant Information Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Payment Details */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-4">Payment Information</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Payment ID:</span>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-sm">{payment?.payment_id || id}</span>
                  <button onClick={() => copyToClipboard(payment?.payment_id || id)}>
                    <Copy className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  </button>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Price Amount:</span>
                <span className="font-semibold">{formatCurrency(payment?.price_amount, payment?.price_currency)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pay Amount:</span>
                <span className="font-semibold">{formatCurrency(payment?.pay_amount, payment?.pay_currency)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Actually Paid:</span>
                <span className="font-semibold text-green-600">
                  {formatCurrency(payment?.actually_paid, payment?.pay_currency)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-mono text-sm">{payment?.order_id || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Order Description:</span>
                <span className="text-sm max-w-xs text-right">{payment?.order_description || 'No description'}</span>
              </div>
            </div>
          </div>

          {/* Merchant Information */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Merchant Information
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Merchant ID:</span>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-sm">{merchantInfo?.merchant_id}</span>
                  <Link to={`/admin/merchants/${merchantInfo?.merchant_id}`}>
                    <ExternalLink className="h-4 w-4 text-blue-600 hover:text-blue-800" />
                  </Link>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="text-sm">{merchantInfo?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Business Name:</span>
                <span className="text-sm max-w-xs text-right">{merchantInfo?.business_name || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Merchant Status:</span>
                <span className={`text-sm px-2 py-1 rounded-full ${
                  merchantInfo?.status === 'active' ? 'bg-green-100 text-green-800' :
                  merchantInfo?.status === 'suspended' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {merchantInfo?.status?.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Merchant Created:</span>
                <span className="text-sm">{merchantInfo?.created_at ? new Date(merchantInfo.created_at)?.toLocaleDateString() : 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Blockchain Information */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-4">Blockchain Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-gray-600">Pay Address:</span>
                <div className="flex items-center space-x-2 max-w-xs">
                  <span className="font-mono text-sm break-all">{payment?.pay_address}</span>
                  <button onClick={() => copyToClipboard(payment?.pay_address)}>
                    <Copy className="h-4 w-4 text-gray-400 hover:text-gray-600 flex-shrink-0" />
                  </button>
                </div>
              </div>
              {payment?.outcome?.hash && (
                <div className="flex justify-between items-start">
                  <span className="text-gray-600">Transaction Hash:</span>
                  <div className="flex items-center space-x-2 max-w-xs">
                    <span className="font-mono text-sm break-all">{payment?.outcome?.hash}</span>
                    <button onClick={() => copyToClipboard(payment?.outcome?.hash)}>
                      <Copy className="h-4 w-4 text-gray-400 hover:text-gray-600 flex-shrink-0" />
                    </button>
                  </div>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Pay Currency:</span>
                <span className="font-semibold">{payment?.pay_currency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Network Precision:</span>
                <span className="font-mono text-sm">{payment?.network_precision || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* NOWPayments Metadata */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-4">NOWPayments Metadata</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">NOWPayments ID:</span>
                <span className="font-mono text-sm">{payment?.nowpayments_id || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Invoice ID:</span>
                <span className="font-mono text-sm">{payment?.invoice_id || 'N/A'}</span>
              </div>
              {payment?.ipn_callback_url && (
                <div className="flex justify-between items-start">
                  <span className="text-gray-600">IPN Callback:</span>
                  <div className="flex items-center space-x-2 max-w-xs">
                    <span className="text-sm break-all">{payment?.ipn_callback_url}</span>
                    <ExternalLink className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Purchase ID:</span>
                <span className="font-mono text-sm">{payment?.purchase_id || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-4">Timeline</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Created:</span>
                <span className="text-sm">{new Date(payment?.created_at)?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Updated:</span>
                <span className="text-sm">{new Date(payment?.updated_at)?.toLocaleString()}</span>
              </div>
              {payment?.valid_until && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Valid Until:</span>
                  <span className="text-sm">{new Date(payment.valid_until)?.toLocaleString()}</span>
                </div>
              )}
              {payment?.outcome?.timestamp && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Completed:</span>
                  <span className="text-sm text-green-600">{new Date(payment.outcome.timestamp)?.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Risk Assessment (Admin Only) */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-orange-500" />
              Risk Assessment
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Risk Score:</span>
                <span className={`font-semibold ${
                  (payment?.risk_score || 0) < 3 ? 'text-green-600' :
                  (payment?.risk_score || 0) < 7 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {payment?.risk_score || 0}/10
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Merchant Risk:</span>
                <span className={`text-sm ${
                  merchantInfo?.risk_level === 'low' ? 'text-green-600' :
                  merchantInfo?.risk_level === 'medium' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {merchantInfo?.risk_level?.toUpperCase() || 'UNKNOWN'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Flagged:</span>
                <span className={payment?.is_flagged ? 'text-red-600' : 'text-green-600'}>
                  {payment?.is_flagged ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Source IP:</span>
                <span className="font-mono text-sm">{payment?.source_ip || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Actions */}
        <div className="mt-6 flex space-x-4">
          <Link to="/admin">
            <Button variant="outline">Back to Admin Panel</Button>
          </Link>
          <Link to={`/admin/merchants/${merchantInfo?.merchant_id}`}>
            <Button variant="outline">View Merchant</Button>
          </Link>
          {payment?.is_flagged && (
            <Button className="bg-yellow-600 hover:bg-yellow-700">Review Flag</Button>
          )}
          {payment?.payment_status === 'failed' && (
            <Button className="bg-red-600 hover:bg-red-700">Investigate Failure</Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPaymentDetailsPage;