import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AuthHeader = ({ isLogin }) => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/landing-page');
  };

  return (
    <div className="text-center space-y-4 mb-8">
      {/* Logo */}
      <div className="flex items-center justify-center space-x-3 mb-6">
        <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
          <Icon name="Zap" size={28} color="white" />
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-bold text-foreground">BlockPay</span>
          <span className="text-sm text-muted-foreground">Global Payments</span>
        </div>
      </div>

      {/* Title and Description */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          {isLogin ? 'Welcome Back' : 'Get Started'}
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          {isLogin 
            ? 'Sign in to your merchant account to manage payments and track transactions' :'Create your merchant account to start accepting cryptocurrency payments globally'
          }
        </p>
      </div>

      {/* Back to Home Button */}
      <div className="flex justify-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBackToHome}
          className="text-muted-foreground hover:text-foreground"
        >
          <Icon name="ArrowLeft" size={16} className="mr-2" />
          Back to Home
        </Button>
      </div>
    </div>
  );
};

export default AuthHeader;