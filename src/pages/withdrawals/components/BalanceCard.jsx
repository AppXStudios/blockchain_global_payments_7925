import React from 'react';
import Icon from '../../../components/AppIcon';

const BalanceCard = ({ balance }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8
    })?.format(amount);
  };

  const formatUSD = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    })?.format(amount);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover-lift transition-smooth">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon name="Coins" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{balance?.currency}</h3>
            <p className="text-sm text-muted-foreground">{balance?.name}</p>
          </div>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
          balance?.available > 0 ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
        }`}>
          {balance?.available > 0 ? 'Available' : 'No Balance'}
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Available Balance</span>
          <div className="text-right">
            <p className="text-lg font-semibold text-foreground">
              {formatCurrency(balance?.available)} {balance?.currency}
            </p>
            <p className="text-sm text-muted-foreground">
              ≈ {formatUSD(balance?.usdValue)}
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Minimum Withdrawal</span>
          <span className="text-sm text-foreground">
            {formatCurrency(balance?.minWithdrawal)} {balance?.currency}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Network Fee</span>
          <span className="text-sm text-foreground">
            {formatCurrency(balance?.networkFee)} {balance?.currency}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;