"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PaymentStatus = ({ 
  paymentId,
  status = 'pending',
  amount,
  currency,
  cryptoAmount,
  cryptoCurrency,
  onStatusChange,
  successUrl,
  cancelUrl
}) => {
  const navigate = useNavigate();
  const params = useParams();
  const [currentStatus, setCurrentStatus] = useState(status);
  const [timeRemaining, setTimeRemaining] = useState(900); // 15 minutes in seconds

  // Auto-redirect when payment is finished
  useEffect(() => {
    if (currentStatus === 'completed') {
      // Auto-redirect after successful payment
      const timer = setTimeout(() => {
        if (successUrl) {
          navigate(successUrl);
        } else {
          navigate(`/hosted-checkout/${paymentId || params?.paymentId}/success`);
        }
      }, 3000); // Wait 3 seconds before redirect

      return () => clearTimeout(timer);
    }
  }, [currentStatus, navigate, paymentId, params?.paymentId, successUrl]);

  // Countdown timer for payment expiration
  useEffect(() => {
    if (currentStatus === 'pending' && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setCurrentStatus('expired');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentStatus, timeRemaining]);

  // Mock status changes for demo
  useEffect(() => {
    const statusProgressDemo = () => {
      if (currentStatus === 'pending') {
        // Simulate payment confirmation after some time
        const timer = setTimeout(() => {
          setCurrentStatus('confirming');
          if (onStatusChange) onStatusChange('confirming');
        }, 10000); // 10 seconds

        return () => clearTimeout(timer);
      } else if (currentStatus === 'confirming') {
        const timer = setTimeout(() => {
          setCurrentStatus('completed');
          if (onStatusChange) onStatusChange('completed');
        }, 5000); // 5 seconds

        return () => clearTimeout(timer);
      }
    };

    return statusProgressDemo();
  }, [currentStatus, onStatusChange]);

  const getStatusConfig = (status) => {
    switch (status) {
      case 'pending':
        return {
          icon: 'Clock',
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          title: 'Payment Pending',
          description: 'Waiting for payment confirmation on the blockchain'
        };
      case 'confirming':
        return {
          icon: 'Loader',
          color: 'text-primary',
          bgColor: 'bg-primary/10',
          title: 'Confirming Payment',
          description: 'Your payment is being confirmed on the blockchain'
        };
      case 'completed':
        return {
          icon: 'CheckCircle',
          color: 'text-success',
          bgColor: 'bg-success/10',
          title: 'Payment Successful',
          description: 'Your payment has been successfully processed'
        };
      case 'failed':
        return {
          icon: 'XCircle',
          color: 'text-destructive',
          bgColor: 'bg-destructive/10',
          title: 'Payment Failed',
          description: 'Your payment could not be processed'
        };
      case 'expired':
        return {
          icon: 'AlertCircle',
          color: 'text-destructive',
          bgColor: 'bg-destructive/10',
          title: 'Payment Expired',
          description: 'The payment session has expired'
        };
      default:
        return {
          icon: 'Circle',
          color: 'text-muted-foreground',
          bgColor: 'bg-muted/10',
          title: 'Unknown Status',
          description: 'Payment status is unknown'
        };
    }
  };

  const statusConfig = getStatusConfig(currentStatus);

  const handleReturnToMerchant = () => {
    if (successUrl) {
      navigate(successUrl);
    } else {
      // Fallback to home page if no success URL
      navigate('/');
    }
  };

  const handleTryAgain = () => {
    // Reset payment status and restart process
    setCurrentStatus('pending');
    setTimeRemaining(900);
    if (onStatusChange) onStatusChange('pending');
  };

  const handleCancel = () => {
    if (cancelUrl) {
      navigate(cancelUrl);
    } else {
      navigate('/');
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds?.toString()?.padStart(2, '0')}`;
  };

  const formatAmount = (amount, currency) => {
    if (currency === 'USD' || currency === 'EUR' || currency === 'GBP') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
      })?.format(amount);
    }
    return `${amount} ${currency}`;
  };

  return (
    <div className="max-w-md mx-auto">
      {/* Status Icon and Title */}
      <div className="text-center mb-8">
        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${statusConfig?.bgColor} mb-4`}>
          <Icon 
            name={statusConfig?.icon} 
            size={40} 
            className={`${statusConfig?.color} ${currentStatus === 'confirming' ? 'animate-spin' : ''}`} 
          />
        </div>
        
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {statusConfig?.title}
        </h2>
        
        <p className="text-muted-foreground">
          {statusConfig?.description}
        </p>
      </div>

      {/* Payment Amount */}
      <div className="bg-muted/50 rounded-lg p-4 mb-6 text-center">
        <div className="text-3xl font-bold text-foreground mb-1">
          {formatAmount(amount, currency)}
        </div>
        {cryptoAmount && cryptoCurrency && (
          <div className="text-sm text-muted-foreground">
            ≈ {cryptoAmount} {cryptoCurrency}
          </div>
        )}
      </div>

      {/* Timer for pending payments */}
      {currentStatus === 'pending' && timeRemaining > 0 && (
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="Clock" size={16} className="text-warning" />
              <span className="text-sm font-medium text-foreground">Time remaining</span>
            </div>
            <span className="text-lg font-mono font-bold text-warning">
              {formatTime(timeRemaining)}
            </span>
          </div>
        </div>
      )}

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {['pending', 'confirming', 'completed']?.map((step, index) => {
            const isActive = step === currentStatus;
            const isCompleted = ['confirming', 'completed']?.includes(currentStatus) && 
                               ['pending', 'confirming']?.includes(step);
            const isPast = currentStatus === 'completed' && step !== 'completed';
            
            return (
              <div key={step} className="flex items-center">
                <div 
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                    ${isCompleted || isPast
                      ? 'bg-success text-success-foreground' 
                      : isActive 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                    }
                  `}
                >
                  {isCompleted || isPast ? (
                    <Icon name="Check" size={16} />
                  ) : (
                    index + 1
                  )}
                </div>
                
                {index < 2 && (
                  <div 
                    className={`
                      w-16 h-0.5 mx-2
                      ${isCompleted || (isPast && index === 0) ? 'bg-success' : 'bg-muted'}
                    `}
                  />
                )}
              </div>
            );
          })}
        </div>
        
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Initiated</span>
          <span>Confirming</span>
          <span>Completed</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {currentStatus === 'completed' && (
          <Button
            variant="default"
            size="lg"
            fullWidth
            onClick={handleReturnToMerchant}
            className="gradient-primary"
            iconName="ArrowRight"
            iconPosition="right"
          >
            Return to Merchant
          </Button>
        )}
        
        {(currentStatus === 'failed' || currentStatus === 'expired') && (
          <>
            <Button
              variant="default"
              size="lg"
              fullWidth
              onClick={handleTryAgain}
              className="gradient-primary"
              iconName="RefreshCw"
              iconPosition="left"
            >
              Try Again
            </Button>
            <Button
              variant="outline"
              size="lg"
              fullWidth
              onClick={handleCancel}
            >
              Cancel Payment
            </Button>
          </>
        )}
        
        {currentStatus === 'pending' && (
          <Button
            variant="outline"
            size="lg"
            fullWidth
            onClick={handleCancel}
          >
            Cancel Payment
          </Button>
        )}
      </div>

      {/* Auto-redirect notice for completed payments */}
      {currentStatus === 'completed' && (
        <div className="mt-4 text-center text-sm text-muted-foreground">
          You will be redirected automatically in a few seconds...
        </div>
      )}
    </div>
  );
};

export default PaymentStatus;