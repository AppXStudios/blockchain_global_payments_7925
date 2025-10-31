import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CreditCard, QrCode, CheckCircle, AlertCircle, RefreshCw, Copy, DollarSign } from 'lucide-react';
import PublicHeader from '../../../components/ui/PublicHeader';
import Button from '../../../components/ui/Button';

export default function PayLinkPage() {
  const { linkId } = useParams();
  const [paymentLink, setPaymentLink] = useState(null);
  const [paymentSession, setPaymentSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [initiatingPayment, setInitiatingPayment] = useState(false);

  useEffect(() => {
    fetchPaymentLink();
  }, [linkId]);

  const pollPaymentStatus = async () => {
    if (!paymentSession || paymentStatus === 'completed' || paymentStatus === 'failed') return;

    try {
      const response = await fetch(`/api/checkout/${paymentSession?.session_id}/status`);
      if (response?.ok) {
        const data = await response?.json();
        setPaymentStatus(data?.status);
      }
    } catch (err) {
      console.error('Failed to poll payment status:', err);
    }
  };

  useEffect(() => {
    if (paymentSession) {
      const statusInterval = setInterval(pollPaymentStatus, 3000);
      return () => clearInterval(statusInterval);
    }
  }, [paymentSession]);

  const fetchPaymentLink = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/links/${linkId}`);
      
      if (!response?.ok) {
        throw new Error('Payment link not found or expired');
      }

      const data = await response?.json();
      
      if (data?.status === 'inactive' || data?.status === 'expired') {
        throw new Error('This payment link is no longer active');
      }

      setPaymentLink(data);
    } catch (err) {
      setError(err?.message);
    } finally {
      setLoading(false);
    }
  };

  const initiatePayment = async () => {
    try {
      setInitiatingPayment(true);
      const response = await fetch(`/api/links/${linkId}/pay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response?.ok) {
        throw new Error('Failed to initiate payment');
      }

      const session = await response?.json();
      setPaymentSession(session);
      setPaymentStatus('awaiting_payment');
    } catch (err) {
      alert(err?.message);
    } finally {
      setInitiatingPayment(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard?.writeText(text);
      alert('Copied to clipboard!');
    } catch (err) {
      alert('Failed to copy to clipboard');
    }
  };

  const generateQRCode = (address) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(address)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PublicHeader />
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading payment link...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PublicHeader />
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Link Unavailable</h2>
            <p className="text-gray-600 mb-6">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'completed') {
    return (
      <div className="min-h-screen bg-gray-50">
        <PublicHeader />
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-6">
              Your payment of {paymentLink?.amount} {paymentLink?.currency} has been confirmed.
            </p>
            <p className="text-sm text-gray-500">Thank you for your payment!</p>
          </div>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'failed') {
    return (
      <div className="min-h-screen bg-gray-50">
        <PublicHeader />
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h2>
            <p className="text-gray-600 mb-6">
              There was an issue processing your payment. Please try again.
            </p>
            <Button onClick={() => {
              setPaymentSession(null);
              setPaymentStatus('pending');
            }}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show payment instructions if session is active
  if (paymentSession && paymentStatus === 'awaiting_payment') {
    return (
      <div className="min-h-screen bg-gray-50">
        <PublicHeader />
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{paymentLink?.title || 'Payment'}</h1>
              {paymentLink?.description && (
                <p className="text-gray-600">{paymentLink?.description}</p>
              )}
            </div>

            <div className="p-6">
              <div className="text-center mb-6">
                <p className="text-3xl font-bold text-gray-900 mb-2">
                  {paymentLink?.amount} {paymentLink?.currency?.toUpperCase()}
                </p>
              </div>

              {/* Payment Instructions */}
              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Payment Instructions
                </h3>
                
                {paymentSession?.pay_address && (
                  <div className="mb-4">
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Send to this address:
                    </label>
                    <div className="flex items-center space-x-2 p-3 bg-white rounded border">
                      <code className="text-sm font-mono flex-1 break-all">
                        {paymentSession?.pay_address}
                      </code>
                      <Button 
                        onClick={() => copyToClipboard(paymentSession?.pay_address)}
                        variant="outline" 
                        size="sm"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {paymentSession?.pay_amount && (
                  <div className="mb-4">
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Exact amount:
                    </label>
                    <div className="flex items-center space-x-2 p-3 bg-white rounded border">
                      <code className="text-lg font-mono font-bold flex-1">
                        {paymentSession?.pay_amount} {paymentSession?.pay_currency?.toUpperCase()}
                      </code>
                      <Button 
                        onClick={() => copyToClipboard(paymentSession?.pay_amount)}
                        variant="outline" 
                        size="sm"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* QR Code */}
              {paymentSession?.pay_address && (
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-center">
                    <QrCode className="w-5 h-5 mr-2" />
                    Scan to Pay
                  </h3>
                  <div className="inline-block p-4 bg-white border rounded-lg">
                    <img 
                      src={generateQRCode(paymentSession?.pay_address)} 
                      alt="Payment Address QR Code" 
                      className="mx-auto"
                    />
                  </div>
                </div>
              )}

              {/* Status */}
              <div className="flex items-center justify-center space-x-2 text-yellow-600">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Waiting for payment confirmation...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show payment initiation page
  return (
    <div className="min-h-screen bg-gray-50">
      <PublicHeader />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{paymentLink?.title || 'Payment Request'}</h1>
            {paymentLink?.description && (
              <p className="text-gray-600">{paymentLink?.description}</p>
            )}
          </div>

          <div className="p-6 text-center">
            <div className="mb-6">
              <DollarSign className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <p className="text-4xl font-bold text-gray-900 mb-2">
                {paymentLink?.amount} {paymentLink?.currency?.toUpperCase()}
              </p>
              <p className="text-gray-600">Amount to pay</p>
            </div>

            <Button 
              onClick={initiatePayment}
              disabled={initiatingPayment}
              size="lg"
              className="w-full mb-6"
            >
              {initiatingPayment ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Preparing Payment...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pay Now
                </>
              )}
            </Button>

            <div className="text-sm text-gray-500 space-y-1">
              <p>• Secure cryptocurrency payment processing</p>
              <p>• Payment confirmation typically takes 2-10 minutes</p>
              <p>• You will be redirected after successful payment</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}