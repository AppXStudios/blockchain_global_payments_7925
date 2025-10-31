"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PaymentLinkCard = ({ link, onAnalytics, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return { icon: 'CheckCircle', color: 'text-success' };
      case 'inactive':
        return { icon: 'XCircle', color: 'text-muted-foreground' };
      case 'expired':
        return { icon: 'Clock', color: 'text-destructive' };
      default:
        return { icon: 'Circle', color: 'text-muted-foreground' };
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "inline-flex items-center px-2 py-1 text-xs font-medium rounded-full";
    
    switch (status) {
      case 'active':
        return `${baseClasses} bg-success/10 text-success`;
      case 'inactive':
        return `${baseClasses} bg-muted text-muted-foreground`;
      case 'expired':
        return `${baseClasses} bg-destructive/10 text-destructive`;
      default:
        return `${baseClasses} bg-muted text-muted-foreground`;
    }
  };

  const handleCardClick = () => {
    // Navigate to specific payment link page
    navigate(`/payment-links/${link?.id}`);
  };

  const handleAnalyticsClick = (e) => {
    e?.stopPropagation();
    // Open LinkAnalyticsModal
    if (onAnalytics) {
      onAnalytics(link);
    } else {
      console.log('Opening LinkAnalyticsModal for:', link?.id);
    }
  };

  const handleCopyLink = async (e) => {
    e?.stopPropagation();
    setIsLoading(true);
    
    try {
      await navigator.clipboard?.writeText(link?.url);
      // In a real app, you'd show a toast notification here
      console.log('Link copied to clipboard:', link?.url);
    } catch (error) {
      console.error('Failed to copy link:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (e) => {
    e?.stopPropagation();
    if (onEdit) {
      onEdit(link);
    }
  };

  const handleDeleteClick = (e) => {
    e?.stopPropagation();
    if (onDelete) {
      onDelete(link);
    }
  };

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
    <div 
      className="bg-card border border-border rounded-lg p-6 hover:shadow-md hover:border-primary/20 transition-smooth cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-1">
            {link?.title}
          </h3>
          <p className="text-sm text-muted-foreground">
            {link?.description}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={getStatusBadge(link?.status)}>
            {link?.status?.charAt(0)?.toUpperCase() + link?.status?.slice(1)}
          </span>
        </div>
      </div>

      {/* Amount and Currency */}
      <div className="mb-4">
        <div className="text-2xl font-bold text-foreground">
          {formatAmount(link?.amount, link?.currency)}
        </div>
        <div className="text-sm text-muted-foreground">
          {link?.type === 'fixed' ? 'Fixed Amount' : 'Custom Amount'}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-lg font-semibold text-foreground">
            {link?.views || 0}
          </div>
          <div className="text-xs text-muted-foreground">Views</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-foreground">
            {link?.payments || 0}
          </div>
          <div className="text-xs text-muted-foreground">Payments</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-success">
            {formatAmount(link?.totalEarned || 0, link?.currency)}
          </div>
          <div className="text-xs text-muted-foreground">Earned</div>
        </div>
      </div>

      {/* Created Date */}
      <div className="text-xs text-muted-foreground mb-4">
        Created on {formatDate(link?.createdAt)}
        {link?.expiresAt && (
          <span> • Expires {formatDate(link?.expiresAt)}</span>
        )}
      </div>

      {/* Link URL */}
      <div className="bg-muted rounded-lg p-3 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground font-mono truncate">
            {link?.url}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyLink}
            loading={isLoading}
            className="ml-2"
          >
            <Icon name="Copy" size={14} />
          </Button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleAnalyticsClick}
          iconName="BarChart3"
          iconPosition="left"
        >
          Analytics
        </Button>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEditClick}
          >
            <Icon name="Edit2" size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDeleteClick}
            className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
          >
            <Icon name="Trash2" size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentLinkCard;