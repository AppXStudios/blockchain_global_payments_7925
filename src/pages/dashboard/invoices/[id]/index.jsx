import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText, Download, Send, CreditCard, Clock, DollarSign, ArrowLeft, Mail, ExternalLink } from 'lucide-react';
import MainSidebar from '../../../../components/ui/MainSidebar';
import Button from '../../../../components/ui/Button';

export default function InvoiceDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    fetchInvoiceDetails();
  }, [id]);

  const fetchInvoiceDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/invoices/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response?.ok) {
        throw new Error('Failed to fetch invoice details');
      }

      const data = await response?.json();
      setInvoice(data);
    } catch (err) {
      setError(err?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendReminder = async () => {
    try {
      const response = await fetch(`/api/invoices/${id}/remind`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response?.ok) {
        alert('Payment reminder sent successfully');
      }
    } catch (err) {
      alert('Failed to send reminder');
    }
  };

  const handleDownloadPDF = () => {
    window.open(`/api/invoices/${id}/pdf`, '_blank');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <MainSidebar onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} />
        <div className="flex-1 p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
            <div className="bg-white rounded-lg p-6">
              <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <MainSidebar onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} />
        <div className="flex-1 p-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Invoice</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => navigate('/dashboard/invoices')} variant="outline">
              Back to Invoices
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <MainSidebar onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button 
              onClick={() => navigate('/dashboard/invoices')} 
              variant="outline" 
              size="sm"
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Invoices</span>
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">
              Invoice #{invoice?.invoice_number || id}
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(invoice?.status)}`}>
              {invoice?.status?.charAt(0)?.toUpperCase() + invoice?.status?.slice(1)}
            </span>
          </div>
        </div>

        {/* Invoice Details Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Invoice Details
              </h2>
              <div className="flex items-center space-x-3">
                <Button onClick={handleDownloadPDF} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
                {invoice?.status === 'pending' && (
                  <Button onClick={handleSendReminder} size="sm">
                    <Send className="w-4 h-4 mr-2" />
                    Send Reminder
                  </Button>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Amount</h3>
                <p className="text-2xl font-bold text-gray-900 flex items-center">
                  <DollarSign className="w-5 h-5 mr-1" />
                  {invoice?.amount || '$0.00'} {invoice?.currency || 'USD'}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Issue Date</h3>
                <p className="text-lg text-gray-900 flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  {invoice?.created_at ? new Date(invoice.created_at)?.toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Due Date</h3>
                <p className="text-lg text-gray-900 flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  {invoice?.due_date ? new Date(invoice.due_date)?.toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Customer Name</h4>
                <p className="text-gray-900">{invoice?.customer_name || 'N/A'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Customer Email</h4>
                <p className="text-gray-900 flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  {invoice?.customer_email || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Invoice Items */}
          {invoice?.items && invoice?.items?.length > 0 && (
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoice Items</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 text-sm font-medium text-gray-500">Description</th>
                      <th className="text-right py-2 text-sm font-medium text-gray-500">Quantity</th>
                      <th className="text-right py-2 text-sm font-medium text-gray-500">Unit Price</th>
                      <th className="text-right py-2 text-sm font-medium text-gray-500">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice?.items?.map((item, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-3 text-gray-900">{item?.description}</td>
                        <td className="py-3 text-right text-gray-900">{item?.quantity}</td>
                        <td className="py-3 text-right text-gray-900">${item?.unit_price}</td>
                        <td className="py-3 text-right font-medium text-gray-900">
                          ${(item?.quantity * item?.unit_price)?.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Payment Information */}
          {invoice?.payment_url && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment</h3>
              <div className="flex items-center space-x-4">
                <Button 
                  onClick={() => window.open(invoice?.payment_url, '_blank')} 
                  className="flex items-center space-x-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>View Payment Page</span>
                  <ExternalLink className="w-4 h-4" />
                </Button>
                <p className="text-sm text-gray-500">
                  Customer can use this link to pay the invoice
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}