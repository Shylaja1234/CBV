import React, { createContext, useContext, useState, useEffect } from "react";
import { authApi, LoginCredentials, SignupData, AuthResponse } from '@/api/authApi';
import { env } from '@/config/env';

export type UserRole = "ADMIN" | "STAFF" | "USER";

export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  requirePasswordChange?: boolean;
  department?: string;
  isFirstLogin?: boolean;
}

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<string>;
  signup: (userData: SignupData) => Promise<void>;
  logout: () => void;
  updateUserInfo: (updatedUser: User) => void;
};

// Demo users for testing
const demoUsers: User[] = [
  { id: 1, email: "admin@example.com", name: "Admin User", role: "ADMIN" },
  { id: 2, email: "staff@example.com", name: "Staff User", role: "STAFF" },
  { id: 3, email: "user@example.com", name: "Regular User", role: "USER" },
];

// Create context with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing token and validate it
    const token = localStorage.getItem(env.auth.tokenKey);
    if (token) {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        } catch (err) {
          console.error('Error parsing user data:', err);
          // Clear invalid data
          localStorage.removeItem(env.auth.tokenKey);
          localStorage.removeItem('user');
        }
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials): Promise<string> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authApi.login(credentials);
      
      if (!response.token || !response.user) {
        throw new Error('Invalid response from server');
      }

      // Store auth data using environment config keys
      localStorage.setItem(env.auth.tokenKey, response.token);
      if (response.refreshToken) {
        localStorage.setItem(env.auth.refreshTokenKey, response.refreshToken);
      }
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);

      // Check if this is a first-time login for staff
      if (response.user.role === 'STAFF' && response.user.isFirstLogin) {
        return '/auth/first-time-password';
      }

      // Determine redirect path based on role
      switch (response.user.role) {
        case 'ADMIN':
          return '/admin/dashboard';
        case 'STAFF':
          return '/staff/dashboard';
        default:
          return '/';
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: SignupData): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authApi.signup({
        ...userData,
        role: userData.role || 'USER'
      });
      
      if (!response.token || !response.user) {
        throw new Error('Invalid response from server');
      }

      localStorage.setItem(env.auth.tokenKey, response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Signup failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authApi.logout();
    localStorage.removeItem(env.auth.tokenKey);
    localStorage.removeItem(env.auth.refreshTokenKey);
    localStorage.removeItem(env.auth.tokenExpiryKey);
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateUserInfo = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    signup,
    logout,
    updateUserInfo,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
