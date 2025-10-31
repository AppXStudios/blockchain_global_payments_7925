import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const WithdrawalHistory = () => {
  const navigate = useNavigate();
  const [selectedWithdrawals, setSelectedWithdrawals] = useState([]);

  // Mock withdrawal data
  const withdrawals = [
    {
      id: 'WD-001',
      amount: 1500.00,
      currency: 'USD',
      status: 'completed',
      method: 'Bank Transfer',
      account: '****1234',
      requestDate: '2024-10-30T10:30:00Z',
      processedDate: '2024-10-31T14:20:00Z',
      fee: 25.00,
      txHash: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890'
    },
    {
      id: 'WD-002',
      amount: 850.75,
      currency: 'USD',
      status: 'processing',
      method: 'Crypto Wallet',
      account: '1A2b...Xy9z',
      requestDate: '2024-10-31T08:15:00Z',
      processedDate: null,
      fee: 15.00,
      txHash: null
    },
    {
      id: 'WD-003',
      amount: 2250.00,
      currency: 'USD',
      status: 'pending',
      method: 'Bank Transfer',
      account: '****5678',
      requestDate: '2024-10-31T16:45:00Z',
      processedDate: null,
      fee: 35.00,
      txHash: null
    }
  ];

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'text-green-600 bg-green-100 border-green-200';
      case 'processing':
        return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'failed':
        return 'text-red-600 bg-red-100 border-red-200';
      case 'cancelled':
        return 'text-gray-600 bg-gray-100 border-gray-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const handleRowClick = (withdrawal) => {
    // ✅ FIXED — Navigate to correct /dashboard/withdrawals/{id} route
    navigate(`/dashboard/withdrawals/${withdrawal?.id}`);
  };

  const handleSelectWithdrawal = (withdrawalId) => {
    setSelectedWithdrawals(prev => 
      prev?.includes(withdrawalId) 
        ? prev?.filter(id => id !== withdrawalId)
        : [...prev, withdrawalId]
    );
  };

  const handleSelectAll = () => {
    if (selectedWithdrawals?.length === withdrawals?.length) {
      setSelectedWithdrawals([]);
    } else {
      setSelectedWithdrawals(withdrawals?.map(wd => wd?.id));
    }
  };

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency?.toUpperCase(),
    })?.format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString)?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Withdrawal History</h2>
            <p className="text-sm text-muted-foreground">
              {selectedWithdrawals?.length > 0 
                ? `${selectedWithdrawals?.length} withdrawal(s) selected` 
                : `${withdrawals?.length} total withdrawals`
              }
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {selectedWithdrawals?.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => console.log('Bulk action triggered')}
                iconName="MoreHorizontal"
                iconPosition="left"
              >
                Actions
              </Button>
            )}
            <Button
              variant="default"
              size="sm"
              onClick={() => navigate('/dashboard/withdrawals/create')}
              className="gradient-primary"
              iconName="Plus"
              iconPosition="left"
            >
              New Withdrawal
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left py-3 px-6">
                <input
                  type="checkbox"
                  checked={selectedWithdrawals?.length === withdrawals?.length}
                  onChange={handleSelectAll}
                  className="rounded border-border"
                />
              </th>
              <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Withdrawal ID</th>
              <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Amount</th>
              <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Method</th>
              <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Status</th>
              <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Requested</th>
              <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Processed</th>
              <th className="text-right py-3 px-6 text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {withdrawals?.map((withdrawal) => (
              <tr 
                key={withdrawal?.id}
                className="border-b border-border hover:bg-muted/50 transition-smooth cursor-pointer"
                onClick={() => handleRowClick(withdrawal)}
              >
                <td className="py-4 px-6">
                  <input
                    type="checkbox"
                    checked={selectedWithdrawals?.includes(withdrawal?.id)}
                    onChange={(e) => {
                      e?.stopPropagation();
                      handleSelectWithdrawal(withdrawal?.id);
                    }}
                    className="rounded border-border"
                  />
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm font-medium text-foreground">{withdrawal?.id}</span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">
                      {formatCurrency(withdrawal?.amount, withdrawal?.currency)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Fee: {formatCurrency(withdrawal?.fee, withdrawal?.currency)}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex flex-col">
                    <span className="text-sm text-foreground">{withdrawal?.method}</span>
                    <span className="text-xs text-muted-foreground font-mono">{withdrawal?.account}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(withdrawal?.status)}`}>
                    {withdrawal?.status?.charAt(0)?.toUpperCase() + withdrawal?.status?.slice(1)}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm text-muted-foreground">
                    {formatDate(withdrawal?.requestDate)}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm text-muted-foreground">
                    {formatDate(withdrawal?.processedDate)}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e?.stopPropagation();
                        handleRowClick(withdrawal);
                      }}
                      title="View Details"
                    >
                      <Icon name="Eye" size={16} />
                    </Button>
                    {withdrawal?.txHash && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e?.stopPropagation();
                          window?.open(`https://etherscan.io/tx/${withdrawal?.txHash}`, '_blank');
                        }}
                        title="View Transaction"
                      >
                        <Icon name="ExternalLink" size={16} />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {withdrawals?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="ArrowUpRight" size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No withdrawals found</h3>
          <p className="text-muted-foreground mb-4">Get started by creating your first withdrawal request</p>
          <Button
            variant="default"
            onClick={() => navigate('/dashboard/withdrawals/create')}
            className="gradient-primary"
            iconName="Plus"
            iconPosition="left"
          >
            New Withdrawal
          </Button>
        </div>
      )}
    </div>
  );
};

export default WithdrawalHistory;