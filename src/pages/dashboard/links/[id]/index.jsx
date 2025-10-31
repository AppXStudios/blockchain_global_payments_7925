import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link, QrCode, Eye, Copy, BarChart3, ArrowLeft, ExternalLink, Calendar, DollarSign } from 'lucide-react';
import MainSidebar from '../../../../components/ui/MainSidebar';
import Button from '../../../../components/ui/Button';

export default function LinkDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [link, setLink] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showQR, setShowQR] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    fetchLinkDetails();
    fetchAnalytics();
  }, [id]);

  const fetchLinkDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/links/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response?.ok) {
        throw new Error('Failed to fetch link details');
      }

      const data = await response?.json();
      setLink(data);
    } catch (err) {
      setError(err?.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/links/${id}/analytics`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response?.ok) {
        const data = await response?.json();
        setAnalytics(data);
      }
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard?.writeText(link?.payment_url);
      alert('Link copied to clipboard!');
    } catch (err) {
      alert('Failed to copy link');
    }
  };

  const generateQRCode = (url) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <MainSidebar onToggleCollapse={setSidebarCollapsed} />
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
        <MainSidebar onToggleCollapse={setSidebarCollapsed} />
        <div className="flex-1 p-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Payment Link</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => navigate('/dashboard/links')} variant="outline">
              Back to Payment Links
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'expired':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <MainSidebar onToggleCollapse={setSidebarCollapsed} />
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button 
              onClick={() => navigate('/dashboard/links')} 
              variant="outline" 
              size="sm"
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Links</span>
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">
              Payment Link Details
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(link?.status)}`}>
              {link?.status?.charAt(0)?.toUpperCase() + link?.status?.slice(1)}
            </span>
          </div>
        </div>

        {/* Link Details Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Link className="w-5 h-5 mr-2" />
                Link Information
              </h2>
              <div className="flex items-center space-x-3">
                <Button onClick={copyToClipboard} variant="outline" size="sm">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Link
                </Button>
                <Button onClick={() => setShowQR(!showQR)} variant="outline" size="sm">
                  <QrCode className="w-4 h-4 mr-2" />
                  QR Code
                </Button>
                <Button 
                  onClick={() => window.open(link?.payment_url, '_blank')} 
                  size="sm"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Link
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Link Title</h3>
                <p className="text-lg font-medium text-gray-900">{link?.title || 'Untitled Link'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Amount</h3>
                <p className="text-lg font-bold text-gray-900 flex items-center">
                  <DollarSign className="w-4 h-4 mr-1" />
                  {link?.amount || '$0.00'} {link?.currency || 'USD'}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Created Date</h3>
                <p className="text-gray-900 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {link?.created_at ? new Date(link.created_at)?.toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Expires</h3>
                <p className="text-gray-900 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {link?.expires_at ? new Date(link.expires_at)?.toLocaleDateString() : 'Never'}
                </p>
              </div>
            </div>

            {/* Payment URL */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Payment URL</h3>
              <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-900 text-sm flex-1 font-mono break-all">
                  {link?.payment_url || 'Not available'}
                </p>
                <Button onClick={copyToClipboard} variant="outline" size="sm">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Description */}
            {link?.description && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
                <p className="text-gray-900">{link?.description}</p>
              </div>
            )}
          </div>

          {/* QR Code Section */}
          {showQR && link?.payment_url && (
            <div className="p-6 border-b border-gray-200 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">QR Code</h3>
              <div className="flex justify-center">
                <img 
                  src={generateQRCode(link?.payment_url)} 
                  alt="Payment Link QR Code" 
                  className="border rounded-lg"
                />
              </div>
              <p className="text-sm text-gray-500 mt-3">
                Customers can scan this QR code to access the payment link
              </p>
            </div>
          )}

          {/* Analytics Section */}
          {analytics && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Analytics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Eye className="w-5 h-5 text-blue-500 mr-2" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{analytics?.views || 0}</p>
                  <p className="text-sm text-gray-500">Total Views</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <DollarSign className="w-5 h-5 text-green-500 mr-2" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{analytics?.successful_payments || 0}</p>
                  <p className="text-sm text-gray-500">Successful Payments</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">${analytics?.total_revenue || '0.00'}</p>
                  <p className="text-sm text-gray-500">Total Revenue</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics?.conversion_rate || '0'}%
                  </p>
                  <p className="text-sm text-gray-500">Conversion Rate</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}