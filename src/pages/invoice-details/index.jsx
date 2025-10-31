import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { invoices } from '../../../lib/sdk/api';
import { formatCurrency } from '../../lib/utils/formatCurrency';
import PaymentStatusBadge from '../payment-management/components/PaymentStatusBadge';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const InvoiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Load invoice data
  const fetchInvoice = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await invoices?.getById(id);
      
      if (response?.success && response?.data) {
        setInvoice(response?.data);
      } else {
        setError('Invoice not found');
      }
    } catch (err) {
      setError(err?.message || 'Failed to load invoice details');
    } finally {
      setLoading(false);
    }
  };

  // Refresh invoice data
  const refreshInvoice = async () => {
    try {
      setRefreshing(true);
      const response = await invoices?.getById(id);
      
      if (response?.success && response?.data) {
        setInvoice(response?.data);
      }
    } catch (err) {
      console.error('Failed to refresh invoice:', err);
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

  // Generate QR code URL (placeholder - you might want to use a proper QR code service)
  const getQRCodeUrl = (url) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
  };

  useEffect(() => {
    if (id) {
      fetchInvoice();
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
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Invoice</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="space-x-3">
              <Button onClick={fetchInvoice}>Try Again</Button>
              <Button variant="outline" onClick={() => navigate('/dashboard/invoices')}>
                Back to Invoices
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Determine status badge type based on invoice status
  const getInvoiceStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'finished': return 'completed';
      case 'waiting': return 'pending';
      case 'confirming': return 'processing';
      case 'confirmed': return 'processing';
      case 'failed': return 'failed';
      case 'expired': return 'expired';
      default: return 'pending';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600">
          <Link to="/dashboard" className="hover:text-primary">Dashboard</Link>
          <Icon name="ChevronRight" size={16} />
          <Link to="/dashboard/invoices" className="hover:text-primary">Invoices</Link>
          <Icon name="ChevronRight" size={16} />
          <span className="text-gray-900">Invoice Details</span>
        </nav>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Invoice Details</h1>
            <p className="text-gray-600">ID: {invoice?.invoice_id || invoice?.id}</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              onClick={refreshInvoice}
              loading={refreshing}
              iconName="RefreshCw"
            >
              Refresh
            </Button>
            <PaymentStatusBadge status={getInvoiceStatusVariant(invoice?.status)} />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Primary Invoice Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Invoice Header */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoice Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Amount</label>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(invoice?.price_amount, invoice?.price_currency)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <p className="text-lg font-medium text-gray-900 capitalize">
                    {invoice?.status || 'Unknown'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Order ID</label>
                  <p className="text-sm text-gray-900">{invoice?.order_id || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Fixed Rate</label>
                  <p className="text-sm text-gray-900">
                    {invoice?.fixed_rate ? 'Yes' : 'No'}
                  </p>
                </div>
              </div>
            </div>

            {/* Invoice Description */}
            {invoice?.order_description && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
                <p className="text-gray-700">{invoice?.order_description}</p>
              </div>
            )}

            {/* Payment URLs */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Links</h3>
              <div className="space-y-4">
                {invoice?.invoice_url && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Invoice URL</label>
                    <div className="flex items-center space-x-2 mt-1">
                      <code className="flex-1 text-sm font-mono text-gray-800 bg-gray-50 p-2 rounded">
                        {invoice?.invoice_url}
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(invoice?.invoice_url)}
                        iconName="Copy"
                      >
                        Copy
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => window.open(invoice?.invoice_url, '_blank')}
                        iconName="ExternalLink"
                      >
                        Open
                      </Button>
                    </div>
                  </div>
                )}

                {invoice?.success_url && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Success URL</label>
                    <div className="flex items-center space-x-2 mt-1">
                      <code className="flex-1 text-sm font-mono text-gray-800 bg-gray-50 p-2 rounded">
                        {invoice?.success_url}
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(invoice?.success_url)}
                        iconName="Copy"
                      >
                        Copy
                      </Button>
                    </div>
                  </div>
                )}

                {invoice?.cancel_url && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Cancel URL</label>
                    <div className="flex items-center space-x-2 mt-1">
                      <code className="flex-1 text-sm font-mono text-gray-800 bg-gray-50 p-2 rounded">
                        {invoice?.cancel_url}
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(invoice?.cancel_url)}
                        iconName="Copy"
                      >
                        Copy
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Configuration */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Configuration</h3>
              <div className="space-y-3">
                {invoice?.pay_currency && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-500">Pay Currency</span>
                    <span className="text-sm text-gray-900">{invoice?.pay_currency}</span>
                  </div>
                )}
                {invoice?.payout_currency && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-500">Payout Currency</span>
                    <span className="text-sm text-gray-900">{invoice?.payout_currency}</span>
                  </div>
                )}
                {invoice?.payout_address && (
                  <div className="py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-500 block mb-1">Payout Address</span>
                    <span className="text-sm text-gray-900 font-mono break-all">{invoice?.payout_address}</span>
                  </div>
                )}
                {invoice?.ipn_callback_url && (
                  <div className="py-2">
                    <span className="text-sm font-medium text-gray-500 block mb-1">IPN Callback URL</span>
                    <span className="text-sm text-gray-900 break-all">{invoice?.ipn_callback_url}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Information */}
          <div className="space-y-6">
            {/* QR Code */}
            {invoice?.invoice_url && (
              <div className="bg-white rounded-lg p-6 shadow-sm text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">QR Code</h3>
                <img 
                  src={getQRCodeUrl(invoice?.invoice_url)}
                  alt="Invoice QR Code"
                  className="mx-auto mb-4 rounded-lg"
                />
                <p className="text-xs text-gray-500">Scan to pay with mobile wallet</p>
              </div>
            )}

            {/* Timeline */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Created</label>
                  <p className="text-sm text-gray-900">
                    {invoice?.created_at ? new Date(invoice.created_at)?.toLocaleString() : 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Last Updated</label>
                  <p className="text-sm text-gray-900">
                    {invoice?.updated_at ? new Date(invoice.updated_at)?.toLocaleString() : 'N/A'}
                  </p>
                </div>
                {invoice?.due_date && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Due Date</label>
                    <p className="text-sm text-gray-900">
                      {new Date(invoice.due_date)?.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                <Button 
                  fullWidth 
                  variant="outline"
                  onClick={() => navigate('/dashboard/invoices')}
                  iconName="ArrowLeft"
                >
                  Back to Invoices
                </Button>
                {invoice?.invoice_url && (
                  <Button 
                    fullWidth
                    onClick={() => window.open(invoice?.invoice_url, '_blank')}
                    iconName="ExternalLink"
                  >
                    View Hosted Checkout
                  </Button>
                )}
                <Button 
                  fullWidth 
                  variant="outline"
                  onClick={() => navigate('/dashboard/invoices/create')}
                  iconName="Plus"
                >
                  Create New Invoice
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetails;