import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Copy, QrCode, ExternalLink, CheckCircle, AlertCircle, Shield, Smartphone } from 'lucide-react';
import Button from '../../components/ui/Button';
import PublicHeader from '../../components/ui/PublicHeader';

export default function PaymentLinkCheckout() {
  const { linkId } = useParams();
  const navigate = useNavigate();
  
  const [paymentLink, setPaymentLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [copySuccess, setCopySuccess] = useState(false);
  const [showMobileWallets, setShowMobileWallets] = useState(false);

  // Mobile wallet apps for deep linking
  const mobileWallets = [
    { name: 'Trust Wallet', scheme: 'trust://', icon: '🔵' },
    { name: 'MetaMask', scheme: 'metamask://', icon: '🦊' },
    { name: 'Coinbase Wallet', scheme: 'cbwallet://', icon: '🔷' },
    { name: 'Exodus', scheme: 'exodus://', icon: '⭐' },
    { name: 'Atomic Wallet', scheme: 'atomic://', icon: '⚛️' },
  ];

  // Load payment link data on mount
  useEffect(() => {
    const loadPaymentLink = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/links/${linkId}`);
        
        if (!response?.ok) {
          throw new Error('Payment link not found');
        }
        
        const linkData = await response?.json();
        setPaymentLink(linkData);
      } catch (err) {
        setError(err?.message);
      } finally {
        setLoading(false);
      }
    };

    if (linkId) {
      loadPaymentLink();
    }
  }, [linkId]);

  // Poll payment status for completion
  useEffect(() => {
    if (!paymentLink || paymentStatus === 'completed') return;

    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/links/${linkId}/status`);
        if (response?.ok) {
          const statusData = await response?.json();
          
          if (statusData?.payment_completed) {
            setPaymentStatus('completed');
            
            // Play success sound if available
            if (typeof Audio !== 'undefined') {
              try {
                const audio = new Audio('/assets/sounds/payment-success.mp3');
                audio?.play()?.catch(() => {}); // Ignore audio errors
              } catch {}
            }
          }
        }
      } catch (err) {
        console.error('Status polling error:', err);
      }
    }, 5000); // Poll every 5 seconds for payment links

    return () => clearInterval(pollInterval);
  }, [linkId, paymentLink, paymentStatus]);

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

  const handleMobileWalletOpen = (wallet) => {
    const address = paymentLink?.deposit_address;
    const amount = paymentLink?.amount;
    const currency = paymentLink?.currency;
    
    if (address && amount) {
      // Create payment URL for the wallet
      const paymentUrl = `${wallet?.scheme}send?address=${address}&amount=${amount}&currency=${currency}`;
      
      // Try to open in mobile wallet
      window.location.href = paymentUrl;
      
      // Fallback: if the app doesn't open, show instructions
      setTimeout(() => {
        alert(`If ${wallet?.name} didn't open automatically, please copy the address manually and send ${amount} ${currency?.toUpperCase()}`);
      }, 2000);
    }
  };

  const generatePaymentUrl = () => {
    if (!paymentLink?.deposit_address || !paymentLink?.amount) return '#';
    
    return `bitcoin:${paymentLink?.deposit_address}?amount=${paymentLink?.amount}&label=${encodeURIComponent(paymentLink?.title || 'Payment')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <PublicHeader />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading payment link...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <PublicHeader />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center bg-red-500/20 border border-red-500/30 rounded-lg p-8 max-w-md">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Payment Link Not Found</h2>
            <p className="text-red-200 mb-4">{error}</p>
            <Button onClick={() => navigate('/')} variant="outline">
              Return Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Payment completion screen
  if (paymentStatus === 'completed') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-700 via-blue-800 to-purple-900">
        <PublicHeader />
        <div className="flex items-center justify-center min-h-[80vh] px-4">
          <div className="text-center bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 max-w-md w-full">
            <div className="mb-6">
              <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-4 animate-pulse" />
              <h1 className="text-3xl font-bold text-white mb-2">Payment Complete!</h1>
              <p className="text-gray-200">Thank you for your payment</p>
            </div>

            <div className="bg-black/20 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300">Amount Paid:</span>
                <span className="text-white font-bold text-lg">
                  {paymentLink?.amount} {paymentLink?.currency?.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Payment Link:</span>
                <span className="text-white text-sm">
                  {paymentLink?.title || 'Cryptocurrency Payment'}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {paymentLink?.success_url && (
                <Button 
                  onClick={() => window.location.href = paymentLink?.success_url} 
                  variant="primary" 
                  className="w-full"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Continue
                </Button>
              )}
              <Button onClick={() => navigate('/')} variant="outline" className="w-full">
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <PublicHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Payment Link Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              {paymentLink?.title || 'Cryptocurrency Payment'}
            </h1>
            <p className="text-gray-300">
              {paymentLink?.description || 'Complete your payment using cryptocurrency'}
            </p>
            
            {/* Trust signals */}
            <div className="flex items-center justify-center space-x-6 mt-4">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-400" />
                <span className="text-sm text-green-300">Secure Payment</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-blue-400" />
                <span className="text-sm text-blue-300">Verified Merchant</span>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Payment Information */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">Payment Details</h2>

              <div className="space-y-4 mb-6">
                <div className="text-center p-6 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg border border-purple-300/30">
                  <div className="text-4xl font-bold text-white mb-2">
                    {paymentLink?.amount} {paymentLink?.currency?.toUpperCase()}
                  </div>
                  <p className="text-gray-300">Amount to Pay</p>
                </div>

                {paymentLink?.deposit_address && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Payment Address
                    </label>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-black/20 rounded-lg p-3">
                        <p className="text-white font-mono text-sm break-all">
                          {paymentLink?.deposit_address}
                        </p>
                      </div>
                      <Button
                        onClick={() => copyToClipboard(paymentLink?.deposit_address)}
                        variant="outline"
                        size="sm"
                        className="flex-shrink-0"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    {copySuccess && (
                      <p className="text-green-400 text-sm mt-2">Address copied!</p>
                    )}
                  </div>
                )}
              </div>

              {/* Payment Statistics */}
              {paymentLink?.payment_count && (
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-blue-200">Total Payments:</span>
                    <span className="text-blue-100 font-bold">{paymentLink?.payment_count}</span>
                  </div>
                  {paymentLink?.total_received && (
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-blue-200">Total Received:</span>
                      <span className="text-blue-100 font-bold">
                        {paymentLink?.total_received} {paymentLink?.currency?.toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* QR Code & Mobile Actions */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">Quick Payment</h2>
              
              {/* QR Code */}
              <div className="text-center mb-6">
                <div className="bg-white p-6 rounded-xl inline-block mb-4">
                  {paymentLink?.deposit_address ? (
                    <QrCode className="w-40 h-40 mx-auto text-black" />
                  ) : (
                    <div className="w-40 h-40 bg-gray-200 rounded-lg flex items-center justify-center">
                      <QrCode className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>
                <p className="text-gray-300 text-sm mb-4">
                  Scan with your mobile wallet
                </p>
                
                {/* Copy Payment Link */}
                <Button
                  onClick={() => copyToClipboard(window.location?.href)}
                  variant="outline"
                  className="w-full mb-4"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Payment Link
                </Button>
              </div>

              {/* Pay Now Button */}
              <div className="space-y-4">
                <a
                  href={generatePaymentUrl()}
                  className="block"
                  onClick={(e) => {
                    // For mobile devices, show wallet options
                    if (window.innerWidth <= 768) {
                      e?.preventDefault();
                      setShowMobileWallets(!showMobileWallets);
                    }
                  }}
                >
                  <Button variant="primary" className="w-full text-lg py-4">
                    <Smartphone className="w-5 h-5 mr-2" />
                    Pay Now
                  </Button>
                </a>

                {/* Mobile Wallet Options */}
                {showMobileWallets && (
                  <div className="bg-black/20 rounded-lg p-4">
                    <h3 className="text-white font-medium mb-3">Choose Wallet:</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {mobileWallets?.map((wallet) => (
                        <button
                          key={wallet?.name}
                          onClick={() => handleMobileWalletOpen(wallet)}
                          className="flex items-center space-x-2 p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                        >
                          <span className="text-lg">{wallet?.icon}</span>
                          <span className="text-white text-sm">{wallet?.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Manual Instructions */}
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <h3 className="text-yellow-200 font-medium mb-2">Manual Payment:</h3>
                  <ol className="text-yellow-100 text-sm space-y-1">
                    <li>1. Open your cryptocurrency wallet</li>
                    <li>2. Send exactly {paymentLink?.amount} {paymentLink?.currency?.toUpperCase()}</li>
                    <li>3. To the address shown above</li>
                    <li>4. Wait for confirmation (usually 10-30 minutes)</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          {/* Support Information */}
          <div className="text-center mt-8">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
              <h3 className="text-lg font-medium text-white mb-2">Payment Support</h3>
              <p className="text-gray-300 mb-4">
                Need assistance with your payment? Our support team is available 24/7.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="outline" onClick={() => navigate('/support')}>
                  Get Help
                </Button>
                <Button variant="outline" onClick={() => navigate('/contact')}>
                  Contact Us
                </Button>
              </div>
              
              {/* Contact Info */}
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-gray-400 text-sm">
                  For urgent issues, email: support@blockchainpayments.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}