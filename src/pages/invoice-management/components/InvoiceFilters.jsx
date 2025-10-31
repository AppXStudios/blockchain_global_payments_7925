import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const InvoiceFilters = ({ onFiltersChange, totalInvoices, filteredCount }) => {
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    dateRange: '',
    amountMin: '',
    amountMax: '',
    currency: '',
    customer: ''
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'draft', label: 'Draft' },
    { value: 'sent', label: 'Sent' },
    { value: 'paid', label: 'Paid' },
    { value: 'overdue', label: 'Overdue' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const dateRangeOptions = [
    { value: '', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const currencyOptions = [
    { value: '', label: 'All Currencies' },
    { value: 'USD', label: 'USD' },
    { value: 'EUR', label: 'EUR' },
    { value: 'GBP', label: 'GBP' },
    { value: 'BTC', label: 'BTC' },
    { value: 'ETH', label: 'ETH' },
    { value: 'USDT', label: 'USDT' }
  ];

  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      status: '',
      dateRange: '',
      amountMin: '',
      amountMax: '',
      currency: '',
      customer: ''
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters)?.some(value => value !== '');

  return (
    <div className="bg-card rounded-lg border border-border p-4 space-y-4">
      {/* Search and Quick Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Search invoices by number, customer, or email..."
            value={filters?.search}
            onChange={(e) => handleFilterChange('search', e?.target?.value)}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Select
            options={statusOptions}
            value={filters?.status}
            onChange={(value) => handleFilterChange('status', value)}
            placeholder="Status"
            className="w-32"
          />
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
            iconPosition="right"
          >
            Filters
          </Button>
        </div>
      </div>
      {/* Advanced Filters */}
      {isExpanded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-border">
          <Select
            label="Date Range"
            options={dateRangeOptions}
            value={filters?.dateRange}
            onChange={(value) => handleFilterChange('dateRange', value)}
          />
          
          <Select
            label="Currency"
            options={currencyOptions}
            value={filters?.currency}
            onChange={(value) => handleFilterChange('currency', value)}
          />
          
          <Input
            label="Min Amount"
            type="number"
            placeholder="0.00"
            value={filters?.amountMin}
            onChange={(e) => handleFilterChange('amountMin', e?.target?.value)}
            min="0"
            step="0.01"
          />
          
          <Input
            label="Max Amount"
            type="number"
            placeholder="999999.99"
            value={filters?.amountMax}
            onChange={(e) => handleFilterChange('amountMax', e?.target?.value)}
            min="0"
            step="0.01"
          />
        </div>
      )}
      {/* Filter Summary */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          <span className="text-muted-foreground">
            Showing {filteredCount} of {totalInvoices} invoices
          </span>
          
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              iconName="X"
              iconPosition="left"
              className="text-muted-foreground hover:text-foreground"
            >
              Clear filters
            </Button>
          )}
        </div>

        {hasActiveFilters && (
          <div className="flex items-center space-x-2">
            <Icon name="Filter" size={14} className="text-primary" />
            <span className="text-primary font-medium">Filters active</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceFilters;