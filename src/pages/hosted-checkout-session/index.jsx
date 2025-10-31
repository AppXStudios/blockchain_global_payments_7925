import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Copy, QrCode, Clock, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import Button from '../../components/ui/Button';
import PublicHeader from '../../components/ui/PublicHeader';

export default function HostedCheckoutSession() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);

  // Load session data on mount
  useEffect(() => {
    const loadSession = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/checkout/${sessionId}`);
        
        if (!response?.ok) {
          throw new Error('Session not found');
        }
        
        const sessionData = await response?.json();
        setSession(sessionData);
        setPaymentStatus(sessionData?.payment_status || 'pending');
        
        // Calculate time remaining if expiration exists
        if (sessionData?.expires_at) {
          const expiresAt = new Date(sessionData.expires_at);
          const now = new Date();
          const diff = expiresAt - now;
          
          if (diff > 0) {
            setTimeRemaining(Math.floor(diff / 1000));
          }
        }
      } catch (err) {
        setError(err?.message);
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      loadSession();
    }
  }, [sessionId]);

  // Poll payment status every 3 seconds
  useEffect(() => {
    if (!session || paymentStatus === 'completed' || paymentStatus === 'expired') {
      return;
    }

    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/checkout/${sessionId}/status`);
        if (response?.ok) {
          const statusData = await response?.json();
          setPaymentStatus(statusData?.payment_status || 'pending');
          
          if (statusData?.payment_status === 'completed') {
            // Play success sound if available
            if (typeof Audio !== 'undefined') {
              try {
                const audio = new Audio('/assets/sounds/success.mp3');
                audio?.play()?.catch(() => {}); // Ignore audio errors
              } catch {}
            }
          }
        }
      } catch (err) {
        console.error('Status polling error:', err);
      }
    }, 3000);

    return () => clearInterval(pollInterval);
  }, [sessionId, session, paymentStatus]);

  // Countdown timer
  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setPaymentStatus('expired');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard?.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body?.appendChild(textArea);
      textArea?.select();
      document.execCommand('copy');
      document.body?.removeChild(textArea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds?.toString()?.padStart(2, '0')}`;
  };

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'expired':
        return <AlertCircle className="w-6 h-6 text-red-500" />;
      case 'confirming':
        return <Clock className="w-6 h-6 text-yellow-500 animate-pulse" />;
      default:
        return <Clock className="w-6 h-6 text-blue-500" />;
    }
  };

  const getStatusMessage = () => {
    switch (paymentStatus) {
      case 'completed':
        return 'Payment Successfully Completed!';
      case 'expired':
        return 'Payment Session Expired';
      case 'confirming':
        return 'Confirming Payment...';
      default:
        return 'Waiting for Payment';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <PublicHeader />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading checkout session...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <PublicHeader />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center bg-red-500/20 border border-red-500/30 rounded-lg p-8 max-w-md">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Session Not Found</h2>
            <p className="text-red-200 mb-4">{error}</p>
            <Button onClick={() => navigate('/')} variant="outline">
              Return Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Success screen
  if (paymentStatus === 'completed') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-700 via-blue-800 to-purple-900">
        <PublicHeader />
        <div className="flex items-center justify-center min-h-[80vh] px-4">
          <div className="text-center bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 max-w-md w-full">
            <div className="mb-6">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-white mb-2">Payment Successful!</h1>
              <p className="text-gray-200">Your payment has been confirmed</p>
            </div>

            <div className="bg-black/20 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300">Amount:</span>
                <span className="text-white font-bold">
                  {session?.price_amount} {session?.price_currency?.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Transaction ID:</span>
                <span className="text-white text-sm font-mono">
                  {sessionId}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {session?.redirect_url && (
                <Button 
                  onClick={() => window.location.href = session?.redirect_url} 
                  variant="primary" 
                  className="w-full"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Continue to {session?.merchant_name || 'Merchant'}
                </Button>
              )}
              <Button onClick={() => navigate('/')} variant="outline" className="w-full">
                Return Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <PublicHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Payment Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              {session?.merchant_name || 'Secure Checkout'}
            </h1>
            <p className="text-gray-300">{session?.description || 'Complete your payment below'}</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Payment Details */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Payment Details</h2>
                <div className="flex items-center space-x-2">
                  {getStatusIcon()}
                  <span className="text-white font-medium">{getStatusMessage()}</span>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-gray-300">Amount:</span>
                  <span className="text-white text-xl font-bold">
                    {session?.price_amount} {session?.price_currency?.toUpperCase()}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-gray-300">Network:</span>
                  <span className="text-white">{session?.pay_currency?.toUpperCase() || 'BTC'}</span>
                </div>

                {timeRemaining && timeRemaining > 0 && (
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-gray-300">Time Remaining:</span>
                    <span className="text-yellow-400 font-mono text-lg">
                      {formatTime(timeRemaining)}
                    </span>
                  </div>
                )}
              </div>

              {session?.pay_address && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Deposit Address
                  </label>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-black/20 rounded-lg p-3">
                      <p className="text-white font-mono text-sm break-all">
                        {session?.pay_address}
                      </p>
                    </div>
                    <Button
                      onClick={() => copyToClipboard(session?.pay_address)}
                      variant="outline"
                      size="sm"
                      className="flex-shrink-0"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  {copySuccess && (
                    <p className="text-green-400 text-sm mt-2">Address copied to clipboard!</p>
                  )}
                </div>
              )}

              {/* Network Fee Information */}
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-4">
                <p className="text-yellow-200 text-sm">
                  <strong>Important:</strong> Please send the exact amount. Network fees are typically deducted by your wallet.
                </p>
              </div>
            </div>

            {/* QR Code & Instructions */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">Payment Instructions</h2>
              
              {/* QR Code */}
              <div className="text-center mb-6">
                <div className="bg-white p-4 rounded-lg inline-block mb-4">
                  {session?.pay_address ? (
                    <QrCode className="w-48 h-48 mx-auto text-black" />
                  ) : (
                    <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                      <QrCode className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>
                <p className="text-gray-300 text-sm">
                  Scan with your mobile wallet to pay
                </p>
              </div>

              {/* Payment Steps */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <p className="text-white font-medium">Open your wallet</p>
                    <p className="text-gray-300 text-sm">Use any {session?.pay_currency?.toUpperCase()} compatible wallet</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <p className="text-white font-medium">Scan QR code or copy address</p>
                    <p className="text-gray-300 text-sm">Send exactly {session?.pay_amount} {session?.pay_currency?.toUpperCase()}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <p className="text-white font-medium">Wait for confirmation</p>
                    <p className="text-gray-300 text-sm">Payment will be confirmed automatically</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Support Section */}
          <div className="text-center mt-8">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
              <h3 className="text-lg font-medium text-white mb-2">Need Help?</h3>
              <p className="text-gray-300 mb-4">
                If you're experiencing issues with your payment, our support team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="outline" onClick={() => navigate('/support')}>
                  Contact Support
                </Button>
                <Button variant="outline" onClick={() => navigate('/docs')}>
                  View FAQ
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}