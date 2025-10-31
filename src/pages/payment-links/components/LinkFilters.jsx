import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const LinkFilters = ({ 
  searchTerm, 
  onSearchChange, 
  statusFilter, 
  onStatusFilterChange,
  currencyFilter,
  onCurrencyFilterChange,
  sortBy,
  onSortChange,
  onClearFilters 
}) => {
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'expired', label: 'Expired' }
  ];

  const currencyOptions = [
    { value: 'all', label: 'All Currencies' },
    { value: 'USD', label: 'USD' },
    { value: 'BTC', label: 'BTC' },
    { value: 'ETH', label: 'ETH' },
    { value: 'USDT', label: 'USDT' },
    { value: 'USDC', label: 'USDC' }
  ];

  const sortOptions = [
    { value: 'created_desc', label: 'Newest First' },
    { value: 'created_asc', label: 'Oldest First' },
    { value: 'name_asc', label: 'Name A-Z' },
    { value: 'name_desc', label: 'Name Z-A' },
    { value: 'amount_desc', label: 'Highest Amount' },
    { value: 'amount_asc', label: 'Lowest Amount' },
    { value: 'clicks_desc', label: 'Most Clicks' },
    { value: 'conversion_desc', label: 'Best Conversion' }
  ];

  const hasActiveFilters = searchTerm || statusFilter !== 'all' || currencyFilter !== 'all' || sortBy !== 'created_desc';

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Icon 
              name="Search" 
              size={16} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
            />
            <Input
              type="text"
              placeholder="Search payment links..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e?.target?.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <Select
            options={statusOptions}
            value={statusFilter}
            onChange={onStatusFilterChange}
            className="w-full sm:w-40"
          />

          <Select
            options={currencyOptions}
            value={currencyFilter}
            onChange={onCurrencyFilterChange}
            className="w-full sm:w-40"
          />

          <Select
            options={sortOptions}
            value={sortBy}
            onChange={onSortChange}
            className="w-full sm:w-48"
          />

          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              className="whitespace-nowrap"
            >
              <Icon name="X" size={14} className="mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>
      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border">
          <span className="text-xs text-muted-foreground">Active filters:</span>
          
          {searchTerm && (
            <div className="flex items-center space-x-1 bg-primary/10 text-primary px-2 py-1 rounded text-xs">
              <span>Search: "{searchTerm}"</span>
              <button
                onClick={() => onSearchChange('')}
                className="hover:text-primary/80"
              >
                <Icon name="X" size={12} />
              </button>
            </div>
          )}
          
          {statusFilter !== 'all' && (
            <div className="flex items-center space-x-1 bg-primary/10 text-primary px-2 py-1 rounded text-xs">
              <span>Status: {statusOptions?.find(opt => opt?.value === statusFilter)?.label}</span>
              <button
                onClick={() => onStatusFilterChange('all')}
                className="hover:text-primary/80"
              >
                <Icon name="X" size={12} />
              </button>
            </div>
          )}
          
          {currencyFilter !== 'all' && (
            <div className="flex items-center space-x-1 bg-primary/10 text-primary px-2 py-1 rounded text-xs">
              <span>Currency: {currencyFilter}</span>
              <button
                onClick={() => onCurrencyFilterChange('all')}
                className="hover:text-primary/80"
              >
                <Icon name="X" size={12} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LinkFilters;