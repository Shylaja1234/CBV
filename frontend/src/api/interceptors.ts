import { apiClient } from './apiClient';
import {
  tokenRefreshMiddleware,
  rateLimitMiddleware,
  loggingMiddleware,
  responseLoggingMiddleware,
  errorLoggingMiddleware,
  cancellationMiddleware,
  cleanupMiddleware,
} from '@/middleware/apiMiddleware';
import { env } from '@/config/env';

// Request interceptors
apiClient.interceptors.request.use(
  async (config) => {
    // Apply rate limiting
    config = await rateLimitMiddleware(config);
    
    // Apply request logging
    config = await loggingMiddleware(config);
    
    // Apply request cancellation
    config = cancellationMiddleware(config);
    
    // Add auth token if available
    const token = localStorage.getItem(env.auth.tokenKey);
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptors
apiClient.interceptors.response.use(
  (response) => {
    // Apply response logging
    response = responseLoggingMiddleware(response);
    
    // Apply cleanup
    response = cleanupMiddleware(response);
    
    return response;
  },
  async (error) => {
    // Apply error logging
    error = errorLoggingMiddleware(error);
    
    // Try to refresh token if 401
    try {
      return await tokenRefreshMiddleware(error);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  }
);

// Helper function to cancel all pending requests
export function cancelAllPendingRequests() {
  if (window.apiControllers) {
    window.apiControllers.forEach((controller) => {
      controller.abort();
    });
    window.apiControllers.clear();
  }
}

// Helper function to cancel a specific request
export function cancelRequest(requestId: string) {
  if (window.apiControllers) {
    const controller = window.apiControllers.get(requestId);
    if (controller) {
      controller.abort();
      window.apiControllers.delete(requestId);
    }
  }
}

// Add cancelAllPendingRequests to window.onbeforeunload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    cancelAllPendingRequests();
  });
} 