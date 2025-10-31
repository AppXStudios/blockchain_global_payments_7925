import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustSection = () => {
  const trustBadges = [
  {
    id: 1,
    icon: "Shield",
    title: "SOC 2 Type II",
    description: "Certified for security, availability, and confidentiality",
    color: "text-success"
  },
  {
    id: 2,
    icon: "Lock",
    title: "256-bit SSL",
    description: "Bank-grade encryption for all transactions",
    color: "text-primary"
  },
  {
    id: 3,
    icon: "CheckCircle",
    title: "PCI Compliant",
    description: "Meets payment card industry standards",
    color: "text-secondary"
  },
  {
    id: 4,
    icon: "Globe",
    title: "GDPR Compliant",
    description: "European data protection regulation compliant",
    color: "text-accent"
  }];


  const securityFeatures = [
  {
    id: 1,
    title: "Multi-Signature Wallets",
    description: "Enhanced security with multiple signature requirements for transactions",
    icon: "Key"
  },
  {
    id: 2,
    title: "Cold Storage",
    description: "Majority of funds stored offline in secure cold storage systems",
    icon: "Snowflake"
  },
  {
    id: 3,
    title: "Real-time Monitoring",
    description: "24/7 fraud detection and suspicious activity monitoring",
    icon: "Eye"
  },
  {
    id: 4,
    title: "Insurance Coverage",
    description: "Comprehensive insurance coverage for digital asset protection",
    icon: "Umbrella"
  }];


  const testimonials = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "CTO, TechFlow Solutions",
    avatar: "https://images.unsplash.com/photo-1597621969117-1a305d3e0c68",
    avatarAlt: "Professional headshot of Asian woman with shoulder-length black hair in navy blazer",
    content: `The integration was seamless and the security features give us complete confidence. Our customers love the crypto payment option.`,
    rating: 5
  },
  {
    id: 2,
    name: "Marcus Rodriguez",
    role: "Founder, Global Commerce Inc",
    avatar: "https://images.unsplash.com/photo-1663720527180-4c60a78fe3b7",
    avatarAlt: "Professional headshot of Hispanic man with short dark hair in gray suit",
    content: `BlockPay has transformed our international payments. The multi-currency support and instant settlements are game-changers.`,
    rating: 5
  },
  {
    id: 3,
    name: "Emily Watson",
    role: "Finance Director, InnovateCorp",
    avatar: "https://images.unsplash.com/photo-1728139877871-91d024a94f39",
    avatarAlt: "Professional headshot of Caucasian woman with blonde hair in white business shirt",
    content: `The analytics and reporting features help us track everything in real-time. Customer support is exceptional.`,
    rating: 5
  }];


  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Trust Badges */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Enterprise-Grade Security & Compliance
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-12">
            Your security is our priority. We maintain the highest standards of security and compliance to protect your business and customers.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {trustBadges?.map((badge) =>
            <div
              key={badge?.id}
              className="bg-card border border-border rounded-xl p-6 text-center hover-lift transition-smooth">

                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-muted mb-4">
                  <Icon name={badge?.icon} size={24} className={badge?.color} />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-2">
                  {badge?.title}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {badge?.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Security Features */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Advanced Security Features
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Multiple layers of protection ensure your funds and data remain secure at all times.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {securityFeatures?.map((feature) =>
            <div
              key={feature?.id}
              className="flex items-start space-x-4 bg-card border border-border rounded-xl p-6">

                <div className="flex-shrink-0 w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                  <Icon name={feature?.icon} size={20} color="white" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-2">
                    {feature?.title}
                  </h4>
                  <p className="text-muted-foreground">
                    {feature?.description}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Testimonials */}
        <div className="text-center mb-16">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Trusted by Industry Leaders
          </h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
            See what our customers have to say about their experience with our platform.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials?.map((testimonial) =>
            <div
              key={testimonial?.id}
              className="bg-card border border-border rounded-xl p-8 text-left">

                {/* Rating */}
                <div className="flex items-center space-x-1 mb-4">
                  {Array.from({ length: testimonial?.rating }, (_, i) =>
                <Icon key={i} name="Star" size={16} className="text-warning fill-current" />
                )}
                </div>

                {/* Content */}
                <blockquote className="text-muted-foreground mb-6 italic">
                  "{testimonial?.content}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center space-x-3">
                  <img
                  src={testimonial?.avatar}
                  alt={testimonial?.avatarAlt}
                  className="w-10 h-10 rounded-full object-cover" />

                  <div>
                    <div className="text-sm font-semibold text-foreground">
                      {testimonial?.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {testimonial?.role}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="bg-card border border-border rounded-2xl p-8 md:p-12 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Ready to Get Started?
          </h3>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of businesses that trust our platform for secure cryptocurrency payments. Start accepting crypto today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Icon name="Zap" size={16} className="text-success" />
              <span>5-minute setup</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Icon name="Shield" size={16} className="text-success" />
              <span>Enterprise security</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Icon name="Headphones" size={16} className="text-success" />
              <span>24/7 support</span>
            </div>
          </div>
        </div>
      </div>
    </section>);

};

export default TrustSection;