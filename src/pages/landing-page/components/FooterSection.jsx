import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FooterSection = () => {
  const navigate = useNavigate();
  const currentYear = new Date()?.getFullYear();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleScrollTo = (href) => {
    if (href?.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const footerSections = [
    {
      title: "Product",
      links: [
        { label: "Features", path: "/#features", action: () => handleScrollTo('#features') },
        { label: "Pricing", path: "/pricing", action: () => handleNavigation('/pricing') },
        { label: "API Documentation", path: "/docs", action: () => handleNavigation('/docs') },
        { label: "Integration Guide", path: "/docs", action: () => handleNavigation('/docs') }
      ]
    },
    {
      title: "Company",
      links: [
        { label: "About Us", path: "/#about", action: () => handleScrollTo('#about') },
        { label: "Careers", path: "/contact", action: () => handleNavigation('/contact') },
        { label: "Press Kit", path: "/contact", action: () => handleNavigation('/contact') },
        { label: "Contact", path: "/contact", action: () => handleNavigation('/contact') }
      ]
    },
    {
      title: "Resources",
      links: [
        { label: "Help Center", path: "/contact", action: () => handleNavigation('/contact') },
        { label: "Developer Docs", path: "/docs", action: () => handleNavigation('/docs') },
        { label: "Status Page", path: "/contact", action: () => handleNavigation('/contact') },
        { label: "Blog", path: "/docs", action: () => handleNavigation('/docs') }
      ]
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", path: "/legal/privacy", action: () => handleNavigation('/legal/privacy') },
        { label: "Terms of Service", path: "/legal/terms", action: () => handleNavigation('/legal/terms') },
        { label: "Cookie Policy", path: "/legal/privacy", action: () => handleNavigation('/legal/privacy') },
        { label: "Compliance", path: "/legal/terms", action: () => handleNavigation('/legal/terms') }
      ]
    }
  ];

  const socialLinks = [
    { name: "Twitter", icon: "Twitter", href: "https://twitter.com" },
    { name: "LinkedIn", icon: "Linkedin", href: "https://linkedin.com" },
    { name: "GitHub", icon: "Github", href: "https://github.com" },
    { name: "Discord", icon: "MessageCircle", href: "https://discord.com" }
  ];

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              {/* Logo */}
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                  <Icon name="Zap" size={24} color="white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-foreground">BlockPay</span>
                  <span className="text-sm text-muted-foreground">Global Payments</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-muted-foreground mb-6 max-w-md">
                Enterprise-grade cryptocurrency payment processing platform supporting 300+ currencies across 180+ countries with instant settlements and advanced security.
              </p>

              {/* Newsletter Signup */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-foreground mb-3">
                  Stay Updated
                </h4>
                <div className="flex space-x-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <Button variant="default" size="sm" className="gradient-primary">
                    Subscribe
                  </Button>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex items-center space-x-4">
                {socialLinks?.map((social) => (
                  <a
                    key={social?.name}
                    href={social?.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-smooth flex items-center justify-center group"
                  >
                    <Icon 
                      name={social?.icon} 
                      size={18} 
                      className="group-hover:scale-110 transition-smooth" 
                    />
                  </a>
                ))}
              </div>
            </div>

            {/* Footer Links */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {footerSections?.map((section) => (
                  <div key={section?.title}>
                    <h4 className="text-sm font-semibold text-foreground mb-4">
                      {section?.title}
                    </h4>
                    <ul className="space-y-3">
                      {section?.links?.map((link) => (
                        <li key={link?.label}>
                          <button
                            onClick={link?.action}
                            className="text-sm text-muted-foreground hover:text-foreground transition-micro"
                          >
                            {link?.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border py-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-sm text-muted-foreground">
              © {currentYear} BlockPay Global Payments. All rights reserved.
            </div>

            {/* Security Badges */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Icon name="Shield" size={16} className="text-success" />
                <span className="text-xs text-muted-foreground">SOC 2 Certified</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Lock" size={16} className="text-success" />
                <span className="text-xs text-muted-foreground">256-bit SSL</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="CheckCircle" size={16} className="text-success" />
                <span className="text-xs text-muted-foreground">99.9% Uptime</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleNavigation('/login')}
              >
                Sign In
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => handleNavigation('/signup')}
                className="gradient-primary"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;