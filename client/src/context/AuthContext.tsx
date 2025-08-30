import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/services/auth/auth';

interface EnhancedAuthContext extends ReturnType<typeof useAuth> {
  initialized: boolean;
}

const AuthContext = createContext<EnhancedAuthContext | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const auth = useAuth();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Add any async initialization logic here if needed
        // For example, token validation or user data refresh
      } catch (error) {
        console.error('Auth initialization error', error);
      } finally {
        setInitialized(true);
      }
    };

    initializeAuth();
  }, [auth.token]);

  return (
    <AuthContext.Provider value={{ ...auth, initialized }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuthContext must be used within an AuthProvider");
  return context;
};