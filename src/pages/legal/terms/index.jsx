import React from 'react';
import { useNavigate } from 'react-router-dom';
import PublicHeader from '../../../components/ui/PublicHeader';
import Button from '../../../components/ui/Button';

const TermsOfServicePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />

      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            iconName="ArrowLeft"
            iconPosition="left"
          >
            Back
          </Button>
        </div>

        <h1 className="text-4xl font-bold text-foreground mb-4">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">Last updated: October 31, 2024</p>

        <div className="prose prose-gray max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground mb-4">
              By accessing and using Blockchain Global Payments services, you accept and agree to be bound by the terms
              and provision of this agreement.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Services Description</h2>
            <p className="text-muted-foreground mb-4">
              Blockchain Global Payments provides cryptocurrency payment processing services to merchants worldwide.
              Our services include payment processing, custody integration, invoicing, and withdrawal management.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Account Registration</h2>
            <p className="text-muted-foreground mb-4">
              To use our services, you must:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Provide accurate and complete information during registration</li>
              <li>Maintain the security of your account credentials</li>
              <li>Promptly update your account information</li>
              <li>Be at least 18 years old or the age of majority in your jurisdiction</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Fees and Payment</h2>
            <p className="text-muted-foreground mb-4">
              Our fee structure is transparent and available on our pricing page. Fees may vary based on transaction volume,
              payment method, and service tier. All fees are subject to change with 30 days notice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Prohibited Activities</h2>
            <p className="text-muted-foreground mb-4">
              You agree not to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Use our services for illegal activities</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Engage in fraudulent transactions</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Limitation of Liability</h2>
            <p className="text-muted-foreground mb-4">
              To the maximum extent permitted by law, Blockchain Global Payments shall not be liable for any indirect,
              incidental, special, consequential, or punitive damages resulting from your use of our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Termination</h2>
            <p className="text-muted-foreground mb-4">
              We reserve the right to suspend or terminate your account at any time for violation of these terms or
              for any other reason at our sole discretion.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">8. Contact Information</h2>
            <p className="text-muted-foreground mb-4">
              For questions about these Terms of Service, please contact us at:
            </p>
            <p className="text-muted-foreground">
              Email: legal@blockchainpayments.com<br />
              Address: 123 Crypto Street, Suite 100, San Francisco, CA 94105
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
