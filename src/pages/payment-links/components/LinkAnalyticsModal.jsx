import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const LinkAnalyticsModal = ({ isOpen, onClose, linkData }) => {
  const [timeRange, setTimeRange] = useState('7d');

  const timeRangeOptions = [
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' }
  ];

  // Mock analytics data
  const clicksData = [
    { date: '10/25', clicks: 45, payments: 12 },
    { date: '10/26', clicks: 52, payments: 15 },
    { date: '10/27', clicks: 38, payments: 8 },
    { date: '10/28', clicks: 67, payments: 18 },
    { date: '10/29', clicks: 71, payments: 22 },
    { date: '10/30', clicks: 59, payments: 16 },
    { date: '10/31', clicks: 63, payments: 19 }
  ];

  const deviceData = [
    { name: 'Desktop', value: 65, color: '#6366F1' },
    { name: 'Mobile', value: 28, color: '#3B82F6' },
    { name: 'Tablet', value: 7, color: '#8B5CF6' }
  ];

  const countryData = [
    { country: 'United States', clicks: 156, payments: 42 },
    { country: 'United Kingdom', clicks: 89, payments: 24 },
    { country: 'Canada', clicks: 67, payments: 18 },
    { country: 'Germany', clicks: 45, payments: 12 },
    { country: 'Australia', clicks: 38, payments: 9 }
  ];

  const formatCurrency = (amount, currency) => {
    if (currency === 'USD') {
      return `$${amount?.toLocaleString()}`;
    }
    return `${amount} ${currency}`;
  };

  if (!isOpen || !linkData) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-1000 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Analytics: {linkData?.name}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {formatCurrency(linkData?.amount, linkData?.currency)} • Created {linkData?.createdAt}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Select
              options={timeRangeOptions}
              value={timeRange}
              onChange={setTimeRange}
              className="w-40"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
            >
              <Icon name="X" size={20} />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="MousePointer" size={16} className="text-primary" />
                <span className="text-sm font-medium text-muted-foreground">Total Clicks</span>
              </div>
              <div className="text-2xl font-bold text-foreground">395</div>
              <div className="text-xs text-success">+12.5% vs last period</div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="CreditCard" size={16} className="text-success" />
                <span className="text-sm font-medium text-muted-foreground">Payments</span>
              </div>
              <div className="text-2xl font-bold text-foreground">110</div>
              <div className="text-xs text-success">+8.3% vs last period</div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="TrendingUp" size={16} className="text-accent" />
                <span className="text-sm font-medium text-muted-foreground">Conversion Rate</span>
              </div>
              <div className="text-2xl font-bold text-foreground">27.8%</div>
              <div className="text-xs text-success">+2.1% vs last period</div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="DollarSign" size={16} className="text-warning" />
                <span className="text-sm font-medium text-muted-foreground">Revenue</span>
              </div>
              <div className="text-2xl font-bold text-foreground">
                {formatCurrency(linkData?.amount * 110, linkData?.currency)}
              </div>
              <div className="text-xs text-success">+15.7% vs last period</div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Clicks and Payments Over Time */}
            <div className="bg-muted/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Clicks & Payments Over Time
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={clicksData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#94A3B8"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="#94A3B8"
                      fontSize={12}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#131A33',
                        border: '1px solid rgba(148, 163, 184, 0.1)',
                        borderRadius: '8px',
                        color: '#F8FAFC'
                      }}
                    />
                    <Bar dataKey="clicks" fill="#6366F1" name="Clicks" />
                    <Bar dataKey="payments" fill="#10B981" name="Payments" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Device Breakdown */}
            <div className="bg-muted/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Device Breakdown
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={deviceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {deviceData?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry?.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#131A33',
                        border: '1px solid rgba(148, 163, 184, 0.1)',
                        borderRadius: '8px',
                        color: '#F8FAFC'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center space-x-4 mt-4">
                {deviceData?.map((device, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: device?.color }}
                    />
                    <span className="text-sm text-muted-foreground">
                      {device?.name} ({device?.value}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Geographic Data */}
          <div className="bg-muted/30 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Top Countries
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 text-sm font-medium text-muted-foreground">Country</th>
                    <th className="text-right py-3 text-sm font-medium text-muted-foreground">Clicks</th>
                    <th className="text-right py-3 text-sm font-medium text-muted-foreground">Payments</th>
                    <th className="text-right py-3 text-sm font-medium text-muted-foreground">Conversion</th>
                  </tr>
                </thead>
                <tbody>
                  {countryData?.map((country, index) => (
                    <tr key={index} className="border-b border-border/50">
                      <td className="py-3 text-sm text-foreground">{country?.country}</td>
                      <td className="py-3 text-sm text-foreground text-right">{country?.clicks}</td>
                      <td className="py-3 text-sm text-foreground text-right">{country?.payments}</td>
                      <td className="py-3 text-sm text-success text-right">
                        {((country?.payments / country?.clicks) * 100)?.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Link Performance */}
          <div className="bg-muted/30 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Link Performance
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Average Time to Payment</div>
                <div className="text-lg font-semibold text-foreground">2m 34s</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Bounce Rate</div>
                <div className="text-lg font-semibold text-foreground">23.5%</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Return Visitors</div>
                <div className="text-lg font-semibold text-foreground">18.2%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-6 border-t border-border">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LinkAnalyticsModal;