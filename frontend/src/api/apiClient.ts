import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { env } from '@/config/env';
import { ApiError, createApiError } from './types';

// Create axios instance with base configuration
export const apiClient: AxiosInstance = axios.create({
  baseURL: env.api.baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: env.api.timeout,
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = localStorage.getItem(env.auth.tokenKey);
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response) {
      const apiError = createApiError(error);
      
      // Handle specific error codes
      switch (apiError.status) {
        case 401:
          // Handle unauthorized access
          localStorage.removeItem(env.auth.tokenKey);
          localStorage.removeItem(env.auth.refreshTokenKey);
          localStorage.removeItem(env.auth.tokenExpiryKey);
          window.location.href = '/login';
          break;
        case 403:
          // Handle forbidden access
          console.error('Access forbidden:', apiError.message);
          break;
        case 404:
          // Handle not found
          console.error('Resource not found:', apiError.message);
          break;
        case 422:
          // Handle validation errors
          console.error('Validation errors:', apiError.details);
          break;
        case 500:
          // Handle server error
          console.error('Server error:', apiError.message);
          break;
        default:
          console.error('API Error:', apiError);
      }
      
      return Promise.reject(apiError);
    }
    
    // Handle network errors
    return Promise.reject(new ApiError(0, 'Network error'));
  }
); 