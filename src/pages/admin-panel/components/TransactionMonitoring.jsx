"use client";

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TransactionMonitoring = ({ transactions = [] }) => {
  const navigate = useNavigate();
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: 'createdAt',
    direction: 'desc'
  });

  // Mock data if no transactions provided
  const mockTransactions = [
    {
      id: 'txn_001',
      reference: 'PAY-2024-001',
      amount: 1250.00,
      currency: 'USD',
      cryptoAmount: 0.031245,
      cryptoCurrency: 'BTC',
      status: 'completed',
      merchant: 'TechCorp Solutions',
      customer: 'john.doe@example.com',
      createdAt: '2024-10-30T14:30:00Z',
      completedAt: '2024-10-30T14:35:00Z',
      networkFee: 5.50,
      type: 'payment'
    },
    {
      id: 'txn_002',
      reference: 'WD-2024-002',
      amount: 2500.00,
      currency: 'USD',
      cryptoAmount: 1.25,
      cryptoCurrency: 'ETH',
      status: 'pending',
      merchant: 'Global E-commerce',
      customer: 'jane.smith@example.com',
      createdAt: '2024-10-30T12:15:00Z',
      completedAt: null,
      networkFee: 15.00,
      type: 'withdrawal'
    },
    {
      id: 'txn_003',
      reference: 'REF-2024-003',
      amount: 750.00,
      currency: 'USD',
      cryptoAmount: 750.00,
      cryptoCurrency: 'USDT',
      status: 'failed',
      merchant: 'StartupPay Inc',
      customer: 'mike.johnson@example.com',
      createdAt: '2024-10-30T09:45:00Z',
      completedAt: null,
      networkFee: 2.00,
      type: 'refund'
    }
  ];

  const displayTransactions = transactions?.length > 0 ? transactions : mockTransactions;

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
      case 'cancelled':
        return { icon: 'Ban', color: 'text-muted-foreground' };
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
      case 'cancelled':
        return `${baseClasses} bg-muted text-muted-foreground`;
      default:
        return `${baseClasses} bg-muted text-muted-foreground`;
    }
  };

  const getTypeBadge = (type) => {
    const baseClasses = "inline-flex items-center px-2 py-1 text-xs font-medium rounded-full";
    
    switch (type) {
      case 'payment':
        return `${baseClasses} bg-primary/10 text-primary`;
      case 'withdrawal':
        return `${baseClasses} bg-secondary/10 text-secondary`;
      case 'refund':
        return `${baseClasses} bg-warning/10 text-warning`;
      default:
        return `${baseClasses} bg-muted text-muted-foreground`;
    }
  };

  const openTransactionDetailsModal = (transaction) => {
    // Mock modal trigger - in real implementation, this would open the TransactionDetailsModal
    console.log('Opening TransactionDetailsModal for:', transaction?.id);
  };

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig?.key === key && prevConfig?.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortedTransactions = React.useMemo(() => {
    if (!sortConfig?.key) return displayTransactions;
    
    return [...displayTransactions]?.sort((a, b) => {
      if (a?.[sortConfig?.key] < b?.[sortConfig?.key]) {
        return sortConfig?.direction === 'asc' ? -1 : 1;
      }
      if (a?.[sortConfig?.key] > b?.[sortConfig?.key]) {
        return sortConfig?.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [displayTransactions, sortConfig]);

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

  return (
    <div className="bg-card rounded-lg border border-border">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Transaction Monitoring</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Monitor all platform transactions in real-time
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              iconName="Filter"
              iconPosition="left"
            >
              Filter
            </Button>
            <Button
              variant="outline"
              iconName="Download"
              iconPosition="left"
            >
              Export
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
                    const allIds = sortedTransactions?.map(t => t?.id);
                    setSelectedTransactions(e?.target?.checked ? allIds : []);
                  }}
                />
              </th>
              <th 
                className="text-left py-3 px-6 text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                onClick={() => handleSort('reference')}
              >
                <div className="flex items-center space-x-1">
                  <span>Reference</span>
                  <Icon 
                    name="ArrowUpDown" 
                    size={14} 
                    className={sortConfig?.key === 'reference' ? 'text-primary' : ''} 
                  />
                </div>
              </th>
              <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">
                Type
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
                Status
              </th>
              <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">
                Merchant
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
            {sortedTransactions?.map((transaction) => {
              const statusConfig = getStatusIcon(transaction?.status);
              const isSelected = selectedTransactions?.includes(transaction?.id);
              
              return (
                <tr 
                  key={transaction?.id}
                  className={`border-b border-border hover:bg-muted/30 cursor-pointer transition-micro ${
                    isSelected ? 'bg-primary/5' : ''
                  }`}
                  onClick={() => openTransactionDetailsModal(transaction)}
                >
                  <td className="py-4 px-6">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-border"
                      checked={isSelected}
                      onChange={(e) => {
                        e?.stopPropagation();
                        const newSelection = isSelected 
                          ? selectedTransactions?.filter(id => id !== transaction?.id)
                          : [...selectedTransactions, transaction?.id];
                        setSelectedTransactions(newSelection);
                      }}
                    />
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-medium text-foreground">
                      {transaction?.reference}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {transaction?.id}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={getTypeBadge(transaction?.type)}>
                      {transaction?.type?.charAt(0)?.toUpperCase() + transaction?.type?.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-semibold text-foreground">
                      {formatAmount(transaction?.amount, transaction?.currency)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatCryptoAmount(transaction?.cryptoAmount, transaction?.cryptoCurrency)}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={getStatusBadge(transaction?.status)}>
                      <Icon 
                        name={statusConfig?.icon} 
                        size={12} 
                        className={`mr-1 ${statusConfig?.color}`} 
                      />
                      {transaction?.status?.charAt(0)?.toUpperCase() + transaction?.status?.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-foreground">
                      {transaction?.merchant}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {transaction?.customer}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-muted-foreground">
                      {formatDate(transaction?.createdAt)}
                    </div>
                    {transaction?.completedAt && (
                      <div className="text-xs text-success">
                        Completed {formatDate(transaction?.completedAt)}
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e?.stopPropagation();
                        openTransactionDetailsModal(transaction);
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
            Showing {sortedTransactions?.length} of {sortedTransactions?.length} transactions
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

export default TransactionMonitoring;