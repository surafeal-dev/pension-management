import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check authentication status on initial load
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      const isAuth = localStorage.getItem('isAuthenticated') === 'true';
      
      if (token && isAuth) {
        setIsAuthenticated(true);
        // If on login page, redirect to registration
        if (window.location.pathname === '/login') {
          navigate('/registration', { replace: true });
        }
      } else {
        // Clear any invalid auth state
        localStorage.removeItem('authToken');
        localStorage.removeItem('isAuthenticated');
        setIsAuthenticated(false);
        if (window.location.pathname !== '/login') {
          navigate('/login', { replace: true });
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [navigate]);

  useEffect(() => {
    // Check if we have an auth token in localStorage
    const token = localStorage.getItem('authToken');
    if (token) {
      // Here you might want to validate the token with your backend
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Replace this with your actual authentication logic
      // For demo purposes, we'll simulate an API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Simulate successful login
      if (username === 'admin' && password === 'admin') {
        localStorage.setItem('authToken', 'dummy-token');
        localStorage.setItem('isAuthenticated', 'true');
        setIsAuthenticated(true);
        // Redirect to registration after successful login
        navigate('/registration');
      } else {
        throw new Error('Invalid username or password');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Clear all auth related data
      localStorage.removeItem('authToken');
      localStorage.removeItem('isAuthenticated');
      
      // Update state
      setIsAuthenticated(false);
      
      // Navigate to login page
      navigate('/login', { replace: true });
      
      // Force a full page reload to ensure clean state
      window.location.reload();
    } catch (error) {
      console.error('Error during logout:', error);
      // Still redirect to login even if there's an error
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
