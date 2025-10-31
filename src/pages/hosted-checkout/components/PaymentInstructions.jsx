import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PaymentInstructions = ({ 
  depositAddress = "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
  amount = "0.00150000",
  currency = "BTC",
  networkFee = "0.00001500",
  qrCodeUrl = null
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard?.writeText(depositAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  const handleCopyAmount = async () => {
    try {
      await navigator.clipboard?.writeText(amount);
      // Could add separate state for amount copy feedback
    } catch (err) {
      console.error('Failed to copy amount:', err);
    }
  };

  // Generate QR code URL if not provided
  const qrCode = qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${depositAddress}`;

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground mb-2">Payment Instructions</h3>
          <p className="text-muted-foreground">Send the exact amount to the address below</p>
        </div>

        {/* QR Code */}
        <div className="flex justify-center">
          <div className="p-4 bg-white rounded-xl">
            <img 
              src={qrCode}
              alt="QR code containing cryptocurrency payment address for mobile wallet scanning"
              className="w-48 h-48 object-contain"
            />
          </div>
        </div>

        {/* Payment Amount */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <div className="text-sm text-muted-foreground">Amount to Send</div>
              <div className="text-lg font-bold text-foreground">{amount} {currency}</div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopyAmount}
              className="text-muted-foreground hover:text-foreground"
            >
              <Icon name="Copy" size={16} />
            </Button>
          </div>

          {/* Network Fee Info */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Network Fee (estimated)</span>
            <span className="text-foreground">{networkFee} {currency}</span>
          </div>
        </div>

        {/* Deposit Address */}
        <div className="space-y-3">
          <div className="text-sm font-medium text-foreground">Deposit Address</div>
          <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
            <div className="flex-1 font-mono text-sm text-foreground break-all">
              {depositAddress}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopyAddress}
              className={`flex-shrink-0 ${copied ? 'text-success' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Icon name={copied ? "Check" : "Copy"} size={16} />
            </Button>
          </div>
          {copied && (
            <div className="text-sm text-success">Address copied to clipboard!</div>
          )}
        </div>

        {/* Important Notes */}
        <div className="space-y-3 p-4 bg-warning/10 rounded-lg border border-warning/20">
          <div className="flex items-start space-x-2">
            <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5 flex-shrink-0" />
            <div className="space-y-2 text-sm">
              <div className="font-medium text-warning">Important Notes:</div>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Send only {currency} to this address</li>
                <li>• Send the exact amount shown above</li>
                <li>• Payment will be confirmed after network confirmations</li>
                <li>• Do not send from exchange accounts</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Mobile Wallet Button */}
        <div className="sm:hidden">
          <Button
            variant="default"
            fullWidth
            className="gradient-primary"
            onClick={() => {
              const walletUrl = `bitcoin:${depositAddress}?amount=${amount}`;
              window.location.href = walletUrl;
            }}
          >
            <Icon name="Smartphone" size={16} className="mr-2" />
            Open in Wallet App
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentInstructions;