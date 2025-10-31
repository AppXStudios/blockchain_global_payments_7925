import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ProfileSettings = () => {
  const [profileData, setProfileData] = useState({
    companyName: "TechCorp Solutions",
    contactEmail: "admin@techcorp.com",
    contactPhone: "+1 (555) 123-4567",
    businessType: "technology",
    website: "https://techcorp.com",
    address: "123 Business Ave",
    city: "San Francisco",
    state: "CA",
    zipCode: "94105",
    country: "US",
    taxId: "12-3456789"
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const businessTypes = [
    { value: "technology", label: "Technology" },
    { value: "ecommerce", label: "E-commerce" },
    { value: "retail", label: "Retail" },
    { value: "services", label: "Professional Services" },
    { value: "manufacturing", label: "Manufacturing" },
    { value: "healthcare", label: "Healthcare" },
    { value: "finance", label: "Financial Services" },
    { value: "education", label: "Education" },
    { value: "other", label: "Other" }
  ];

  const countries = [
    { value: "US", label: "United States" },
    { value: "CA", label: "Canada" },
    { value: "GB", label: "United Kingdom" },
    { value: "AU", label: "Australia" },
    { value: "DE", label: "Germany" },
    { value: "FR", label: "France" },
    { value: "JP", label: "Japan" },
    { value: "SG", label: "Singapore" }
  ];

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset to original data in real implementation
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Business Profile</h3>
          <p className="text-sm text-muted-foreground">
            Manage your business information and contact details
          </p>
        </div>
        {!isEditing ? (
          <Button
            variant="outline"
            iconName="Edit"
            iconPosition="left"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </Button>
        ) : (
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              onClick={handleCancel}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              loading={isSaving}
              iconName="Save"
              iconPosition="left"
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </div>
        )}
      </div>
      {/* Profile Form */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Company Information */}
          <div className="md:col-span-2">
            <h4 className="text-md font-medium text-foreground mb-4">Company Information</h4>
          </div>

          <Input
            label="Company Name"
            type="text"
            value={profileData?.companyName}
            onChange={(e) => handleInputChange('companyName', e?.target?.value)}
            disabled={!isEditing}
            required
          />

          <Select
            label="Business Type"
            options={businessTypes}
            value={profileData?.businessType}
            onChange={(value) => handleInputChange('businessType', value)}
            disabled={!isEditing}
            required
          />

          <Input
            label="Website"
            type="url"
            value={profileData?.website}
            onChange={(e) => handleInputChange('website', e?.target?.value)}
            disabled={!isEditing}
            placeholder="https://example.com"
          />

          <Input
            label="Tax ID / EIN"
            type="text"
            value={profileData?.taxId}
            onChange={(e) => handleInputChange('taxId', e?.target?.value)}
            disabled={!isEditing}
            placeholder="12-3456789"
          />

          {/* Contact Information */}
          <div className="md:col-span-2 mt-6">
            <h4 className="text-md font-medium text-foreground mb-4">Contact Information</h4>
          </div>

          <Input
            label="Contact Email"
            type="email"
            value={profileData?.contactEmail}
            onChange={(e) => handleInputChange('contactEmail', e?.target?.value)}
            disabled={!isEditing}
            required
          />

          <Input
            label="Phone Number"
            type="tel"
            value={profileData?.contactPhone}
            onChange={(e) => handleInputChange('contactPhone', e?.target?.value)}
            disabled={!isEditing}
            placeholder="+1 (555) 123-4567"
          />

          {/* Address Information */}
          <div className="md:col-span-2 mt-6">
            <h4 className="text-md font-medium text-foreground mb-4">Business Address</h4>
          </div>

          <div className="md:col-span-2">
            <Input
              label="Street Address"
              type="text"
              value={profileData?.address}
              onChange={(e) => handleInputChange('address', e?.target?.value)}
              disabled={!isEditing}
              placeholder="123 Business Avenue"
            />
          </div>

          <Input
            label="City"
            type="text"
            value={profileData?.city}
            onChange={(e) => handleInputChange('city', e?.target?.value)}
            disabled={!isEditing}
            placeholder="San Francisco"
          />

          <Input
            label="State / Province"
            type="text"
            value={profileData?.state}
            onChange={(e) => handleInputChange('state', e?.target?.value)}
            disabled={!isEditing}
            placeholder="CA"
          />

          <Input
            label="ZIP / Postal Code"
            type="text"
            value={profileData?.zipCode}
            onChange={(e) => handleInputChange('zipCode', e?.target?.value)}
            disabled={!isEditing}
            placeholder="94105"
          />

          <Select
            label="Country"
            options={countries}
            value={profileData?.country}
            onChange={(value) => handleInputChange('country', value)}
            disabled={!isEditing}
            required
          />
        </div>

        {/* Verification Status */}
        <div className="mt-8 pt-6 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                <Icon name="CheckCircle" size={20} className="text-success" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Account Verified</p>
                <p className="text-xs text-muted-foreground">
                  Your business profile has been verified and approved
                </p>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              Verified on Oct 15, 2024
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;