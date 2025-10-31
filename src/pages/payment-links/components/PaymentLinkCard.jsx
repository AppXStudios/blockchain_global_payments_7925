"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PaymentLinkCard = ({ link }) => {
  const navigate = useNavigate();
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator?.clipboard?.writeText(link?.url);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleViewDetails = () => {
    // ✅ FIXED — Navigate to correct /dashboard/links/{id} route
    navigate(`/dashboard/links/${link?.id}`);
  };

  const handleViewAnalytics = () => {
    // ✅ FIXED — Navigate to correct /dashboard/links/{id} route with analytics focus
    navigate(`/dashboard/links/${link?.id}`, { state: { tab: 'analytics' } });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'text-green-600 bg-green-100 border-green-200';
      case 'inactive':
        return 'text-gray-600 bg-gray-100 border-gray-200';
      case 'expired':
        return 'text-red-600 bg-red-100 border-red-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const formatAmount = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency?.toUpperCase(),
    })?.format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-smooth">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-1">
            {link?.name || 'Payment Link'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {link?.description || 'No description provided'}
          </p>
        </div>
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(link?.status)}`}>
          {link?.status?.charAt(0)?.toUpperCase() + link?.status?.slice(1) || 'Active'}
        </span>
      </div>

      {/* Amount and Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-muted-foreground">Amount</p>
          <p className="text-lg font-semibold text-foreground">
            {formatAmount(link?.amount, link?.currency)}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Payments</p>
          <p className="text-lg font-semibold text-foreground">
            {link?.paymentCount || 0}
          </p>
        </div>
      </div>

      {/* Link URL */}
      <div className="mb-4">
        <p className="text-xs text-muted-foreground mb-1">Payment URL</p>
        <div className="flex items-center space-x-2 p-2 bg-muted rounded-lg">
          <span className="text-sm text-foreground font-mono flex-1 truncate">
            {link?.url || `/pay/${link?.id}`}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyLink}
            className="text-xs"
          >
            {isCopied ? (
              <Icon name="Check" size={14} className="text-green-600" />
            ) : (
              <Icon name="Copy" size={14} />
            )}
          </Button>
        </div>
      </div>

      {/* Metadata */}
      <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
        <span>Created: {formatDate(link?.createdAt || new Date())}</span>
        {link?.expiryDate && (
          <span>Expires: {formatDate(link?.expiryDate)}</span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleViewDetails}
          className="flex-1"
          iconName="Eye"
          iconPosition="left"
        >
          View Details
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleViewAnalytics}
          iconName="BarChart3"
          iconPosition="left"
        >
          Analytics
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopyLink}
          title="Copy Link"
        >
          <Icon name="Share" size={16} />
        </Button>
      </div>
    </div>
  );
};

export default PaymentLinkCard;