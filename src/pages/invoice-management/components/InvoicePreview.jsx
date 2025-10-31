import React from 'react';

import { formatCurrency } from '../../../lib/utils/formatCurrency';

const InvoicePreview = ({ invoice }) => {
  const calculateTotal = () => {
    return invoice?.items?.reduce((total, item) => total + (item?.quantity * item?.price), 0) || 0;
  };

  const calculateTax = () => {
    const subtotal = calculateTotal();
    return subtotal * (invoice?.taxRate || 0) / 100;
  };

  const calculateGrandTotal = () => {
    return calculateTotal() + calculateTax();
  };

  // ✅ Apply failsafe patch - convert to uppercase and fallback to USD
  const safeCurrency = (invoice?.currency || "USD")?.toUpperCase();

  return (
    <div className="bg-white p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">INVOICE</h1>
          <div className="text-sm text-gray-600">
            <p>Invoice #{invoice?.number || 'INV-001'}</p>
            <p>Date: {invoice?.date ? new Date(invoice?.date)?.toLocaleDateString() : new Date()?.toLocaleDateString()}</p>
            <p>Due: {invoice?.dueDate ? new Date(invoice?.dueDate)?.toLocaleDateString() : 'Upon receipt'}</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{invoice?.merchantName || 'Your Business'}</h2>
          <div className="text-sm text-gray-600">
            <p>{invoice?.merchantAddress || '123 Business St.'}</p>
            <p>{invoice?.merchantCity || 'City'}, {invoice?.merchantState || 'State'} {invoice?.merchantZip || '12345'}</p>
            <p>{invoice?.merchantEmail || 'business@example.com'}</p>
          </div>
        </div>
      </div>

      {/* Bill To */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Bill To:</h3>
        <div className="text-sm text-gray-600">
          <p className="font-medium">{invoice?.clientName || 'Client Name'}</p>
          <p>{invoice?.clientEmail || 'client@example.com'}</p>
          <p>{invoice?.clientAddress || 'Client Address'}</p>
        </div>
      </div>

      {/* Items */}
      <div className="mb-8">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-3 text-gray-700 font-semibold">Description</th>
              <th className="text-center py-3 text-gray-700 font-semibold">Qty</th>
              <th className="text-right py-3 text-gray-700 font-semibold">Price</th>
              <th className="text-right py-3 text-gray-700 font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody>
            {(invoice?.items || [{ description: 'Service/Product', quantity: 1, price: 0 }])?.map((item, index) => (
              <tr key={index} className="border-b border-gray-100">
                <td className="py-3 text-gray-900">{item?.description}</td>
                <td className="py-3 text-center text-gray-900">{item?.quantity}</td>
                <td className="py-3 text-right text-gray-900">{formatCurrency(item?.price, safeCurrency)}</td>
                <td className="py-3 text-right text-gray-900">
                  {formatCurrency(item?.quantity * item?.price, safeCurrency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-64">
          <div className="flex justify-between py-2">
            <span className="text-gray-700">Subtotal:</span>
            <span className="text-gray-900 font-medium">{formatCurrency(calculateTotal(), safeCurrency)}</span>
          </div>
          {invoice?.taxRate > 0 && (
            <div className="flex justify-between py-2">
              <span className="text-gray-700">Tax ({invoice?.taxRate}%):</span>
              <span className="text-gray-900 font-medium">{formatCurrency(calculateTax(), safeCurrency)}</span>
            </div>
          )}
          <div className="flex justify-between py-3 border-t border-gray-200 font-bold text-lg">
            <span className="text-gray-900">Total:</span>
            <span className="text-gray-900">{formatCurrency(calculateGrandTotal(), safeCurrency)}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {invoice?.notes && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Notes:</h3>
          <p className="text-sm text-gray-600">{invoice?.notes}</p>
        </div>
      )}

      {/* Payment Info */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Information</h3>
        <div className="text-sm text-gray-600">
          <p>Please make payment within the specified due date.</p>
          <p>Payment methods: Cryptocurrency (BTC, ETH, USDT)</p>
          <p>For questions, contact: {invoice?.merchantEmail || 'support@example.com'}</p>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;