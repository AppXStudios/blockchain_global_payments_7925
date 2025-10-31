import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import api from '../lib/sdk';

// Create Auth Context
const AuthContext = createContext({
  user: null,
  profile: null,
  merchant: null,
  session: null,
  loading: true,
  signUp: async () => {},
  signIn: async () => {},
  signOut: async () => {},
  refreshProfile: async () => {}
});

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [merchant, setMerchant] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    initializeAuth();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase?.auth?.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      if (session?.user) {
        await handleAuthSuccess(session);
      } else {
        handleAuthLogout();
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  /**
   * Initialize authentication state
   */
  const initializeAuth = async () => {
    try {
      const { data: { session }, error } = await supabase?.auth?.getSession();
      
      if (error) {
        console.error('Session error:', error);
        setLoading(false);
        return;
      }

      if (session?.user) {
        await handleAuthSuccess(session);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      setLoading(false);
    }
  };

  /**
   * Handle successful authentication
   */
  const handleAuthSuccess = async (session) => {
    try {
      setUser(session?.user);
      setSession(session);

      // Store token for SDK usage
      if (session?.access_token) {
        localStorage.setItem('sb-access-token', session?.access_token);
      }

      // Get full user profile and merchant data
      const { data: profileData, error: profileError } = await api?.auth?.me(session?.access_token);

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        setLoading(false);
        return;
      }

      if (profileData?.profile) {
        setProfile(profileData?.profile);
      }

      if (profileData?.merchant) {
        setMerchant(profileData?.merchant);
      }

      setLoading(false);
    } catch (error) {
      console.error('Auth success handler error:', error);
      setLoading(false);
    }
  };

  /**
   * Handle logout/auth clear
   */
  const handleAuthLogout = () => {
    setUser(null);
    setProfile(null);
    setMerchant(null);
    setSession(null);
    setLoading(false);
    
    // Clear stored tokens
    localStorage.removeItem('sb-access-token');
    localStorage.removeItem('bgp_token');
    sessionStorage.removeItem('bgp_token');
  };

  /**
   * Sign up new user
   */
  const signUp = async (signupData) => {
    try {
      setLoading(true);
      
      const { data, error } = await api?.auth?.signup(signupData);

      if (error) {
        setLoading(false);
        throw new Error(error?.error || error?.message || 'Signup failed');
      }

      // Don't automatically sign in - wait for email verification
      setLoading(false);
      return { data, error: null };

    } catch (error) {
      setLoading(false);
      console.error('Signup error:', error);
      throw error;
    }
  };

  /**
   * Sign in user
   */
  const signIn = async (loginData) => {
    try {
      setLoading(true);
      
      const { data, error } = await api?.auth?.login(loginData);

      if (error) {
        setLoading(false);
        throw new Error(error?.error || error?.message || 'Login failed');
      }

      // Auth state change will be handled by the listener
      return { data, error: null };

    } catch (error) {
      setLoading(false);
      console.error('Login error:', error);
      throw error;
    }
  };

  /**
   * Sign out user
   */
  const signOut = async () => {
    try {
      setLoading(true);
      
      // Call API logout endpoint
      if (session?.access_token) {
        await api?.auth?.logout(session?.access_token);
      }

      // Sign out from Supabase
      const { error } = await supabase?.auth?.signOut();
      
      if (error) {
        console.error('Signout error:', error);
      }

      // Clear state will be handled by auth state change listener
      
    } catch (error) {
      console.error('Signout error:', error);
      // Force clear state even if API calls fail
      handleAuthLogout();
    }
  };

  /**
   * Refresh user profile data
   */
  const refreshProfile = async () => {
    try {
      if (!session?.access_token) {
        return;
      }

      const { data: profileData, error } = await api?.auth?.me(session?.access_token);

      if (error) {
        console.error('Profile refresh error:', error);
        return;
      }

      if (profileData?.profile) {
        setProfile(profileData?.profile);
      }

      if (profileData?.merchant) {
        setMerchant(profileData?.merchant);
      }

    } catch (error) {
      console.error('Profile refresh error:', error);
    }
  };

  // Auth context value
  const value = {
    user,
    profile,
    merchant,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    refreshProfile,
    // Helper properties
    isAuthenticated: !!user,
    isMerchant: profile?.role === 'merchant',
    isAdmin: profile?.role === 'admin',
    isSupport: profile?.role === 'support',
    merchantId: merchant?.id || null,
    accessToken: session?.access_token || null
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

// Export context for advanced usage
export { AuthContext };
export default AuthProvider;