import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import PublicHeader from '../../components/ui/PublicHeader';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';

const ContactPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e?.target?.name]: e?.target?.value
    });
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    alert('Thank you for your message! We\'ll get back to you within 24 hours.');
    setFormData({
      name: '',
      email: '',
      company: '',
      subject: '',
      message: ''
    });
    setIsSubmitting(false);
  };

  const contactMethods = [
    {
      icon: 'Mail',
      title: 'Email Support',
      description: 'Get help from our support team',
      contact: 'support@blockpay.com',
      action: () => window.location.href = 'mailto:support@blockpay.com'
    },
    {
      icon: 'MessageCircle',
      title: 'Live Chat',
      description: 'Chat with us in real-time',
      contact: 'Available 24/7',
      action: () => navigate('/support')
    },
    {
      icon: 'Phone',
      title: 'Phone Support',
      description: 'Speak with our team directly',
      contact: '+1 (555) 123-4567',
      action: () => window.location.href = 'tel:+15551234567'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Contact Us - BlockPay Support</title>
        <meta 
          name="description" 
          content="Get in touch with BlockPay. Contact our support team for help with cryptocurrency payment processing, technical questions, or business inquiries." 
        />
      </Helmet>
      <div className="min-h-screen bg-background">
        <PublicHeader />
        
        <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Contact Us
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Have questions about BlockPay? We're here to help. Reach out to our team and we'll get back to you as soon as possible.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Methods */}
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Get In Touch
              </h2>
              <div className="space-y-6">
                {contactMethods?.map((method, index) => (
                  <div
                    key={index}
                    className="bg-card border border-border rounded-lg p-6 cursor-pointer hover:shadow-lg transition-smooth"
                    onClick={method?.action}
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                        <Icon name={method?.icon} size={24} className="text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {method?.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {method?.description}
                        </p>
                      </div>
                    </div>
                    <p className="text-foreground font-medium">
                      {method?.contact}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 bg-muted rounded-lg p-6">
                <h3 className="font-semibold text-foreground mb-2">
                  Office Hours
                </h3>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>Monday - Friday: 9:00 AM - 6:00 PM EST</p>
                  <p>Saturday: 10:00 AM - 4:00 PM EST</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-card border border-border rounded-lg p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Send us a Message
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Name *
                      </label>
                      <Input
                        type="text"
                        name="name"
                        value={formData?.name}
                        onChange={handleInputChange}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Email *
                      </label>
                      <Input
                        type="email"
                        name="email"
                        value={formData?.email}
                        onChange={handleInputChange}
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Company
                      </label>
                      <Input
                        type="text"
                        name="company"
                        value={formData?.company}
                        onChange={handleInputChange}
                        placeholder="Your company name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Subject *
                      </label>
                      <Input
                        type="text"
                        name="subject"
                        value={formData?.subject}
                        onChange={handleInputChange}
                        placeholder="What can we help you with?"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData?.message}
                      onChange={handleInputChange}
                      rows={6}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Tell us more about your inquiry..."
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="default"
                    fullWidth
                    disabled={isSubmitting}
                    className="gradient-primary"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default ContactPage;