import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const CreateInvoiceModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerAddress: '',
    invoiceNumber: `INV-${Date.now()}`,
    dueDate: '',
    currency: 'USD',
    taxRate: 0,
    notes: '',
    isRecurring: false,
    recurringInterval: 'monthly',
    paymentTerms: '30'
  });

  const [lineItems, setLineItems] = useState([
    { id: 1, description: '', quantity: 1, rate: 0, amount: 0 }
  ]);

  const [errors, setErrors] = useState({});

  const currencyOptions = [
    { value: 'USD', label: 'USD - US Dollar' },
    { value: 'EUR', label: 'EUR - Euro' },
    { value: 'GBP', label: 'GBP - British Pound' },
    { value: 'BTC', label: 'BTC - Bitcoin' },
    { value: 'ETH', label: 'ETH - Ethereum' },
    { value: 'USDT', label: 'USDT - Tether' },
    { value: 'ADA', label: 'ADA - Cardano' },
    { value: 'DOT', label: 'DOT - Polkadot' }
  ];

  const paymentTermsOptions = [
    { value: '15', label: 'Net 15 days' },
    { value: '30', label: 'Net 30 days' },
    { value: '45', label: 'Net 45 days' },
    { value: '60', label: 'Net 60 days' },
    { value: 'immediate', label: 'Due immediately' }
  ];

  const recurringIntervalOptions = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'yearly', label: 'Yearly' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleLineItemChange = (id, field, value) => {
    setLineItems(prev => prev?.map(item => {
      if (item?.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'rate') {
          updated.amount = updated?.quantity * updated?.rate;
        }
        return updated;
      }
      return item;
    }));
  };

  const addLineItem = () => {
    const newId = Math.max(...lineItems?.map(item => item?.id)) + 1;
    setLineItems(prev => [...prev, {
      id: newId,
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0
    }]);
  };

  const removeLineItem = (id) => {
    if (lineItems?.length > 1) {
      setLineItems(prev => prev?.filter(item => item?.id !== id));
    }
  };

  const calculateSubtotal = () => {
    return lineItems?.reduce((sum, item) => sum + item?.amount, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * (formData?.taxRate / 100);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.customerName?.trim()) {
      newErrors.customerName = 'Customer name is required';
    }

    if (!formData?.customerEmail?.trim()) {
      newErrors.customerEmail = 'Customer email is required';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.customerEmail)) {
      newErrors.customerEmail = 'Please enter a valid email address';
    }

    if (!formData?.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }

    const hasValidLineItems = lineItems?.some(item => 
      item?.description?.trim() && item?.quantity > 0 && item?.rate > 0
    );

    if (!hasValidLineItems) {
      newErrors.lineItems = 'At least one line item with description, quantity, and rate is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const invoiceData = {
      ...formData,
      lineItems: lineItems?.filter(item => item?.description?.trim()),
      subtotal: calculateSubtotal(),
      tax: calculateTax(),
      total: calculateTotal(),
      status: 'draft',
      created: new Date()?.toISOString(),
      paymentProgress: 0
    };

    onSubmit(invoiceData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-1000 p-4">
      <div className="bg-card rounded-lg border border-border w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon name="FileText" size={18} className="text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Create Invoice</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="p-6 space-y-6">
            {/* Customer Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">Customer Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Customer Name"
                  type="text"
                  value={formData?.customerName}
                  onChange={(e) => handleInputChange('customerName', e?.target?.value)}
                  error={errors?.customerName}
                  required
                />
                <Input
                  label="Customer Email"
                  type="email"
                  value={formData?.customerEmail}
                  onChange={(e) => handleInputChange('customerEmail', e?.target?.value)}
                  error={errors?.customerEmail}
                  required
                />
              </div>
              <Input
                label="Customer Address"
                type="text"
                value={formData?.customerAddress}
                onChange={(e) => handleInputChange('customerAddress', e?.target?.value)}
                description="Optional billing address"
              />
            </div>

            {/* Invoice Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">Invoice Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Invoice Number"
                  type="text"
                  value={formData?.invoiceNumber}
                  onChange={(e) => handleInputChange('invoiceNumber', e?.target?.value)}
                  required
                />
                <Input
                  label="Due Date"
                  type="date"
                  value={formData?.dueDate}
                  onChange={(e) => handleInputChange('dueDate', e?.target?.value)}
                  error={errors?.dueDate}
                  required
                />
                <Select
                  label="Currency"
                  options={currencyOptions}
                  value={formData?.currency}
                  onChange={(value) => handleInputChange('currency', value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Payment Terms"
                  options={paymentTermsOptions}
                  value={formData?.paymentTerms}
                  onChange={(value) => handleInputChange('paymentTerms', value)}
                />
                <Input
                  label="Tax Rate (%)"
                  type="number"
                  value={formData?.taxRate}
                  onChange={(e) => handleInputChange('taxRate', parseFloat(e?.target?.value) || 0)}
                  min="0"
                  max="100"
                  step="0.01"
                />
              </div>
            </div>

            {/* Line Items */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-foreground">Line Items</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addLineItem}
                  iconName="Plus"
                  iconPosition="left"
                >
                  Add Item
                </Button>
              </div>
              
              {errors?.lineItems && (
                <p className="text-sm text-destructive">{errors?.lineItems}</p>
              )}

              <div className="space-y-3">
                {lineItems?.map((item) => (
                  <div key={item?.id} className="grid grid-cols-12 gap-3 items-end">
                    <div className="col-span-12 md:col-span-5">
                      <Input
                        label="Description"
                        type="text"
                        value={item?.description}
                        onChange={(e) => handleLineItemChange(item?.id, 'description', e?.target?.value)}
                        placeholder="Item description"
                      />
                    </div>
                    <div className="col-span-4 md:col-span-2">
                      <Input
                        label="Quantity"
                        type="number"
                        value={item?.quantity}
                        onChange={(e) => handleLineItemChange(item?.id, 'quantity', parseFloat(e?.target?.value) || 0)}
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="col-span-4 md:col-span-2">
                      <Input
                        label="Rate"
                        type="number"
                        value={item?.rate}
                        onChange={(e) => handleLineItemChange(item?.id, 'rate', parseFloat(e?.target?.value) || 0)}
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="col-span-3 md:col-span-2">
                      <Input
                        label="Amount"
                        type="text"
                        value={item?.amount?.toFixed(2)}
                        disabled
                      />
                    </div>
                    <div className="col-span-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeLineItem(item?.id)}
                        disabled={lineItems?.length === 1}
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="bg-muted/30 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-medium text-foreground">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: formData.currency
                  })?.format(calculateSubtotal())}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax ({formData?.taxRate}%):</span>
                <span className="font-medium text-foreground">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: formData.currency
                  })?.format(calculateTax())}
                </span>
              </div>
              <div className="flex justify-between text-lg font-semibold pt-2 border-t border-border">
                <span className="text-foreground">Total:</span>
                <span className="text-primary">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: formData.currency
                  })?.format(calculateTotal())}
                </span>
              </div>
            </div>

            {/* Recurring Options */}
            <div className="space-y-4">
              <Checkbox
                label="Make this a recurring invoice"
                checked={formData?.isRecurring}
                onChange={(e) => handleInputChange('isRecurring', e?.target?.checked)}
              />
              
              {formData?.isRecurring && (
                <Select
                  label="Recurring Interval"
                  options={recurringIntervalOptions}
                  value={formData?.recurringInterval}
                  onChange={(value) => handleInputChange('recurringInterval', value)}
                />
              )}
            </div>

            {/* Notes */}
            <div>
              <Input
                label="Notes"
                type="text"
                value={formData?.notes}
                onChange={(e) => handleInputChange('notes', e?.target?.value)}
                description="Optional notes for the customer"
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 p-6 border-t border-border bg-muted/30">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="default" className="gradient-primary">
              Create Invoice
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInvoiceModal;