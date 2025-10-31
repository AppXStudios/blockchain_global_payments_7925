"use client";

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const InvoiceTable = ({ 
  invoices = [], 
  onInvoiceSelect,
  selectedInvoices = [],
  onSelectionChange 
}) => {
  const navigate = useNavigate();
  const [sortConfig, setSortConfig] = useState({
    key: 'createdAt',
    direction: 'desc'
  });

  // Mock data if no invoices provided
  const mockInvoices = [
    {
      id: 'INV-001',
      number: 'INV-2024-001',
      amount: 1250.00,
      currency: 'USD',
      status: 'paid',
      customer: 'TechCorp Ltd',
      email: 'billing@techcorp.com',
      createdAt: '2024-01-15T10:30:00Z',
      dueDate: '2024-02-15T10:30:00Z',
      items: 3
    },
    {
      id: 'INV-002',
      number: 'INV-2024-002',
      amount: 750.50,
      currency: 'USD',
      status: 'pending',
      customer: 'Digital Store',
      email: 'info@digitalstore.com',
      createdAt: '2024-01-14T08:15:00Z',
      dueDate: '2024-02-14T08:15:00Z',
      items: 2
    },
    {
      id: 'INV-003',
      number: 'INV-2024-003',
      amount: 2100.75,
      currency: 'USD',
      status: 'overdue',
      customer: 'E-commerce Plus',
      email: 'billing@ecomplus.com',
      createdAt: '2024-01-13T16:45:00Z',
      dueDate: '2024-01-28T16:45:00Z',
      items: 5
    }
  ];

  const displayInvoices = invoices?.length > 0 ? invoices : mockInvoices;

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid':
        return { icon: 'CheckCircle', color: 'text-success' };
      case 'pending':
        return { icon: 'Clock', color: 'text-warning' };
      case 'overdue':
        return { icon: 'AlertCircle', color: 'text-destructive' };
      case 'draft':
        return { icon: 'FileText', color: 'text-muted-foreground' };
      default:
        return { icon: 'Circle', color: 'text-muted-foreground' };
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "inline-flex items-center px-2 py-1 text-xs font-medium rounded-full";
    
    switch (status) {
      case 'paid':
        return `${baseClasses} bg-success/10 text-success`;
      case 'pending':
        return `${baseClasses} bg-warning/10 text-warning`;
      case 'overdue':
        return `${baseClasses} bg-destructive/10 text-destructive`;
      case 'draft':
        return `${baseClasses} bg-muted text-muted-foreground`;
      default:
        return `${baseClasses} bg-muted text-muted-foreground`;
    }
  };

  const openInvoicePreviewModal = (invoice) => {
    // Mock modal trigger - in real implementation, this would open the InvoicePreviewModal
    console.log('Opening InvoicePreviewModal for:', invoice?.id);
    if (onInvoiceSelect) {
      onInvoiceSelect(invoice);
    }
  };

  const openCreateInvoiceModal = () => {
    // Mock modal trigger - in real implementation, this would open the CreateInvoiceModal
    console.log('Opening CreateInvoiceModal');
  };

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig?.key === key && prevConfig?.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortedInvoices = React.useMemo(() => {
    if (!sortConfig?.key) return displayInvoices;
    
    return [...displayInvoices]?.sort((a, b) => {
      if (a?.[sortConfig?.key] < b?.[sortConfig?.key]) {
        return sortConfig?.direction === 'asc' ? -1 : 1;
      }
      if (a?.[sortConfig?.key] > b?.[sortConfig?.key]) {
        return sortConfig?.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [displayInvoices, sortConfig]);

  const formatAmount = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    })?.format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-card rounded-lg border border-border">
      {/* Table Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Invoices</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Manage and track all your invoices
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="default"
              onClick={openCreateInvoiceModal}
              className="gradient-primary"
              iconName="Plus"
              iconPosition="left"
            >
              Create Invoice
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
                    const allIds = sortedInvoices?.map(i => i?.id);
                    onSelectionChange?.(e?.target?.checked ? allIds : []);
                  }}
                />
              </th>
              <th 
                className="text-left py-3 px-6 text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                onClick={() => handleSort('number')}
              >
                <div className="flex items-center space-x-1">
                  <span>Invoice #</span>
                  <Icon 
                    name="ArrowUpDown" 
                    size={14} 
                    className={sortConfig?.key === 'number' ? 'text-primary' : ''} 
                  />
                </div>
              </th>
              <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">
                Customer
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
              <th 
                className="text-left py-3 px-6 text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                onClick={() => handleSort('dueDate')}
              >
                <div className="flex items-center space-x-1">
                  <span>Due Date</span>
                  <Icon 
                    name="ArrowUpDown" 
                    size={14} 
                    className={sortConfig?.key === 'dueDate' ? 'text-primary' : ''} 
                  />
                </div>
              </th>
              <th className="text-right py-3 px-6 text-sm font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedInvoices?.map((invoice) => {
              const statusConfig = getStatusIcon(invoice?.status);
              const isSelected = selectedInvoices?.includes(invoice?.id);
              
              return (
                <tr 
                  key={invoice?.id}
                  className={`border-b border-border hover:bg-muted/30 cursor-pointer transition-micro ${
                    isSelected ? 'bg-primary/5' : ''
                  }`}
                  onClick={() => openInvoicePreviewModal(invoice)}
                >
                  <td className="py-4 px-6">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-border"
                      checked={isSelected}
                      onChange={(e) => {
                        e?.stopPropagation();
                        const newSelection = isSelected 
                          ? selectedInvoices?.filter(id => id !== invoice?.id)
                          : [...selectedInvoices, invoice?.id];
                        onSelectionChange?.(newSelection);
                      }}
                    />
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-medium text-foreground">
                      {invoice?.number}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {invoice?.items} item{invoice?.items !== 1 ? 's' : ''}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-foreground">
                      {invoice?.customer}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {invoice?.email}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-semibold text-foreground">
                      {formatAmount(invoice?.amount, invoice?.currency)}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={getStatusBadge(invoice?.status)}>
                      <Icon 
                        name={statusConfig?.icon} 
                        size={12} 
                        className={`mr-1 ${statusConfig?.color}`} 
                      />
                      {invoice?.status?.charAt(0)?.toUpperCase() + invoice?.status?.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-muted-foreground">
                      {formatDate(invoice?.dueDate)}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e?.stopPropagation();
                        openInvoicePreviewModal(invoice);
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
            Showing {sortedInvoices?.length} of {sortedInvoices?.length} invoices
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

export default InvoiceTable;