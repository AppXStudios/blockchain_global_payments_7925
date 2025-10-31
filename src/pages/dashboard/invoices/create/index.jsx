import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainSidebar from '../../../../components/ui/MainSidebar';
import Button from '../../../../components/ui/Button';
import Icon from '../../../../components/AppIcon';

const CreateInvoice = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <MainSidebar />
      <main className="lg:ml-60">
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Create Invoice</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Generate a new invoice for your customer
              </p>
            </div>
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard/invoices')}
            >
              <Icon name="ArrowLeft" size={16} className="mr-2" />
              Back to Invoices
            </Button>
          </div>
        </header>
        
        <div className="p-6">
          <div className="max-w-2xl mx-auto">
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Invoice Details</h2>
              <p className="text-muted-foreground">
                This page is ready for invoice creation functionality.
              </p>
              <div className="mt-6 flex space-x-4">
                <Button onClick={() => navigate('/dashboard/invoices')}>
                  Cancel
                </Button>
                <Button variant="default" className="gradient-primary">
                  Create Invoice
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateInvoice;