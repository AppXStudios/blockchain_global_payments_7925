import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, DollarSign, TrendingUp, AlertCircle, ArrowLeft, Settings, Lock, Unlock, BarChart3 } from 'lucide-react';
import AdminNavigation from '../../../../components/ui/AdminNavigation';
import Button from '../../../../components/ui/Button';

export default function AdminMerchantDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [merchant, setMerchant] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    fetchMerchantDetails();
    fetchMerchantMetrics();
  }, [id]);

  const fetchMerchantDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/merchants/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response?.ok) {
        throw new Error('Failed to fetch merchant details');
      }

      const data = await response?.json();
      setMerchant(data);
    } catch (err) {
      setError(err?.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchMerchantMetrics = async () => {
    try {
      const response = await fetch(`/api/admin/merchants/${id}/metrics`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response?.ok) {
        const data = await response?.json();
        setMetrics(data);
      }
    } catch (err) {
      console.error('Failed to fetch metrics:', err);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setActionLoading(true);
      const response = await fetch(`/api/admin/merchants/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response?.ok) {
        const updatedMerchant = await response?.json();
        setMerchant(updatedMerchant);
      } else {
        alert('Failed to update merchant status');
      }
    } catch (err) {
      alert('Failed to update merchant status');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNavigation onToggleCollapse={() => setIsCollapsed(!isCollapsed)} />
        <div className="container mx-auto px-4 py-8">
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
      <div className="min-h-screen bg-gray-50">
        <AdminNavigation onToggleCollapse={() => setIsCollapsed(!isCollapsed)} />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Merchant</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => navigate('/admin/merchants')} variant="outline">
              Back to Merchants
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
      case 'suspended':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavigation onToggleCollapse={() => setIsCollapsed(!isCollapsed)} />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button 
              onClick={() => navigate('/admin/merchants')} 
              variant="outline" 
              size="sm"
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Merchants</span>
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">
              {merchant?.business_name || `Merchant #${id}`}
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(merchant?.status)}`}>
              {merchant?.status?.charAt(0)?.toUpperCase() + merchant?.status?.slice(1)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Merchant Information */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Merchant Information
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Business Name</h3>
                    <p className="text-gray-900">{merchant?.business_name || 'N/A'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Contact Email</h3>
                    <p className="text-gray-900">{merchant?.email || 'N/A'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Registration Date</h3>
                    <p className="text-gray-900">
                      {merchant?.created_at ? new Date(merchant.created_at)?.toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Merchant ID</h3>
                    <p className="text-gray-900 font-mono">{merchant?.id || id}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Business Type</h3>
                    <p className="text-gray-900">{merchant?.business_type || 'N/A'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Country</h3>
                    <p className="text-gray-900">{merchant?.country || 'N/A'}</p>
                  </div>
                </div>

                {merchant?.business_description && (
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Business Description</h3>
                    <p className="text-gray-900">{merchant?.business_description}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Merchant Metrics */}
            {metrics && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Performance Metrics
                  </h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <DollarSign className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-gray-900">${metrics?.total_volume || '0.00'}</p>
                      <p className="text-sm text-gray-500">Total Volume</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-gray-900">{metrics?.total_transactions || 0}</p>
                      <p className="text-sm text-gray-500">Total Transactions</p>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <AlertCircle className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-gray-900">{metrics?.success_rate || '0'}%</p>
                      <p className="text-sm text-gray-500">Success Rate</p>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Last 30 Days</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Volume:</span>
                          <span className="text-sm font-medium text-gray-900">
                            ${metrics?.monthly_volume || '0.00'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Transactions:</span>
                          <span className="text-sm font-medium text-gray-900">
                            {metrics?.monthly_transactions || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Account Health</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Failed Payments:</span>
                          <span className="text-sm font-medium text-gray-900">
                            {metrics?.failed_payments || 0}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Chargebacks:</span>
                          <span className="text-sm font-medium text-gray-900">
                            {metrics?.chargebacks || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actions Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Quick Actions
                </h3>
              </div>
              <div className="p-6 space-y-3">
                {merchant?.status === 'active' ? (
                  <Button
                    onClick={() => handleStatusChange('suspended')}
                    disabled={actionLoading}
                    variant="outline"
                    className="w-full flex items-center justify-center space-x-2 text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Suspend Account</span>
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleStatusChange('active')}
                    disabled={actionLoading}
                    className="w-full flex items-center justify-center space-x-2"
                  >
                    <Unlock className="w-4 h-4" />
                    <span>Activate Account</span>
                  </Button>
                )}
                
                <Button
                  onClick={() => navigate(`/admin/payments?merchant_id=${id}`)}
                  variant="outline"
                  className="w-full"
                >
                  View Payments
                </Button>
                
                <Button
                  onClick={() => navigate(`/admin/merchants/${id}/settings`)}
                  variant="outline"
                  className="w-full"
                >
                  Edit Settings
                </Button>
              </div>
            </div>

            {/* Risk Assessment */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Risk Assessment</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Overall Risk Level:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      (metrics?.risk_level === 'low') ? 'bg-green-100 text-green-800' :
                      (metrics?.risk_level === 'medium') ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {metrics?.risk_level?.charAt(0)?.toUpperCase() + metrics?.risk_level?.slice(1) || 'Low'}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>• Account verification: Complete</p>
                    <p>• Payment patterns: Normal</p>
                    <p>• Chargeback rate: {metrics?.chargeback_rate || '0'}%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}