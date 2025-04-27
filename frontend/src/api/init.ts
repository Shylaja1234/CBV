import { apiClient } from './apiClient';
import { env } from '@/config/env';
import { API_ENDPOINTS } from '@/constants/api';
import { ApiError } from './types';

// Initialize API service
export function initApiService() {
  // Set default configuration
  apiClient.defaults.baseURL = env.api.baseUrl;
  apiClient.defaults.timeout = env.api.timeout;
  
  // Set default headers
  apiClient.defaults.headers.common['Content-Type'] = 'application/json';
  apiClient.defaults.headers.common['Accept'] = 'application/json';
  
  // Add auth token if available
  const token = localStorage.getItem(env.auth.tokenKey);
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
  
  // Add interceptors
  import('./interceptors');
  
  // Test API connection
  testApiConnection();
}

// Test API connection
async function testApiConnection() {
  try {
    await apiClient.get(API_ENDPOINTS.AUTH.LOGIN);
    console.log('API connection successful');
  } catch (error) {
    console.error('API connection failed:', error);
    
    // If we're in development and using mock data, that's fine
    if (process.env.NODE_ENV === 'development' && env.features.enableMockData) {
      console.log('Using mock data instead');
      return;
    }
    
    // Otherwise, show an error message
    throw new ApiError(
      503,
      'Unable to connect to the API server. Please check your connection and try again.'
    );
  }
}

// Initialize the API service when the app starts
if (typeof window !== 'undefined') {
  initApiService();
} 