import React from 'react';
import { useNavigate } from 'react-router-dom';
import PublicHeader from '../../../components/ui/PublicHeader';
import Button from '../../../components/ui/Button';

const PrivacyPolicyPage = () => {
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

        <h1 className="text-4xl font-bold text-foreground mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">Last updated: October 31, 2024</p>

        <div className="prose prose-gray max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Introduction</h2>
            <p className="text-muted-foreground mb-4">
              Welcome to Blockchain Global Payments. We respect your privacy and are committed to protecting your personal data.
              This privacy policy will inform you about how we look after your personal data when you visit our website and tell
              you about your privacy rights.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Data We Collect</h2>
            <p className="text-muted-foreground mb-4">
              We may collect, use, store and transfer different kinds of personal data about you including:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Identity Data: name, username, or similar identifier</li>
              <li>Contact Data: email address and telephone numbers</li>
              <li>Financial Data: payment card details and transaction information</li>
              <li>Technical Data: IP address, browser type, and device information</li>
              <li>Usage Data: information about how you use our website and services</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. How We Use Your Data</h2>
            <p className="text-muted-foreground mb-4">
              We will only use your personal data when the law allows us to. Most commonly, we will use your personal data to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Process your transactions and manage your account</li>
              <li>Provide customer support and respond to inquiries</li>
              <li>Improve our services and develop new features</li>
              <li>Comply with legal and regulatory requirements</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Data Security</h2>
            <p className="text-muted-foreground mb-4">
              We have put in place appropriate security measures to prevent your personal data from being accidentally lost,
              used or accessed in an unauthorized way, altered or disclosed.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Your Rights</h2>
            <p className="text-muted-foreground mb-4">
              Under certain circumstances, you have rights under data protection laws in relation to your personal data, including
              the right to access, correct, delete, or restrict processing of your data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Contact Us</h2>
            <p className="text-muted-foreground mb-4">
              If you have any questions about this privacy policy or our privacy practices, please contact us at:
            </p>
            <p className="text-muted-foreground">
              Email: privacy@blockchainpayments.com<br />
              Address: 123 Crypto Street, Suite 100, San Francisco, CA 94105
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
