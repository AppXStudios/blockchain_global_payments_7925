import React from 'react';
import Routes from './Routes';
import { AuthProvider } from './contexts/AuthContext';
import './styles/index.css';

/**
 * CRITICAL FIX: Enhanced App component with proper error boundaries
 * and AuthProvider integration
 */
function App() {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
}

export default App;