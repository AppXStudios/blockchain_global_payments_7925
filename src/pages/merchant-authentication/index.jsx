import React, { useState } from 'react';
import PublicHeader from '../../components/ui/PublicHeader';
import AuthHeader from './components/AuthHeader';
import AuthToggle from './components/AuthToggle';
import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegistrationForm';
import TrustSignals from './components/TrustSignals';

const MerchantAuthentication = () => {
  const [isLogin, setIsLogin] = useState(true);

  const handleToggleMode = (loginMode) => {
    setIsLogin(loginMode);
  };

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      
      <main className="flex-1 py-12">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left Column - Form */}
            <div className="w-full max-w-md mx-auto lg:mx-0">
              <AuthHeader isLogin={isLogin} />
              
              <div className="bg-card rounded-2xl p-8 border border-border shadow-lg">
                <AuthToggle isLogin={isLogin} onToggle={handleToggleMode} />
                
                {isLogin ? <LoginForm /> : <RegistrationForm />}
              </div>
            </div>

            {/* Right Column - Trust Signals */}
            <div className="w-full space-y-8">
              <TrustSignals />
              
              {/* Additional Information */}
              <div className="bg-card/30 rounded-xl p-6 border border-border">
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  Why Choose BlockPay?
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">Global Reach</h4>
                      <p className="text-sm text-muted-foreground">
                        Accept payments from customers in 180+ countries with 300+ supported cryptocurrencies
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">Instant Settlement</h4>
                      <p className="text-sm text-muted-foreground">
                        Receive payments instantly with real-time transaction tracking and notifications
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">Enterprise Security</h4>
                      <p className="text-sm text-muted-foreground">
                        Bank-grade security with custody integration and compliance standards
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">Developer Friendly</h4>
                      <p className="text-sm text-muted-foreground">
                        Easy integration with comprehensive APIs, webhooks, and documentation
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-card/30 rounded-xl p-6 border border-border text-center">
                  <div className="text-2xl font-bold text-primary mb-1">$2.5B+</div>
                  <div className="text-sm text-muted-foreground">Processed Volume</div>
                </div>
                <div className="bg-card/30 rounded-xl p-6 border border-border text-center">
                  <div className="text-2xl font-bold text-primary mb-1">99.9%</div>
                  <div className="text-sm text-muted-foreground">Uptime SLA</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MerchantAuthentication;