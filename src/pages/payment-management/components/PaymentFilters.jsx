import React, { useState } from 'react';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const PaymentFilters = ({ onFiltersChange, resultsCount = 0 }) => {
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    currency: '',
    dateFrom: '',
    dateTo: '',
    amountMin: '',
    amountMax: ''
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' },
    { value: 'expired', label: 'Expired' },
    { value: 'failed', label: 'Failed' }
  ];

  const currencyOptions = [
    { value: '', label: 'All Currencies' },
    { value: 'BTC', label: 'Bitcoin (BTC)' },
    { value: 'ETH', label: 'Ethereum (ETH)' },
    { value: 'USDT', label: 'Tether (USDT)' },
    { value: 'USDC', label: 'USD Coin (USDC)' },
    { value: 'LTC', label: 'Litecoin (LTC)' },
    { value: 'XRP', label: 'Ripple (XRP)' },
    { value: 'ADA', label: 'Cardano (ADA)' },
    { value: 'DOT', label: 'Polkadot (DOT)' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      search: '',
      status: '',
      currency: '',
      dateFrom: '',
      dateTo: '',
      amountMin: '',
      amountMax: ''
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters)?.some(value => value !== '');

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      {/* Basic Filters Row */}
      <div className="flex flex-col lg:flex-row gap-4 mb-4">
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Search by transaction ID, customer email..."
            value={filters?.search}
            onChange={(e) => handleFilterChange('search', e?.target?.value)}
            className="w-full"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 lg:w-auto">
          <Select
            options={statusOptions}
            value={filters?.status}
            onChange={(value) => handleFilterChange('status', value)}
            placeholder="Status"
            className="w-full sm:w-40"
          />
          
          <Select
            options={currencyOptions}
            value={filters?.currency}
            onChange={(value) => handleFilterChange('currency', value)}
            placeholder="Currency"
            searchable
            className="w-full sm:w-40"
          />
          
          <Button
            variant="outline"
            onClick={() => setIsExpanded(!isExpanded)}
            iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
            iconPosition="right"
            className="w-full sm:w-auto"
          >
            Advanced
          </Button>
        </div>
      </div>
      {/* Advanced Filters */}
      {isExpanded && (
        <div className="border-t border-border pt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              type="date"
              label="Date From"
              value={filters?.dateFrom}
              onChange={(e) => handleFilterChange('dateFrom', e?.target?.value)}
            />
            
            <Input
              type="date"
              label="Date To"
              value={filters?.dateTo}
              onChange={(e) => handleFilterChange('dateTo', e?.target?.value)}
            />
            
            <Input
              type="number"
              label="Min Amount"
              placeholder="0.00"
              value={filters?.amountMin}
              onChange={(e) => handleFilterChange('amountMin', e?.target?.value)}
            />
            
            <Input
              type="number"
              label="Max Amount"
              placeholder="1000.00"
              value={filters?.amountMax}
              onChange={(e) => handleFilterChange('amountMax', e?.target?.value)}
            />
          </div>
        </div>
      )}
      {/* Results Summary and Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-4 pt-4 border-t border-border">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-muted-foreground">
            {resultsCount?.toLocaleString()} payments found
          </span>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              iconName="X"
              iconPosition="left"
              className="text-muted-foreground hover:text-foreground"
            >
              Clear Filters
            </Button>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            iconPosition="left"
          >
            Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="RefreshCw"
            iconPosition="left"
          >
            Refresh
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFilters;