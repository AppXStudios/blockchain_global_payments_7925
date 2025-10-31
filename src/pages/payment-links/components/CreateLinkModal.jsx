import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const CreateLinkModal = ({ isOpen, onClose, onCreateLink }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    amount: '',
    currency: 'USD',
    expiresAt: '',
    maxUses: '',
    redirectUrl: '',
    enableNotifications: true,
    customBranding: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currencyOptions = [
    { value: 'USD', label: 'USD - US Dollar' },
    { value: 'BTC', label: 'BTC - Bitcoin' },
    { value: 'ETH', label: 'ETH - Ethereum' },
    { value: 'USDT', label: 'USDT - Tether' },
    { value: 'USDC', label: 'USDC - USD Coin' },
    { value: 'LTC', label: 'LTC - Litecoin' },
    { value: 'BCH', label: 'BCH - Bitcoin Cash' },
    { value: 'XRP', label: 'XRP - Ripple' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.name?.trim()) {
      newErrors.name = 'Link name is required';
    }

    if (!formData?.amount || parseFloat(formData?.amount) <= 0) {
      newErrors.amount = 'Valid amount is required';
    }

    if (!formData?.currency) {
      newErrors.currency = 'Currency selection is required';
    }

    if (formData?.maxUses && parseInt(formData?.maxUses) <= 0) {
      newErrors.maxUses = 'Max uses must be greater than 0';
    }

    if (formData?.redirectUrl && !isValidUrl(formData?.redirectUrl)) {
      newErrors.redirectUrl = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const linkData = {
        ...formData,
        amount: parseFloat(formData?.amount),
        maxUses: formData?.maxUses ? parseInt(formData?.maxUses) : null,
        id: Date.now()?.toString(),
        url: `https://pay.blockpay.com/link/${Date.now()}`,
        status: 'active',
        isActive: true,
        stats: {
          clicks: 0,
          payments: 0,
          conversionRate: 0
        },
        createdAt: new Date()?.toLocaleDateString()
      };

      await onCreateLink(linkData);
      onClose();
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        amount: '',
        currency: 'USD',
        expiresAt: '',
        maxUses: '',
        redirectUrl: '',
        enableNotifications: true,
        customBranding: false
      });
    } catch (error) {
      console.error('Error creating payment link:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-1000 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Create Payment Link
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Generate a reusable payment URL for your customers
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">
              Basic Information
            </h3>
            
            <Input
              label="Link Name"
              type="text"
              placeholder="e.g., Monthly Subscription, Product Payment"
              value={formData?.name}
              onChange={(e) => handleInputChange('name', e?.target?.value)}
              error={errors?.name}
              required
            />

            <Input
              label="Description"
              type="text"
              placeholder="Brief description of what this payment is for"
              value={formData?.description}
              onChange={(e) => handleInputChange('description', e?.target?.value)}
              description="This will be shown to customers on the checkout page"
            />
          </div>

          {/* Payment Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">
              Payment Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Amount"
                type="number"
                placeholder="0.00"
                value={formData?.amount}
                onChange={(e) => handleInputChange('amount', e?.target?.value)}
                error={errors?.amount}
                required
                min="0"
                step="0.01"
              />

              <Select
                label="Currency"
                options={currencyOptions}
                value={formData?.currency}
                onChange={(value) => handleInputChange('currency', value)}
                error={errors?.currency}
                required
              />
            </div>
          </div>

          {/* Advanced Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">
              Advanced Settings
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Expiration Date"
                type="date"
                value={formData?.expiresAt}
                onChange={(e) => handleInputChange('expiresAt', e?.target?.value)}
                description="Leave empty for no expiration"
              />

              <Input
                label="Max Uses"
                type="number"
                placeholder="Unlimited"
                value={formData?.maxUses}
                onChange={(e) => handleInputChange('maxUses', e?.target?.value)}
                error={errors?.maxUses}
                min="1"
                description="Maximum number of times this link can be used"
              />
            </div>

            <Input
              label="Redirect URL"
              type="url"
              placeholder="https://yoursite.com/success"
              value={formData?.redirectUrl}
              onChange={(e) => handleInputChange('redirectUrl', e?.target?.value)}
              error={errors?.redirectUrl}
              description="Where to redirect customers after successful payment"
            />
          </div>

          {/* Options */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">
              Options
            </h3>
            
            <div className="space-y-3">
              <Checkbox
                label="Enable webhook notifications"
                description="Receive real-time notifications when payments are made"
                checked={formData?.enableNotifications}
                onChange={(e) => handleInputChange('enableNotifications', e?.target?.checked)}
              />

              <Checkbox
                label="Custom branding"
                description="Apply your brand colors and logo to the checkout page"
                checked={formData?.customBranding}
                onChange={(e) => handleInputChange('customBranding', e?.target?.checked)}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              loading={isSubmitting}
              className="gradient-primary"
            >
              Create Payment Link
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateLinkModal;