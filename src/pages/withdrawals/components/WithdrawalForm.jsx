"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const WithdrawalForm = ({ onSubmit, availableBalance = 0 }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    amount: '',
    currency: 'USD',
    cryptoCurrency: 'BTC',
    destination: '',
    note: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const currencyOptions = [
    { value: 'USD', label: 'USD - US Dollar' },
    { value: 'EUR', label: 'EUR - Euro' },
    { value: 'GBP', label: 'GBP - British Pound' }
  ];

  const cryptoCurrencyOptions = [
    { value: 'BTC', label: 'Bitcoin (BTC)' },
    { value: 'ETH', label: 'Ethereum (ETH)' },
    { value: 'USDT', label: 'Tether (USDT)' },
    { value: 'USDC', label: 'USD Coin (USDC)' }
  ];

  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.amount) {
      newErrors.amount = 'Amount is required';
    } else if (parseFloat(formData?.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    } else if (parseFloat(formData?.amount) > availableBalance) {
      newErrors.amount = 'Amount exceeds available balance';
    }
    
    if (!formData?.destination?.trim()) {
      newErrors.destination = 'Destination address is required';
    } else if (formData?.destination?.length < 20) {
      newErrors.destination = 'Please enter a valid crypto address';
    }
    
    if (!formData?.cryptoCurrency) {
      newErrors.cryptoCurrency = 'Please select a cryptocurrency';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const withdrawalData = {
        ...formData,
        amount: parseFloat(formData?.amount),
        id: `WD-${Date.now()}`,
        status: 'pending',
        createdAt: new Date()?.toISOString(),
        fee: parseFloat(formData?.amount) * 0.01 // 1% fee for example
      };
      
      if (onSubmit) {
        onSubmit(withdrawalData);
      }
      
      console.log('Withdrawal submitted:', withdrawalData);
      
      // Reset form
      setFormData({
        amount: '',
        currency: 'USD',
        cryptoCurrency: 'BTC',
        destination: '',
        note: ''
      });
      
    } catch (error) {
      setErrors({
        general: 'Withdrawal request failed. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const formatBalance = (balance, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    })?.format(balance);
  };

  const calculateFee = () => {
    const amount = parseFloat(formData?.amount) || 0;
    return amount * 0.01; // 1% fee
  };

  const calculateNetAmount = () => {
    const amount = parseFloat(formData?.amount) || 0;
    const fee = calculateFee();
    return amount - fee;
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Request Withdrawal</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Withdraw your funds to your crypto wallet
          </p>
        </div>
        
        <Button
          variant="outline"
          onClick={handleBack}
          iconName="ArrowLeft"
          iconPosition="left"
        >
          Back
        </Button>
      </div>

      {/* Available Balance */}
      <div className="bg-muted/50 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Available Balance</h3>
            <p className="text-2xl font-bold text-foreground">
              {formatBalance(availableBalance, formData?.currency)}
            </p>
          </div>
          <div className="flex items-center space-x-2 text-success">
            <Icon name="Wallet" size={20} />
            <span className="text-sm font-medium">Ready to withdraw</span>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {errors?.general && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Icon name="AlertCircle" size={16} className="text-destructive" />
              <p className="text-sm text-destructive">{errors?.general}</p>
            </div>
          </div>
        )}

        {/* Amount and Currency */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Amount"
            type="number"
            step="0.01"
            min="0"
            max={availableBalance}
            value={formData?.amount}
            onChange={(e) => handleInputChange('amount', e?.target?.value)}
            placeholder="0.00"
            error={errors?.amount}
            required
            disabled={isLoading}
          />
          
          <Select
            label="Currency"
            value={formData?.currency}
            onChange={(value) => handleInputChange('currency', value)}
            options={currencyOptions}
            error={errors?.currency}
            disabled={isLoading}
          />
        </div>

        {/* Cryptocurrency */}
        <Select
          label="Cryptocurrency"
          value={formData?.cryptoCurrency}
          onChange={(value) => handleInputChange('cryptoCurrency', value)}
          options={cryptoCurrencyOptions}
          error={errors?.cryptoCurrency}
          disabled={isLoading}
        />

        {/* Destination Address */}
        <Input
          label="Destination Address"
          type="text"
          value={formData?.destination}
          onChange={(e) => handleInputChange('destination', e?.target?.value)}
          placeholder="Enter your wallet address"
          error={errors?.destination}
          required
          disabled={isLoading}
        />

        {/* Note (Optional) */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Note (Optional)
          </label>
          <textarea
            value={formData?.note}
            onChange={(e) => handleInputChange('note', e?.target?.value)}
            placeholder="Add a note for this withdrawal..."
            rows={3}
            disabled={isLoading}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* Summary */}
        {formData?.amount && (
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-foreground mb-3">Withdrawal Summary</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Amount:</span>
                <span className="text-foreground">
                  {formatBalance(parseFloat(formData?.amount) || 0, formData?.currency)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Network Fee:</span>
                <span className="text-foreground">
                  {formatBalance(calculateFee(), formData?.currency)}
                </span>
              </div>
              <div className="border-t border-border pt-2">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-foreground">You'll receive:</span>
                  <span className="text-foreground">
                    {formatBalance(calculateNetAmount(), formData?.currency)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          variant="default"
          size="lg"
          fullWidth
          loading={isLoading}
          className="gradient-primary"
          iconName="ArrowUpRight"
          iconPosition="right"
        >
          {isLoading ? 'Processing...' : 'Request Withdrawal'}
        </Button>
      </form>

      {/* Security Notice */}
      <div className="mt-6 p-4 bg-warning/10 border border-warning/20 rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="Shield" size={20} className="text-warning mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-foreground mb-1">Security Notice</h4>
            <p className="text-xs text-muted-foreground">
              Please double-check the destination address before submitting. 
              Cryptocurrency transactions are irreversible and cannot be undone.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalForm;