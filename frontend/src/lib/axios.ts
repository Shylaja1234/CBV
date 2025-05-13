import axios from "axios";
import { env } from '@/config/env';

// Create axios instance with custom config
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://cbv-dxnm.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Required for cookies, authorization headers with HTTPS
});

// Track failed refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

// Add a request interceptor
instance.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.url, {
      method: config.method,
      data: config.data,
      headers: config.headers
    });

    // Get token from localStorage using environment config key
    const token = localStorage.getItem(env.auth.tokenKey);
    
    // If token exists, add it to request headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Added token to request headers');
    } else {
      console.log('No token found in localStorage');
    }

    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  (response) => {
    console.log('Response received:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle network errors
    if (!error.response) {
      console.error('Network Error:', {
        error,
        config: error.config
      });
      return Promise.reject(new Error('Network error occurred. Please check your connection.'));
    }

    console.error('Response error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      error: error.message
    });

    // If the error status is 401 and we haven't tried to refresh the token yet
    if (error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If we're already refreshing, add this request to the queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => instance(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log('Attempting to refresh token...');
        const response = await instance.post("/api/auth/refresh");
        const { token } = response.data;

        localStorage.setItem(env.auth.tokenKey, token);
        instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        originalRequest.headers.Authorization = `Bearer ${token}`;

        console.log('Token refreshed successfully');
        processQueue();
        return instance(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        processQueue(refreshError);
        
        // Only redirect to login if it's a refresh token request that failed
        if (originalRequest.url === '/api/auth/refresh') {
          console.log('Refresh token request failed, logging out...');
          localStorage.removeItem(env.auth.tokenKey);
          localStorage.removeItem(env.auth.refreshTokenKey);
          localStorage.removeItem(env.auth.tokenExpiryKey);
          localStorage.removeItem('user');
          window.location.href = "/login";
        }
        
        return Promise.reject({
          ...error,
          message: 'Your session has expired. Please try again.'
        });
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default instance; 