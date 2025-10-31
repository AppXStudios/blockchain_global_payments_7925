import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const CurrencySelector = ({ 
  selectedCurrency = "BTC",
  onCurrencyChange = () => {},
  amount = "0.00000000"
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const currencies = [
    { 
      symbol: "BTC", 
      name: "Bitcoin", 
      icon: "₿", 
      rate: "1.00000000",
      popular: true,
      network: "Bitcoin"
    },
    { 
      symbol: "ETH", 
      name: "Ethereum", 
      icon: "Ξ", 
      rate: "15.24500000",
      popular: true,
      network: "Ethereum"
    },
    { 
      symbol: "USDT", 
      name: "Tether USD", 
      icon: "₮", 
      rate: "67245.30000000",
      popular: true,
      network: "Ethereum"
    },
    { 
      symbol: "USDC", 
      name: "USD Coin", 
      icon: "$", 
      rate: "67198.45000000",
      popular: true,
      network: "Ethereum"
    },
    { 
      symbol: "LTC", 
      name: "Litecoin", 
      icon: "Ł", 
      rate: "945.67000000",
      popular: false,
      network: "Litecoin"
    },
    { 
      symbol: "ADA", 
      name: "Cardano", 
      icon: "₳", 
      rate: "178432.10000000",
      popular: false,
      network: "Cardano"
    },
    { 
      symbol: "DOT", 
      name: "Polkadot", 
      icon: "●", 
      rate: "16789.23000000",
      popular: false,
      network: "Polkadot"
    },
    { 
      symbol: "MATIC", 
      name: "Polygon", 
      icon: "◆", 
      rate: "168934.50000000",
      popular: false,
      network: "Polygon"
    }
  ];

  const filteredCurrencies = useMemo(() => {
    const filtered = currencies?.filter(currency =>
      currency?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      currency?.symbol?.toLowerCase()?.includes(searchTerm?.toLowerCase())
    );
    
    // Sort by popular first, then alphabetically
    return filtered?.sort((a, b) => {
      if (a?.popular && !b?.popular) return -1;
      if (!a?.popular && b?.popular) return 1;
      return a?.symbol?.localeCompare(b?.symbol);
    });
  }, [searchTerm]);

  const selectedCurrencyData = currencies?.find(c => c?.symbol === selectedCurrency) || currencies?.[0];

  const handleCurrencySelect = (currency) => {
    onCurrencyChange(currency?.symbol);
    setIsExpanded(false);
    setSearchTerm("");
  };

  const CurrencyItem = ({ currency, isSelected = false }) => (
    <button
      onClick={() => handleCurrencySelect(currency)}
      className={`
        w-full flex items-center justify-between p-3 rounded-lg transition-smooth
        ${isSelected 
          ? 'bg-primary text-primary-foreground' 
          : 'hover:bg-muted text-foreground'
        }
      `}
    >
      <div className="flex items-center space-x-3">
        <div className={`
          w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
          ${isSelected ? 'bg-primary-foreground text-primary' : 'bg-muted text-foreground'}
        `}>
          {currency?.icon}
        </div>
        <div className="text-left">
          <div className="font-medium">{currency?.symbol}</div>
          <div className={`text-sm ${isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
            {currency?.name}
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-sm font-medium">
          {(parseFloat(amount) * parseFloat(currency?.rate))?.toFixed(8)}
        </div>
        <div className={`text-xs ${isSelected ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>
          {currency?.network}
        </div>
      </div>
    </button>
  );

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Select Currency</h3>
          {currencies?.filter(c => c?.popular)?.length > 0 && (
            <span className="text-sm text-muted-foreground">Popular currencies shown first</span>
          )}
        </div>

        {/* Current Selection */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 transition-smooth"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold">
              {selectedCurrencyData?.icon}
            </div>
            <div className="text-left">
              <div className="font-semibold text-foreground">{selectedCurrencyData?.symbol}</div>
              <div className="text-sm text-muted-foreground">{selectedCurrencyData?.name}</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-right">
              <div className="font-medium text-foreground">
                {(parseFloat(amount) * parseFloat(selectedCurrencyData?.rate))?.toFixed(8)}
              </div>
              <div className="text-sm text-muted-foreground">{selectedCurrencyData?.network}</div>
            </div>
            <Icon 
              name={isExpanded ? "ChevronUp" : "ChevronDown"} 
              size={20} 
              className="text-muted-foreground" 
            />
          </div>
        </button>

        {/* Expanded Currency List */}
        {isExpanded && (
          <div className="space-y-3">
            {/* Search */}
            <Input
              type="search"
              placeholder="Search currencies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
              className="mb-3"
            />

            {/* Currency List */}
            <div className="max-h-64 overflow-y-auto space-y-1">
              {filteredCurrencies?.length > 0 ? (
                filteredCurrencies?.map((currency) => (
                  <CurrencyItem
                    key={currency?.symbol}
                    currency={currency}
                    isSelected={currency?.symbol === selectedCurrency}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Icon name="Search" size={24} className="mx-auto mb-2 opacity-50" />
                  <p>No currencies found</p>
                </div>
              )}
            </div>

            {/* Close Button */}
            <Button
              variant="outline"
              onClick={() => setIsExpanded(false)}
              className="w-full"
            >
              Close
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrencySelector;