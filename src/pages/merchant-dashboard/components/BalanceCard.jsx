import React from 'react';
import Icon from '../../../components/AppIcon';
import { formatCurrency } from '../../../lib/utils/formatCurrency';

const BalanceCard = ({ currency, balance, usdValue, change, changeType }) => {
  const getChangeColor = () => {
    if (changeType === 'increase') return 'text-success';
    if (changeType === 'decrease') return 'text-destructive';
    return 'text-muted-foreground';
  };

  const getChangeIcon = () => {
    if (changeType === 'increase') return 'TrendingUp';
    if (changeType === 'decrease') return 'TrendingDown';
    return 'Minus';
  };

  // ✅ Apply failsafe patch - convert to uppercase and fallback to USD
  const safeCurrency = (currency || "USD")?.toUpperCase();

  return (
    <div className="bg-card border border-border rounded-xl p-6 hover-lift transition-smooth">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
            <Icon name="Coins" size={20} color="white" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">{safeCurrency} Balance</h3>
            <p className="text-2xl font-bold text-foreground">{formatCurrency(balance, safeCurrency)}</p>
          </div>
        </div>
        <div className={`flex items-center space-x-1 ${getChangeColor()}`}>
          <Icon name={getChangeIcon()} size={16} />
          <span className="text-sm font-medium">{change}</span>
        </div>
      </div>
      
      {safeCurrency !== 'USD' && (
        <div className="pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            USD Equivalent: <span className="font-medium text-foreground">{formatCurrency(usdValue, 'USD')}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default BalanceCard;