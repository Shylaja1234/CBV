import { apiClient } from '@/api/apiClient';
import { ApiError } from '@/api/types';
import { API_ERROR_CODES } from '@/constants/api';
import { env } from '@/config/env';

// Middleware to handle token refresh
export const tokenRefreshMiddleware = async (error: any) => {
  const originalRequest = error.config;
  
  // If the error is 401 and we haven't already tried to refresh the token
  if (error.response?.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;
    
    try {
      // Get the refresh token from localStorage
      const refreshToken = localStorage.getItem(env.auth.refreshTokenKey);
      
      if (!refreshToken) {
        throw new ApiError(401, 'No refresh token available', API_ERROR_CODES.TOKEN_INVALID);
      }
      
      // Try to refresh the token
      const response = await apiClient.post('/api/auth/refresh-token', {
        refreshToken,
      });
      
      // Update the tokens in localStorage
      localStorage.setItem(env.auth.tokenKey, response.data.accessToken);
      localStorage.setItem(env.auth.refreshTokenKey, response.data.refreshToken);
      
      // Update the Authorization header
      originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
      
      // Retry the original request
      return apiClient(originalRequest);
    } catch (refreshError) {
      // If refresh fails, clear tokens and redirect to login
      localStorage.removeItem(env.auth.tokenKey);
      localStorage.removeItem(env.auth.refreshTokenKey);
      localStorage.removeItem(env.auth.tokenExpiryKey);
      window.location.href = '/login';
      throw refreshError;
    }
  }
  
  return Promise.reject(error);
};

// Middleware to handle rate limiting
export const rateLimitMiddleware = async (config: any) => {
  // Get the current timestamp
  const now = Date.now();
  
  // Get the last request timestamp from localStorage
  const lastRequest = localStorage.getItem('lastApiRequest');
  const lastRequestTime = lastRequest ? parseInt(lastRequest) : 0;
  
  // Calculate the time since the last request
  const timeSinceLastRequest = now - lastRequestTime;
  
  // If less than 1 second has passed since the last request, wait
  if (timeSinceLastRequest < 1000) {
    await new Promise(resolve => setTimeout(resolve, 1000 - timeSinceLastRequest));
  }
  
  // Update the last request timestamp
  localStorage.setItem('lastApiRequest', now.toString());
  
  return config;
};

// Middleware to handle request logging
export const loggingMiddleware = async (config: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, {
      params: config.params,
      data: config.data,
    });
  }
  return config;
};

// Middleware to handle response logging
export const responseLoggingMiddleware = (response: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
      status: response.status,
      data: response.data,
    });
  }
  return response;
};

// Middleware to handle error logging
export const errorLoggingMiddleware = (error: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.error(`API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
      status: error.response?.status,
      data: error.response?.data,
    });
  }
  return Promise.reject(error);
};

// Middleware to handle request cancellation
export const cancellationMiddleware = (config: any) => {
  // Generate a unique ID for this request
  const requestId = `${config.method}-${config.url}-${Date.now()}`;
  
  // Store the request ID in the config
  config.requestId = requestId;
  
  // Create an AbortController for this request
  const controller = new AbortController();
  config.signal = controller.signal;
  
  // Store the controller in a global map
  window.apiControllers = window.apiControllers || new Map();
  window.apiControllers.set(requestId, controller);
  
  return config;
};

// Middleware to handle request cleanup
export const cleanupMiddleware = (response: any) => {
  const requestId = response.config.requestId;
  
  // Remove the controller from the global map
  if (window.apiControllers) {
    window.apiControllers.delete(requestId);
  }
  
  return response;
};

// Type declaration for the global controllers map
declare global {
  interface Window {
    apiControllers?: Map<string, AbortController>;
  }
} 