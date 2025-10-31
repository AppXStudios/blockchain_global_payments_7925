import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const WithdrawalHistory = ({ 
  withdrawals = [], 
  onWithdrawalSelect,
  selectedWithdrawals = [],
  onSelectionChange 
}) => {
  const navigate = useNavigate();
  const [sortConfig, setSortConfig] = useState({
    key: 'createdAt',
    direction: 'desc'
  });

  // Mock data if no withdrawals provided
  const mockWithdrawals = [
    {
      id: 'WD-001',
      amount: 5000.00,
      currency: 'USD',
      cryptoAmount: 0.125,
      cryptoCurrency: 'BTC',
      status: 'completed',
      destination: 'bc1q...xyz123',
      txHash: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890',
      createdAt: '2024-01-15T10:30:00Z',
      completedAt: '2024-01-15T12:45:00Z',
      fee: 25.00
    },
    {
      id: 'WD-002',
      amount: 2500.00,
      currency: 'USD',
      cryptoAmount: 1.125,
      cryptoCurrency: 'ETH',
      status: 'pending',
      destination: '0x1234...abcd',
      txHash: null,
      createdAt: '2024-01-14T16:20:00Z',
      completedAt: null,
      fee: 15.00
    },
    {
      id: 'WD-003',
      amount: 1000.00,
      currency: 'USD',
      cryptoAmount: 1000.00,
      cryptoCurrency: 'USDT',
      status: 'failed',
      destination: '0x5678...efgh',
      txHash: null,
      createdAt: '2024-01-13T09:15:00Z',
      completedAt: null,
      fee: 10.00
    }
  ];

  const displayWithdrawals = withdrawals?.length > 0 ? withdrawals : mockWithdrawals;

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return { icon: 'CheckCircle', color: 'text-success' };
      case 'pending':
        return { icon: 'Clock', color: 'text-warning' };
      case 'processing':
        return { icon: 'Loader', color: 'text-primary' };
      case 'failed':
        return { icon: 'XCircle', color: 'text-destructive' };
      default:
        return { icon: 'Circle', color: 'text-muted-foreground' };
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "inline-flex items-center px-2 py-1 text-xs font-medium rounded-full";
    
    switch (status) {
      case 'completed':
        return `${baseClasses} bg-success/10 text-success`;
      case 'pending':
        return `${baseClasses} bg-warning/10 text-warning`;
      case 'processing':
        return `${baseClasses} bg-primary/10 text-primary`;
      case 'failed':
        return `${baseClasses} bg-destructive/10 text-destructive`;
      default:
        return `${baseClasses} bg-muted text-muted-foreground`;
    }
  };

  const openWithdrawalDetailsModal = (withdrawal) => {
    // Mock modal trigger - in real implementation, this would open the WithdrawalDetailsModal
    console.log('Opening WithdrawalDetailsModal for:', withdrawal?.id);
    if (onWithdrawalSelect) {
      onWithdrawalSelect(withdrawal);
    }
  };

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig?.key === key && prevConfig?.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleBack = () => {
    navigate(-1);
  };

  const sortedWithdrawals = React.useMemo(() => {
    if (!sortConfig?.key) return displayWithdrawals;
    
    return [...displayWithdrawals]?.sort((a, b) => {
      if (a?.[sortConfig?.key] < b?.[sortConfig?.key]) {
        return sortConfig?.direction === 'asc' ? -1 : 1;
      }
      if (a?.[sortConfig?.key] > b?.[sortConfig?.key]) {
        return sortConfig?.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [displayWithdrawals, sortConfig]);

  const formatAmount = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    })?.format(amount);
  };

  const formatCryptoAmount = (amount, currency) => {
    return `${amount} ${currency}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateAddress = (address) => {
    if (!address) return 'N/A';
    return `${address?.slice(0, 8)}...${address?.slice(-6)}`;
  };

  return (
    <div className="bg-card rounded-lg border border-border">
      {/* Table Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Withdrawal History</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Track all your withdrawal transactions
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={handleBack}
              iconName="ArrowLeft"
              iconPosition="left"
            >
              Back
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left py-3 px-6">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-border"
                  onChange={(e) => {
                    const allIds = sortedWithdrawals?.map(w => w?.id);
                    onSelectionChange?.(e?.target?.checked ? allIds : []);
                  }}
                />
              </th>
              <th 
                className="text-left py-3 px-6 text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                onClick={() => handleSort('id')}
              >
                <div className="flex items-center space-x-1">
                  <span>Withdrawal ID</span>
                  <Icon 
                    name="ArrowUpDown" 
                    size={14} 
                    className={sortConfig?.key === 'id' ? 'text-primary' : ''} 
                  />
                </div>
              </th>
              <th 
                className="text-left py-3 px-6 text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                onClick={() => handleSort('amount')}
              >
                <div className="flex items-center space-x-1">
                  <span>Amount</span>
                  <Icon 
                    name="ArrowUpDown" 
                    size={14} 
                    className={sortConfig?.key === 'amount' ? 'text-primary' : ''} 
                  />
                </div>
              </th>
              <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">
                Destination
              </th>
              <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">
                Status
              </th>
              <th 
                className="text-left py-3 px-6 text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                onClick={() => handleSort('createdAt')}
              >
                <div className="flex items-center space-x-1">
                  <span>Created</span>
                  <Icon 
                    name="ArrowUpDown" 
                    size={14} 
                    className={sortConfig?.key === 'createdAt' ? 'text-primary' : ''} 
                  />
                </div>
              </th>
              <th className="text-right py-3 px-6 text-sm font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedWithdrawals?.map((withdrawal) => {
              const statusConfig = getStatusIcon(withdrawal?.status);
              const isSelected = selectedWithdrawals?.includes(withdrawal?.id);
              
              return (
                <tr 
                  key={withdrawal?.id}
                  className={`border-b border-border hover:bg-muted/30 cursor-pointer transition-micro ${
                    isSelected ? 'bg-primary/5' : ''
                  }`}
                  onClick={() => openWithdrawalDetailsModal(withdrawal)}
                >
                  <td className="py-4 px-6">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-border"
                      checked={isSelected}
                      onChange={(e) => {
                        e?.stopPropagation();
                        const newSelection = isSelected 
                          ? selectedWithdrawals?.filter(id => id !== withdrawal?.id)
                          : [...selectedWithdrawals, withdrawal?.id];
                        onSelectionChange?.(newSelection);
                      }}
                    />
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-medium text-foreground">
                      {withdrawal?.id}
                    </div>
                    {withdrawal?.txHash && (
                      <div className="text-sm text-muted-foreground">
                        {truncateAddress(withdrawal?.txHash)}
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-semibold text-foreground">
                      {formatAmount(withdrawal?.amount, withdrawal?.currency)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatCryptoAmount(withdrawal?.cryptoAmount, withdrawal?.cryptoCurrency)}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-foreground font-mono">
                      {truncateAddress(withdrawal?.destination)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {withdrawal?.cryptoCurrency} Address
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={getStatusBadge(withdrawal?.status)}>
                      <Icon 
                        name={statusConfig?.icon} 
                        size={12} 
                        className={`mr-1 ${statusConfig?.color}`} 
                      />
                      {withdrawal?.status?.charAt(0)?.toUpperCase() + withdrawal?.status?.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-muted-foreground">
                      {formatDate(withdrawal?.createdAt)}
                    </div>
                    {withdrawal?.completedAt && (
                      <div className="text-xs text-success">
                        Completed {formatDate(withdrawal?.completedAt)}
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e?.stopPropagation();
                        openWithdrawalDetailsModal(withdrawal);
                      }}
                    >
                      <Icon name="Eye" size={16} />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Showing {sortedWithdrawals?.length} of {sortedWithdrawals?.length} withdrawals
          </span>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              <Icon name="ChevronLeft" size={16} />
            </Button>
            <span className="px-2">Page 1 of 1</span>
            <Button variant="outline" size="sm" disabled>
              <Icon name="ChevronRight" size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalHistory;