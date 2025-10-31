import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SupportSection = ({ 
  supportEmail = "support@blockpay.com",
  supportPhone = "+1 (555) 123-4567",
  onContactSupport = () => {}
}) => {
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqItems = [
    {
      id: 1,
      question: "How long does it take for payments to confirm?",
      answer: `Payment confirmation times vary by cryptocurrency:\n• Bitcoin: 10-60 minutes (1-6 confirmations)\n• Ethereum: 2-15 minutes (12-75 confirmations)\n• Litecoin: 2.5-15 minutes (6-36 confirmations)\n\nConfirmation times depend on network congestion and fees paid.`
    },
    {
      id: 2,
      question: "What happens if I send the wrong amount?",
      answer: `If you send an incorrect amount:\n• Overpayments: Excess will be refunded to your address\n• Underpayments: Payment will remain pending until full amount is received\n• Contact support if you need assistance with incorrect payments`
    },
    {
      id: 3,
      question: "Can I cancel my payment?",
      answer: `Cryptocurrency payments cannot be reversed once sent to the blockchain.\n\nBefore the payment expires:\n• You can choose not to send the payment\n• Contact the merchant directly for cancellation\n\nAfter sending:\n• Contact merchant support for refund policies\n• Refunds are at merchant discretion`
    },
    {
      id: 4,
      question: "Why is my payment taking so long?",
      answer: `Payment delays can occur due to:\n• Network congestion (high transaction volume)\n• Low transaction fees (slower processing)\n• Exchange or wallet delays\n• Required confirmation count\n\nCheck the transaction on a blockchain explorer or contact support.`
    }
  ];

  const contactMethods = [
    {
      icon: 'Mail',
      label: 'Email Support',
      value: supportEmail,
      action: () => window.location.href = `mailto:${supportEmail}?subject=Payment Support Request`
    },
    {
      icon: 'Phone',
      label: 'Phone Support',
      value: supportPhone,
      action: () => window.location.href = `tel:${supportPhone}`
    },
    {
      icon: 'MessageCircle',
      label: 'Live Chat',
      value: 'Available 24/7',
      action: onContactSupport
    }
  ];

  const toggleFaq = (faqId) => {
    setExpandedFaq(expandedFaq === faqId ? null : faqId);
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground mb-2">Need Help?</h3>
          <p className="text-muted-foreground">
            Our support team is here to assist you with your payment
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {contactMethods?.map((method, index) => (
            <button
              key={index}
              onClick={method?.action}
              className="flex flex-col items-center p-4 bg-muted rounded-lg hover:bg-muted/80 transition-smooth text-center"
            >
              <Icon name={method?.icon} size={20} className="text-primary mb-2" />
              <div className="text-sm font-medium text-foreground">{method?.label}</div>
              <div className="text-xs text-muted-foreground mt-1">{method?.value}</div>
            </button>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="space-y-3">
          <h4 className="text-md font-semibold text-foreground">Frequently Asked Questions</h4>
          
          <div className="space-y-2">
            {faqItems?.map((faq) => (
              <div key={faq?.id} className="border border-border rounded-lg">
                <button
                  onClick={() => toggleFaq(faq?.id)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-smooth"
                >
                  <span className="text-sm font-medium text-foreground pr-4">
                    {faq?.question}
                  </span>
                  <Icon 
                    name={expandedFaq === faq?.id ? "ChevronUp" : "ChevronDown"} 
                    size={16} 
                    className="text-muted-foreground flex-shrink-0" 
                  />
                </button>
                
                {expandedFaq === faq?.id && (
                  <div className="px-4 pb-4 border-t border-border">
                    <div className="text-sm text-muted-foreground whitespace-pre-line pt-3">
                      {faq?.answer}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20">
          <div className="flex items-start space-x-3">
            <Icon name="AlertCircle" size={16} className="text-destructive mt-0.5 flex-shrink-0" />
            <div className="space-y-2">
              <div className="text-sm font-medium text-destructive">
                Payment Issues or Emergencies
              </div>
              <div className="text-sm text-muted-foreground">
                If you're experiencing critical payment issues, contact our emergency support line immediately.
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.href = `tel:${supportPhone}`}
                className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                <Icon name="Phone" size={14} className="mr-2" />
                Emergency Support
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportSection;