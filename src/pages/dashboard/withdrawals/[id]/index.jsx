import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, DollarSign, Clock, AlertCircle, CheckCircle, XCircle, RefreshCw, ExternalLink } from 'lucide-react';
import MainSidebar from '../../../../components/ui/MainSidebar';
import Button from '../../../../components/ui/Button';

export default function WithdrawalDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [withdrawal, setWithdrawal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    fetchWithdrawalDetails();
  }, [id]);

  const fetchWithdrawalDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/withdrawals/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response?.ok) {
        throw new Error('Failed to fetch withdrawal details');
      }

      const data = await response?.json();
      setWithdrawal(data);
    } catch (err) {
      setError(err?.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshStatus = async () => {
    try {
      setRefreshing(true);
      const response = await fetch(`/api/withdrawals/${id}/refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response?.ok) {
        const updatedData = await response?.json();
        setWithdrawal(updatedData);
      }
    } catch (err) {
      alert('Failed to refresh status');
    } finally {
      setRefreshing(false);
    }
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
            <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Withdrawal</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => navigate('/dashboard/withdrawals')} variant="outline">
              Back to Withdrawals
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMethodIcon = (method) => {
    switch (method) {
      case 'crypto':
        return '₿';
      case 'bank_transfer':
        return '🏦';
      case 'paypal':
        return 'PP';
      default:
        return '💳';
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
              onClick={() => navigate('/dashboard/withdrawals')} 
              variant="outline" 
              size="sm"
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Withdrawals</span>
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">
              Withdrawal #{withdrawal?.id || id}
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              onClick={refreshStatus} 
              variant="outline" 
              size="sm"
              disabled={refreshing}
              className="flex items-center space-x-2"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh Status</span>
            </Button>
            <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2 ${getStatusColor(withdrawal?.status)}`}>
              {getStatusIcon(withdrawal?.status)}
              <span>{withdrawal?.status?.charAt(0)?.toUpperCase() + withdrawal?.status?.slice(1)}</span>
            </span>
          </div>
        </div>

        {/* Withdrawal Details Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Withdrawal Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <DollarSign className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <h3 className="text-sm font-medium text-gray-500">Amount</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {withdrawal?.amount || '$0.00'} {withdrawal?.currency || 'USD'}
                </p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Clock className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                <h3 className="text-sm font-medium text-gray-500">Requested</h3>
                <p className="text-lg text-gray-900">
                  {withdrawal?.created_at ? new Date(withdrawal.created_at)?.toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <span className="text-2xl mb-2 block">{getMethodIcon(withdrawal?.withdrawal_method)}</span>
                <h3 className="text-sm font-medium text-gray-500">Method</h3>
                <p className="text-lg text-gray-900 capitalize">
                  {withdrawal?.withdrawal_method?.replace('_', ' ') || 'N/A'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Transaction ID</h4>
                <p className="text-gray-900 font-mono text-sm">{withdrawal?.transaction_id || 'Pending'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Processing Fee</h4>
                <p className="text-gray-900">
                  ${withdrawal?.fee || '0.00'} {withdrawal?.currency || 'USD'}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Net Amount</h4>
                <p className="text-gray-900 font-medium">
                  ${((withdrawal?.amount || 0) - (withdrawal?.fee || 0))?.toFixed(2)} {withdrawal?.currency || 'USD'}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Estimated Completion</h4>
                <p className="text-gray-900">
                  {withdrawal?.estimated_completion ? new Date(withdrawal.estimated_completion)?.toLocaleDateString() : 'TBD'}
                </p>
              </div>
            </div>
          </div>

          {/* Destination Details */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Destination Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {withdrawal?.withdrawal_method === 'crypto' && (
                <>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Cryptocurrency</h4>
                    <p className="text-gray-900">{withdrawal?.crypto_currency || 'Bitcoin'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Wallet Address</h4>
                    <p className="text-gray-900 font-mono text-sm break-all">
                      {withdrawal?.wallet_address || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Network</h4>
                    <p className="text-gray-900">{withdrawal?.network || 'Bitcoin Network'}</p>
                  </div>
                </>
              )}
              
              {withdrawal?.withdrawal_method === 'bank_transfer' && (
                <>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Account Holder</h4>
                    <p className="text-gray-900">{withdrawal?.account_holder || 'N/A'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Account Number</h4>
                    <p className="text-gray-900 font-mono">
                      ****{withdrawal?.account_number?.slice(-4) || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Bank Name</h4>
                    <p className="text-gray-900">{withdrawal?.bank_name || 'N/A'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Routing Number</h4>
                    <p className="text-gray-900 font-mono">{withdrawal?.routing_number || 'N/A'}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Status History */}
          {withdrawal?.status_history && withdrawal?.status_history?.length > 0 && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Status History</h3>
              <div className="space-y-3">
                {withdrawal?.status_history?.map((entry, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    {getStatusIcon(entry?.status)}
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 capitalize">{entry?.status?.replace('_', ' ')}</p>
                      <p className="text-sm text-gray-500">{entry?.note || 'Status updated'}</p>
                    </div>
                    <p className="text-sm text-gray-500">
                      {new Date(entry.timestamp)?.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Blockchain Explorer Link (for crypto) */}
          {withdrawal?.withdrawal_method === 'crypto' && withdrawal?.transaction_hash && (
            <div className="p-6 border-t border-gray-200">
              <Button 
                onClick={() => window.open(`https://blockchair.com/bitcoin/transaction/${withdrawal?.transaction_hash}`, '_blank')}
                className="flex items-center space-x-2"
              >
                <ExternalLink className="w-4 h-4" />
                <span>View on Blockchain Explorer</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}