"use client";

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MerchantOverview = ({ merchants = [] }) => {
  const navigate = useNavigate();
  const [selectedMerchants, setSelectedMerchants] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: 'joinedAt',
    direction: 'desc'
  });

  // Mock data if no merchants provided
  const mockMerchants = [
    {
      id: 'merch_001',
      name: 'TechCorp Solutions',
      email: 'admin@techcorp.com',
      status: 'active',
      totalVolume: 125000.00,
      transactionCount: 450,
      joinedAt: '2024-01-15T10:30:00Z',
      lastActivity: '2024-10-30T14:20:00Z',
      tier: 'enterprise',
      country: 'United States'
    },
    {
      id: 'merch_002',
      name: 'Global E-commerce',
      email: 'billing@globalecom.com',
      status: 'active',
      totalVolume: 87500.00,
      transactionCount: 320,
      joinedAt: '2024-02-20T08:15:00Z',
      lastActivity: '2024-10-30T09:45:00Z',
      tier: 'professional',
      country: 'United Kingdom'
    },
    {
      id: 'merch_003',
      name: 'StartupPay Inc',
      email: 'contact@startuppay.com',
      status: 'pending',
      totalVolume: 12500.00,
      transactionCount: 45,
      joinedAt: '2024-10-25T16:30:00Z',
      lastActivity: '2024-10-29T11:20:00Z',
      tier: 'basic',
      country: 'Canada'
    }
  ];

  const displayMerchants = merchants?.length > 0 ? merchants : mockMerchants;

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return { icon: 'CheckCircle', color: 'text-success' };
      case 'pending':
        return { icon: 'Clock', color: 'text-warning' };
      case 'suspended':
        return { icon: 'AlertCircle', color: 'text-destructive' };
      case 'inactive':
        return { icon: 'XCircle', color: 'text-muted-foreground' };
      default:
        return { icon: 'Circle', color: 'text-muted-foreground' };
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "inline-flex items-center px-2 py-1 text-xs font-medium rounded-full";
    
    switch (status) {
      case 'active':
        return `${baseClasses} bg-success/10 text-success`;
      case 'pending':
        return `${baseClasses} bg-warning/10 text-warning`;
      case 'suspended':
        return `${baseClasses} bg-destructive/10 text-destructive`;
      case 'inactive':
        return `${baseClasses} bg-muted text-muted-foreground`;
      default:
        return `${baseClasses} bg-muted text-muted-foreground`;
    }
  };

  const getTierBadge = (tier) => {
    const baseClasses = "inline-flex items-center px-2 py-1 text-xs font-medium rounded-full";
    
    switch (tier) {
      case 'enterprise':
        return `${baseClasses} bg-primary/10 text-primary`;
      case 'professional':
        return `${baseClasses} bg-secondary/10 text-secondary`;
      case 'basic':
        return `${baseClasses} bg-muted text-muted-foreground`;
      default:
        return `${baseClasses} bg-muted text-muted-foreground`;
    }
  };

  const handleMerchantClick = (merchant) => {
    // Navigate to merchant detail page
    navigate(`/admin-panel/merchants/${merchant?.id}`);
  };

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig?.key === key && prevConfig?.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortedMerchants = React.useMemo(() => {
    if (!sortConfig?.key) return displayMerchants;
    
    return [...displayMerchants]?.sort((a, b) => {
      if (a?.[sortConfig?.key] < b?.[sortConfig?.key]) {
        return sortConfig?.direction === 'asc' ? -1 : 1;
      }
      if (a?.[sortConfig?.key] > b?.[sortConfig?.key]) {
        return sortConfig?.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [displayMerchants, sortConfig]);

  const formatAmount = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
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
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Merchant Overview</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Monitor and manage all registered merchants
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
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
                    const allIds = sortedMerchants?.map(m => m?.id);
                    setSelectedMerchants(e?.target?.checked ? allIds : []);
                  }}
                />
              </th>
              <th 
                className="text-left py-3 px-6 text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center space-x-1">
                  <span>Merchant</span>
                  <Icon 
                    name="ArrowUpDown" 
                    size={14} 
                    className={sortConfig?.key === 'name' ? 'text-primary' : ''} 
                  />
                </div>
              </th>
              <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">
                Status
              </th>
              <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">
                Tier
              </th>
              <th 
                className="text-left py-3 px-6 text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                onClick={() => handleSort('totalVolume')}
              >
                <div className="flex items-center space-x-1">
                  <span>Volume</span>
                  <Icon 
                    name="ArrowUpDown" 
                    size={14} 
                    className={sortConfig?.key === 'totalVolume' ? 'text-primary' : ''} 
                  />
                </div>
              </th>
              <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">
                Transactions
              </th>
              <th 
                className="text-left py-3 px-6 text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                onClick={() => handleSort('joinedAt')}
              >
                <div className="flex items-center space-x-1">
                  <span>Joined</span>
                  <Icon 
                    name="ArrowUpDown" 
                    size={14} 
                    className={sortConfig?.key === 'joinedAt' ? 'text-primary' : ''} 
                  />
                </div>
              </th>
              <th className="text-right py-3 px-6 text-sm font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedMerchants?.map((merchant) => {
              const statusConfig = getStatusIcon(merchant?.status);
              const isSelected = selectedMerchants?.includes(merchant?.id);
              
              return (
                <tr 
                  key={merchant?.id}
                  className={`border-b border-border hover:bg-muted/30 cursor-pointer transition-micro ${
                    isSelected ? 'bg-primary/5' : ''
                  }`}
                  onClick={() => handleMerchantClick(merchant)}
                >
                  <td className="py-4 px-6">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-border"
                      checked={isSelected}
                      onChange={(e) => {
                        e?.stopPropagation();
                        const newSelection = isSelected 
                          ? selectedMerchants?.filter(id => id !== merchant?.id)
                          : [...selectedMerchants, merchant?.id];
                        setSelectedMerchants(newSelection);
                      }}
                    />
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {merchant?.name?.charAt(0)?.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-foreground">
                          {merchant?.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {merchant?.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={getStatusBadge(merchant?.status)}>
                      <Icon 
                        name={statusConfig?.icon} 
                        size={12} 
                        className={`mr-1 ${statusConfig?.color}`} 
                      />
                      {merchant?.status?.charAt(0)?.toUpperCase() + merchant?.status?.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={getTierBadge(merchant?.tier)}>
                      {merchant?.tier?.charAt(0)?.toUpperCase() + merchant?.tier?.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-semibold text-foreground">
                      {formatAmount(merchant?.totalVolume)}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-foreground">
                      {merchant?.transactionCount?.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-muted-foreground">
                      {formatDate(merchant?.joinedAt)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Last: {formatDate(merchant?.lastActivity)}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e?.stopPropagation();
                        handleMerchantClick(merchant);
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
            Showing {sortedMerchants?.length} of {sortedMerchants?.length} merchants
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

export default MerchantOverview;