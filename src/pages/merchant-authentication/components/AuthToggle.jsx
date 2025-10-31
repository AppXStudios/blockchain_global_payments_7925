import React from 'react';
import Button from '../../../components/ui/Button';

const AuthToggle = ({ isLogin, onToggle }) => {
  return (
    <div className="flex items-center justify-center mb-8">
      <div className="bg-muted rounded-lg p-1 flex">
        <Button
          variant={isLogin ? "default" : "ghost"}
          size="sm"
          onClick={() => onToggle(true)}
          className={`px-6 py-2 text-sm font-medium transition-smooth ${
            isLogin ? 'gradient-primary text-white' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Sign In
        </Button>
        <Button
          variant={!isLogin ? "default" : "ghost"}
          size="sm"
          onClick={() => onToggle(false)}
          className={`px-6 py-2 text-sm font-medium transition-smooth ${
            !isLogin ? 'gradient-primary text-white' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Create Account
        </Button>
      </div>
    </div>
  );
};

export default AuthToggle;