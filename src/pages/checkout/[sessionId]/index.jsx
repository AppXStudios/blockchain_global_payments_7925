import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CreditCard, QrCode, Clock, CheckCircle, AlertCircle, RefreshCw, Copy } from 'lucide-react';
import CheckoutNavigation from '../../../components/ui/CheckoutNavigation';
import Button from '../../../components/ui/Button';

export default function CheckoutSessionPage() {
  const { sessionId } = useParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [timeRemaining, setTimeRemaining] = useState(null);

  const fetchSessionDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/checkout/${sessionId}`);
      
      if (!response?.ok) {
        throw new Error('Session not found or expired');
      }

      const data = await response?.json();
      setSession(data);
      setPaymentStatus(data?.status || 'pending');
    } catch (err) {
      setError(err?.message);
    } finally {
      setLoading(false);
    }
  };

  const pollPaymentStatus = async () => {
    if (paymentStatus === 'completed' || paymentStatus === 'failed') return;

    try {
      const response = await fetch(`/api/checkout/${sessionId}/status`);
      if (response?.ok) {
        const data = await response?.json();
        setPaymentStatus(data?.status);
        if (data?.status === 'completed' || data?.status === 'failed') {
          setSession(prev => ({ ...prev, ...data }));
        }
      }
    } catch (err) {
      console.error('Failed to poll payment status:', err);
    }
  };

  const updateTimer = () => {
    if (!session?.expires_at) return;

    const expiryTime = new Date(session.expires_at)?.getTime();
    const now = new Date()?.getTime();
    const remaining = expiryTime - now;

    if (remaining <= 0) {
      setTimeRemaining(null);
      setPaymentStatus('expired');
    } else {
      setTimeRemaining(remaining);
    }
  };

  useEffect(() => {
    fetchSessionDetails();
    const statusInterval = setInterval(pollPaymentStatus, 3000);
    const timerInterval = setInterval(updateTimer, 1000);
    
    return () => {
      clearInterval(statusInterval);
      clearInterval(timerInterval);
    };
  }, [sessionId]);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard?.writeText(text);
      alert('Copied to clipboard!');
    } catch (err) {
      alert('Failed to copy to clipboard');
    }
  };

  const formatTime = (milliseconds) => {
    if (!milliseconds) return null;
    
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds?.toString()?.padStart(2, '0')}`;
  };

  const generateQRCode = (address) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(address)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <CheckoutNavigation />
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading payment session...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <CheckoutNavigation />
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Session Not Found</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={() => window.location?.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'completed') {
    return (
      <div className="min-h-screen bg-gray-50">
        <CheckoutNavigation />
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-6">
              Your payment of {session?.amount} {session?.currency} has been confirmed.
            </p>
            {session?.redirect_url ? (
              <Button onClick={() => window.location.href = session?.redirect_url}>
                Continue
              </Button>
            ) : (
              <p className="text-sm text-gray-500">You may close this window.</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'failed') {
    return (
      <div className="min-h-screen bg-gray-50">
        <CheckoutNavigation />
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h2>
            <p className="text-gray-600 mb-6">
              There was an issue processing your payment. Please try again.
            </p>
            <Button onClick={fetchSessionDetails}>
              Retry Payment
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'expired') {
    return (
      <div className="min-h-screen bg-gray-50">
        <CheckoutNavigation />
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <Clock className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Session Expired</h2>
            <p className="text-gray-600 mb-6">
              This payment session has expired. Please request a new payment link.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CheckoutNavigation />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Timer */}
        {timeRemaining && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-center">
            <Clock className="w-5 h-5 text-yellow-600 mx-auto mb-2" />
            <p className="text-yellow-800">
              Time remaining: <span className="font-bold">{formatTime(timeRemaining)}</span>
            </p>
          </div>
        )}

        {/* Payment Details */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Payment</h1>
            <p className="text-gray-600">
              {session?.description || 'Please complete your payment to continue'}
            </p>
          </div>

          <div className="p-6">
            <div className="text-center mb-6">
              <p className="text-3xl font-bold text-gray-900 mb-2">
                {session?.amount} {session?.currency?.toUpperCase()}
              </p>
              <p className="text-gray-500">Amount to pay</p>
            </div>

            {/* Payment Instructions */}
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Payment Instructions
              </h3>
              
              {session?.pay_address && (
                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Send {session?.pay_currency || session?.currency} to this address:
                  </label>
                  <div className="flex items-center space-x-2 p-3 bg-white rounded border">
                    <code className="text-sm font-mono flex-1 break-all">
                      {session?.pay_address}
                    </code>
                    <Button 
                      onClick={() => copyToClipboard(session?.pay_address)}
                      variant="outline" 
                      size="sm"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {session?.pay_amount && (
                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Exact amount to send:
                  </label>
                  <div className="flex items-center space-x-2 p-3 bg-white rounded border">
                    <code className="text-lg font-mono font-bold flex-1">
                      {session?.pay_amount} {session?.pay_currency?.toUpperCase()}
                    </code>
                    <Button 
                      onClick={() => copyToClipboard(session?.pay_amount)}
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
            {session?.pay_address && (
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-center">
                  <QrCode className="w-5 h-5 mr-2" />
                  Or scan QR code
                </h3>
                <div className="inline-block p-4 bg-white border rounded-lg">
                  <img 
                    src={generateQRCode(session?.pay_address)} 
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

        {/* Help Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Make sure to send the exact amount shown above</li>
            <li>• Payment confirmation may take a few minutes</li>
            <li>• Do not close this page until payment is confirmed</li>
            <li>• Contact support if you encounter any issues</li>
          </ul>
        </div>
      </div>
    </div>
  );
}