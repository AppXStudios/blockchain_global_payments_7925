import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import MainSidebar from '../../../../components/ui/MainSidebar';
import Button from '../../../../components/ui/Button';
import { ArrowLeft, Copy, ExternalLink, RefreshCw } from 'lucide-react';
import { formatCurrency } from '../../../../lib/utils/formatCurrency';

const PaymentDetailsPage = () => {
  const { id } = useParams();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const fetchPaymentDetails = async () => {
    try {
      const response = await fetch(`/api/payments/${id}`);
      if (!response?.ok) throw new Error('Payment not found');
      const data = await response?.json();
      setPayment(data);
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
    const statusColors = {
      'waiting': 'bg-yellow-100 text-yellow-800',
      'confirming': 'bg-blue-100 text-blue-800', 
      'confirmed': 'bg-green-100 text-green-800',
      'sending': 'bg-purple-100 text-purple-800',
      'partially_paid': 'bg-orange-100 text-orange-800',
      'finished': 'bg-green-100 text-green-800',
      'failed': 'bg-red-100 text-red-800',
      'refunded': 'bg-gray-100 text-gray-800',
      'expired': 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors?.[status] || 'bg-gray-100 text-gray-800'}`}>
        {status?.replace('_', ' ')?.toUpperCase()}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex">
        <MainSidebar onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} />
        <div className="flex-1 p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
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
        <MainSidebar onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} />
        <div className="flex-1 p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Payment Not Found</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <Link to="/dashboard/payments">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Payments
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <MainSidebar onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Link to="/dashboard/payments">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Payment Details</h1>
            {getStatusBadge(payment?.payment_status)}
          </div>
          <Button onClick={handleRefresh} disabled={refreshing} variant="outline">
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Payment Information Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Payment Info */}
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
              {payment?.parent_payment_id && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Parent Payment:</span>
                  <Link 
                    to={`/dashboard/payments/${payment?.parent_payment_id}`}
                    className="text-blue-600 hover:underline font-mono text-sm"
                  >
                    {payment?.parent_payment_id}
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Payment Address & Blockchain Info */}
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
              {payment?.network_precision && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Network Precision:</span>
                  <span className="font-mono text-sm">{payment?.network_precision}</span>
                </div>
              )}
            </div>
          </div>

          {/* NOWPayments Metadata */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-4">NOWPayments Metadata</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-mono text-sm">{payment?.order_id || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Order Description:</span>
                <span className="text-sm">{payment?.order_description || 'No description'}</span>
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
            </div>
          </div>

          {/* Timestamps */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-4">Timestamps</h2>
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
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex space-x-4">
          <Link to="/dashboard/payments">
            <Button variant="outline">View All Payments</Button>
          </Link>
          {payment?.pay_address && (
            <Button onClick={() => copyToClipboard(payment?.pay_address)}>
              <Copy className="h-4 w-4 mr-2" />
              Copy Payment Address
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentDetailsPage;