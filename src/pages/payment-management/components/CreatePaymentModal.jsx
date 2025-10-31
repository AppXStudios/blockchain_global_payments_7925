import React, { useState } from 'react';
import { X, Loader2, AlertCircle } from 'lucide-react';
import { bgp } from '@/lib/sdk';

const CreatePaymentModal = ({ isOpen, onClose, onPaymentCreated }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    price_amount: '',
    price_currency: 'USD',
    pay_currency: 'BTC',
    order_id: '',
    order_description: '',
    success_url: '',
    cancel_url: '',
    ipn_callback_url: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e?.target || {};
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData?.price_amount || !formData?.pay_currency) {
        throw new Error('Please fill in all required fields');
      }

      // Convert price_amount to number
      const paymentData = {
        ...formData,
        price_amount: parseFloat(formData?.price_amount)
      };

      // Remove empty fields
      Object.keys(paymentData)?.forEach(key => {
        if (!paymentData?.[key] || paymentData?.[key] === '') {
          delete paymentData?.[key];
        }
      });

      // Create payment using SDK with proper error handling
      const response = await bgp?.payments?.create(paymentData);

      if (response?.success === false) {
        throw new Error(response?.error || 'Failed to create payment');
      }

      // Notify parent component
      onPaymentCreated?.(response?.data || response);

      // Reset form and close modal
      setFormData({
        price_amount: '',
        price_currency: 'USD',
        pay_currency: 'BTC',
        order_id: '',
        order_description: '',
        success_url: '',
        cancel_url: '',
        ipn_callback_url: ''
      });
      onClose?.();

    } catch (error) {
      console.error('Payment creation error:', error);
      setError(error?.message || 'Failed to create payment');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Create New Payment</h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start">
              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          {/* Amount and Currency */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount *
              </label>
              <input
                type="number"
                name="price_amount"
                value={formData?.price_amount || ''}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                required
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Currency
              </label>
              <select
                name="price_currency"
                value={formData?.price_currency || 'USD'}
                onChange={handleInputChange}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="CAD">CAD</option>
                <option value="AUD">AUD</option>
              </select>
            </div>
          </div>

          {/* Pay Currency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pay Currency *
            </label>
            <select
              name="pay_currency"
              value={formData?.pay_currency || 'BTC'}
              onChange={handleInputChange}
              required
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            >
              <option value="BTC">Bitcoin (BTC)</option>
              <option value="ETH">Ethereum (ETH)</option>
              <option value="USDT">Tether (USDT)</option>
              <option value="USDC">USD Coin (USDC)</option>
              <option value="LTC">Litecoin (LTC)</option>
              <option value="XRP">Ripple (XRP)</option>
              <option value="ADA">Cardano (ADA)</option>
              <option value="DOT">Polkadot (DOT)</option>
            </select>
          </div>

          {/* Order Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order ID
              </label>
              <input
                type="text"
                name="order_id"
                value={formData?.order_id || ''}
                onChange={handleInputChange}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                placeholder="Optional order identifier"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <input
                type="text"
                name="order_description"
                value={formData?.order_description || ''}
                onChange={handleInputChange}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                placeholder="Payment description"
              />
            </div>
          </div>

          {/* URLs */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Success URL
              </label>
              <input
                type="url"
                name="success_url"
                value={formData?.success_url || ''}
                onChange={handleInputChange}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                placeholder="https://yoursite.com/success"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cancel URL
              </label>
              <input
                type="url"
                name="cancel_url"
                value={formData?.cancel_url || ''}
                onChange={handleInputChange}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                placeholder="https://yoursite.com/cancel"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                IPN Callback URL
              </label>
              <input
                type="url"
                name="ipn_callback_url"
                value={formData?.ipn_callback_url || ''}
                onChange={handleInputChange}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                placeholder="https://yoursite.com/webhook"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData?.price_amount || !formData?.pay_currency}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {loading ? 'Creating...' : 'Create Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePaymentModal;