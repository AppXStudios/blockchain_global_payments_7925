import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentTransactions = ({ transactions, onViewAll }) => {
  const [sortField, setSortField] = useState('timestamp');
  const [sortDirection, setSortDirection] = useState('desc');

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'text-success bg-success/10';
      case 'pending': return 'text-warning bg-warning/10';
      case 'failed': return 'text-destructive bg-destructive/10';
      case 'processing': return 'text-primary bg-primary/10';
      default: return 'text-muted-foreground bg-muted/10';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'CheckCircle';
      case 'pending': return 'Clock';
      case 'failed': return 'XCircle';
      case 'processing': return 'Loader';
      default: return 'Circle';
    }
  };

  const formatAmount = (amount, currency) => {
    if (currency === 'USD') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      })?.format(amount);
    }
    return `${amount} ${currency}`;
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })?.format(new Date(date));
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedTransactions = [...transactions]?.sort((a, b) => {
    let aValue = a?.[sortField];
    let bValue = b?.[sortField];
    
    if (sortField === 'timestamp') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    }
    return aValue < bValue ? 1 : -1;
  });

  const SortableHeader = ({ field, children }) => (
    <th 
      className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-micro"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        <Icon 
          name={sortField === field && sortDirection === 'desc' ? 'ChevronDown' : 'ChevronUp'} 
          size={14}
          className={sortField === field ? 'text-primary' : 'text-muted-foreground'}
        />
      </div>
    </th>
  );

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Recent Transactions</h3>
          <Button variant="ghost" size="sm" onClick={onViewAll}>
            <Icon name="ExternalLink" size={16} className="mr-2" />
            View All
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/20">
            <tr>
              <SortableHeader field="id">Transaction ID</SortableHeader>
              <SortableHeader field="status">Status</SortableHeader>
              <SortableHeader field="amount">Amount</SortableHeader>
              <SortableHeader field="currency">Currency</SortableHeader>
              <SortableHeader field="timestamp">Date</SortableHeader>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedTransactions?.slice(0, 5)?.map((transaction) => (
              <tr key={transaction?.id} className="hover:bg-muted/10 transition-micro">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center mr-3">
                      <Icon name="Hash" size={14} className="text-muted-foreground" />
                    </div>
                    <span className="text-sm font-medium text-foreground">{transaction?.id}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction?.status)}`}>
                    <Icon name={getStatusIcon(transaction?.status)} size={12} className="mr-1" />
                    {transaction?.status}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-semibold text-foreground">
                    {formatAmount(transaction?.amount, transaction?.currency)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-gradient-primary flex items-center justify-center mr-2">
                      <span className="text-xs font-bold text-white">
                        {transaction?.currency?.charAt(0)}
                      </span>
                    </div>
                    <span className="text-sm text-foreground">{transaction?.currency}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                  {formatDate(transaction?.timestamp)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Button variant="ghost" size="sm">
                    <Icon name="Eye" size={14} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {transactions?.length > 5 && (
        <div className="px-6 py-4 border-t border-border bg-muted/10">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing 5 of {transactions?.length} transactions
            </p>
            <Button variant="outline" size="sm" onClick={onViewAll}>
              View All Transactions
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentTransactions;