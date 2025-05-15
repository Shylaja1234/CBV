import { apiClient } from './apiClient';
import { ApiResponse } from './types';
import { env } from '../config/env';
import { UserRole } from '@/context/AuthContext';

export type LoginCredentials = {
  email: string;
  password: string;
  role?: UserRole;
};

export type SignupData = {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
};

export type ChangePasswordData = {
  currentPassword: string;
  newPassword: string;
};

export type AuthResponse = {
  message: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    isFirstLogin: boolean;
  };
  token: string;
  refreshToken?: string;
};

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      // Check for admin/staff email patterns
      const isCompanyEmail = credentials.email.endsWith('@connectingbee.in');
      const isAdminEmail = credentials.email === 'admin@connectingbee.in';
      
      // Determine which endpoint to use
      const endpoint = isCompanyEmail ? '/api/auth/admin/login' : '/api/auth/login';
      
      const response = await apiClient.post<AuthResponse>(endpoint, credentials);
      
      // Validate admin email
      if (isAdminEmail && response.data.user.role !== 'ADMIN') {
        throw new Error('This email is reserved for admin access only');
      }
      
      // Validate staff email domain
      if (isCompanyEmail && !isAdminEmail) {
        if (response.data.user.role !== 'STAFF') {
          throw new Error('This email domain is reserved for staff members');
        }
        // Verify that staff email matches their name
        const emailPrefix = credentials.email.split('@')[0];
        if (emailPrefix !== response.data.user.name.toLowerCase().replace(/\s+/g, '')) {
          throw new Error('Staff email must match your registered name');
        }
      }
      
      // If using regular endpoint but got a staff/admin, throw error
      if (!isCompanyEmail && (response.data.user.role === 'STAFF' || response.data.user.role === 'ADMIN')) {
        throw new Error('Please use your company email (@connectingbee.in) to login as staff or admin');
      }
      
      // Store the token immediately after successful login
      localStorage.setItem(env.auth.tokenKey, response.data.token);
      
      return response.data;
    } catch (error: any) {
      if (error?.response?.status === 401) {
        throw new Error('Invalid email or password');
      }
      throw error;
    }
  },

  signup: async (userData: SignupData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/auth/signup', userData);
    return response.data;
  },

  changePassword: async (data: ChangePasswordData): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>('/api/auth/change-password', data);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem(env.auth.tokenKey);
    localStorage.removeItem(env.auth.refreshTokenKey);
    localStorage.removeItem(env.auth.tokenExpiryKey);
    localStorage.removeItem('user');
  },
}; 