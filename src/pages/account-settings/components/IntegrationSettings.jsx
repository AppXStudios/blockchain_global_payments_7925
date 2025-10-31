import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const IntegrationSettings = () => {
  const [custodyAccount, setCustodyAccount] = useState({
    accountId: "nowpay_acc_1234567890",
    status: "connected",
    balance: {
      BTC: "0.00245678",
      ETH: "0.15432100",
      USDT: "1,247.50",
      USDC: "892.30"
    },
    lastSync: "2024-10-31T05:45:00Z",
    connectionDate: "2024-10-15T10:30:00Z"
  });

  const [whitelabelSettings, setWhitelabelSettings] = useState({
    companyName: "TechCorp Solutions",
    primaryColor: "#6366F1",
    secondaryColor: "#3B82F6",
    logoUrl: "https://images.unsplash.com/photo-1730472528744-399397ac0b76",
    logoAlt: "Modern geometric logo with blue and purple gradient design on white background",
    checkoutTitle: "Complete Your Payment",
    supportEmail: "support@techcorp.com",
    termsUrl: "https://techcorp.com/terms",
    privacyUrl: "https://techcorp.com/privacy"
  });

  const [isSyncing, setIsSyncing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);

  const supportedCurrencies = [
  { symbol: "BTC", name: "Bitcoin", network: "Bitcoin" },
  { symbol: "ETH", name: "Ethereum", network: "Ethereum" },
  { symbol: "USDT", name: "Tether", network: "Ethereum" },
  { symbol: "USDC", name: "USD Coin", network: "Ethereum" },
  { symbol: "LTC", name: "Litecoin", network: "Litecoin" },
  { symbol: "BCH", name: "Bitcoin Cash", network: "Bitcoin Cash" },
  { symbol: "ADA", name: "Cardano", network: "Cardano" },
  { symbol: "DOT", name: "Polkadot", network: "Polkadot" }];


  const handleSync = async () => {
    setIsSyncing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setCustodyAccount((prev) => ({
      ...prev,
      lastSync: new Date()?.toISOString()
    }));
    setIsSyncing(false);
  };

  const handleSaveWhitelabel = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSaving(false);
  };

  const handleDisconnect = async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setCustodyAccount((prev) => ({
      ...prev,
      status: "disconnected"
    }));
    setShowDisconnectModal(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-foreground">Integration Settings</h3>
        <p className="text-sm text-muted-foreground">
          Manage your custody account connection and white-label customization
        </p>
      </div>
      {/* NOWPayments Custody Integration */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon name="Wallet" size={20} className="text-primary" />
            </div>
            <div>
              <h4 className="text-md font-medium text-foreground">NOWPayments Custody Account</h4>
              <p className="text-sm text-muted-foreground">
                Manage your cryptocurrency custody integration
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
            custodyAccount?.status === 'connected' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`
            }>
              <div className={`w-2 h-2 rounded-full ${
              custodyAccount?.status === 'connected' ? 'bg-success' : 'bg-destructive'}`
              } />
              {custodyAccount?.status === 'connected' ? 'Connected' : 'Disconnected'}
            </div>
          </div>
        </div>

        {custodyAccount?.status === 'connected' ?
        <div className="space-y-6">
            {/* Account Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Account ID
                </p>
                <p className="text-sm font-mono text-foreground mt-1">
                  {custodyAccount?.accountId}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Connected Since
                </p>
                <p className="text-sm text-foreground mt-1">
                  {formatDate(custodyAccount?.connectionDate)}
                </p>
              </div>
            </div>

            {/* Balance Overview */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-sm font-medium text-foreground">Current Balances</h5>
                <Button
                variant="outline"
                size="sm"
                loading={isSyncing}
                iconName="RefreshCw"
                iconPosition="left"
                onClick={handleSync}>

                  Sync Now
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(custodyAccount?.balance)?.map(([currency, amount]) =>
              <div key={currency} className="bg-muted/50 rounded-lg p-4">
                    <p className="text-xs font-medium text-muted-foreground">{currency}</p>
                    <p className="text-lg font-semibold text-foreground">{amount}</p>
                  </div>
              )}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Last synced: {formatDate(custodyAccount?.lastSync)}
              </p>
            </div>

            {/* Supported Currencies */}
            <div>
              <h5 className="text-sm font-medium text-foreground mb-4">Supported Currencies</h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {supportedCurrencies?.map((currency) =>
              <div key={currency?.symbol} className="flex items-center space-x-2 p-2 border border-border rounded-lg">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">{currency?.symbol?.[0]}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{currency?.symbol}</p>
                      <p className="text-xs text-muted-foreground">{currency?.name}</p>
                    </div>
                  </div>
              )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div>
                <p className="text-sm font-medium text-foreground">Connection Management</p>
                <p className="text-xs text-muted-foreground">
                  Disconnect to stop receiving payments and accessing balances
                </p>
              </div>
              <Button
              variant="destructive"
              onClick={() => setShowDisconnectModal(true)}>

                Disconnect Account
              </Button>
            </div>
          </div> :

        <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
              <Icon name="Unlink" size={24} className="text-muted-foreground" />
            </div>
            <h5 className="text-md font-medium text-foreground mb-2">Account Disconnected</h5>
            <p className="text-sm text-muted-foreground mb-4">
              Connect your NOWPayments custody account to start accepting cryptocurrency payments
            </p>
            <Button variant="default">
              Connect Account
            </Button>
          </div>
        }
      </div>
      {/* White-label Customization */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
              <Icon name="Palette" size={20} className="text-secondary" />
            </div>
            <div>
              <h4 className="text-md font-medium text-foreground">White-label Customization</h4>
              <p className="text-sm text-muted-foreground">
                Customize the checkout experience with your branding
              </p>
            </div>
          </div>
          <Button
            variant="default"
            loading={isSaving}
            iconName="Save"
            iconPosition="left"
            onClick={handleSaveWhitelabel}>

            Save Changes
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Branding Settings */}
          <div className="space-y-4">
            <h5 className="text-sm font-medium text-foreground">Branding</h5>
            
            <Input
              label="Company Name"
              type="text"
              value={whitelabelSettings?.companyName}
              onChange={(e) => setWhitelabelSettings((prev) => ({ ...prev, companyName: e?.target?.value }))}
              placeholder="Your Company Name" />


            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground">Primary Color</label>
                <div className="flex items-center space-x-2 mt-1">
                  <input
                    type="color"
                    value={whitelabelSettings?.primaryColor}
                    onChange={(e) => setWhitelabelSettings((prev) => ({ ...prev, primaryColor: e?.target?.value }))}
                    className="w-10 h-10 rounded border border-border cursor-pointer" />

                  <Input
                    type="text"
                    value={whitelabelSettings?.primaryColor}
                    onChange={(e) => setWhitelabelSettings((prev) => ({ ...prev, primaryColor: e?.target?.value }))}
                    className="flex-1" />

                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Secondary Color</label>
                <div className="flex items-center space-x-2 mt-1">
                  <input
                    type="color"
                    value={whitelabelSettings?.secondaryColor}
                    onChange={(e) => setWhitelabelSettings((prev) => ({ ...prev, secondaryColor: e?.target?.value }))}
                    className="w-10 h-10 rounded border border-border cursor-pointer" />

                  <Input
                    type="text"
                    value={whitelabelSettings?.secondaryColor}
                    onChange={(e) => setWhitelabelSettings((prev) => ({ ...prev, secondaryColor: e?.target?.value }))}
                    className="flex-1" />

                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Company Logo</label>
              <div className="mt-2 flex items-center space-x-4">
                <div className="w-16 h-16 rounded-lg border border-border overflow-hidden">
                  <img
                    src={whitelabelSettings?.logoUrl}
                    alt={whitelabelSettings?.logoAlt}
                    className="w-full h-full object-cover" />

                </div>
                <div className="flex-1">
                  <Button variant="outline" size="sm">
                    Upload New Logo
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">
                    Recommended: 200x200px, PNG or SVG
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Settings */}
          <div className="space-y-4">
            <h5 className="text-sm font-medium text-foreground">Checkout Experience</h5>
            
            <Input
              label="Checkout Page Title"
              type="text"
              value={whitelabelSettings?.checkoutTitle}
              onChange={(e) => setWhitelabelSettings((prev) => ({ ...prev, checkoutTitle: e?.target?.value }))}
              placeholder="Complete Your Payment" />


            <Input
              label="Support Email"
              type="email"
              value={whitelabelSettings?.supportEmail}
              onChange={(e) => setWhitelabelSettings((prev) => ({ ...prev, supportEmail: e?.target?.value }))}
              placeholder="support@yourcompany.com" />


            <Input
              label="Terms of Service URL"
              type="url"
              value={whitelabelSettings?.termsUrl}
              onChange={(e) => setWhitelabelSettings((prev) => ({ ...prev, termsUrl: e?.target?.value }))}
              placeholder="https://yourcompany.com/terms" />


            <Input
              label="Privacy Policy URL"
              type="url"
              value={whitelabelSettings?.privacyUrl}
              onChange={(e) => setWhitelabelSettings((prev) => ({ ...prev, privacyUrl: e?.target?.value }))}
              placeholder="https://yourcompany.com/privacy" />

          </div>
        </div>

        {/* Preview */}
        <div className="mt-8 pt-6 border-t border-border">
          <h5 className="text-sm font-medium text-foreground mb-4">Checkout Preview</h5>
          <div className="bg-muted/50 rounded-lg p-6 max-w-md">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 rounded overflow-hidden">
                <img
                  src={whitelabelSettings?.logoUrl}
                  alt={whitelabelSettings?.logoAlt}
                  className="w-full h-full object-cover" />

              </div>
              <span className="font-medium text-foreground">{whitelabelSettings?.companyName}</span>
            </div>
            <h6 className="text-lg font-semibold text-foreground mb-2">
              {whitelabelSettings?.checkoutTitle}
            </h6>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Amount:</span>
                <span className="text-foreground">$99.99</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Currency:</span>
                <span className="text-foreground">Bitcoin (BTC)</span>
              </div>
            </div>
            <div
              className="mt-4 py-2 px-4 rounded text-center text-white text-sm font-medium"
              style={{ backgroundColor: whitelabelSettings?.primaryColor }}>

              Continue to Payment
            </div>
          </div>
        </div>
      </div>
      {/* Disconnect Confirmation Modal */}
      {showDisconnectModal &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                  <Icon name="AlertTriangle" size={20} className="text-destructive" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Disconnect Account</h3>
              </div>

              <div className="space-y-3 mb-6">
                <p className="text-sm text-foreground">
                  Are you sure you want to disconnect your NOWPayments custody account?
                </p>
                <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-3">
                  <p className="text-sm text-destructive">
                    <strong>Warning:</strong> This will stop all payment processing and you won't be able to access your balances until reconnected.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3">
                <Button
                variant="ghost"
                onClick={() => setShowDisconnectModal(false)}>

                  Cancel
                </Button>
                <Button
                variant="destructive"
                onClick={handleDisconnect}>

                  Disconnect
                </Button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>);

};

export default IntegrationSettings;