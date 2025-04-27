// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REFRESH_TOKEN: '/api/auth/refresh-token',
    REGISTER: '/api/auth/register',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password',
  },
  
  // Product endpoints
  PRODUCTS: {
    BASE: '/api/products',
    BY_ID: (id: number) => `/api/products/${id}`,
    BY_CATEGORY: (categoryId: string) => `/api/products/category/${categoryId}`,
    SEARCH: '/api/products/search',
    FEATURED: '/api/products/featured',
  },
  
  // Category endpoints
  CATEGORIES: {
    BASE: '/api/categories',
    BY_ID: (id: string) => `/api/categories/${id}`,
    PRODUCTS: (id: string) => `/api/categories/${id}/products`,
  },
  
  // User endpoints
  USERS: {
    BASE: '/api/users',
    PROFILE: '/api/users/profile',
    PREFERENCES: '/api/users/preferences',
  },
  
  // Order endpoints
  ORDERS: {
    BASE: '/api/orders',
    BY_ID: (id: string) => `/api/orders/${id}`,
    USER_ORDERS: '/api/orders/user',
    CHECKOUT: '/api/orders/checkout',
  },
  
  // Upload endpoints
  UPLOAD: {
    BASE: '/api/upload',
    IMAGE: '/api/upload/image',
    DOCUMENT: '/api/upload/document',
  },
} as const;

// API Error Codes
export const API_ERROR_CODES = {
  // General errors
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  
  // Auth errors
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  TOKEN_INVALID: 'TOKEN_INVALID',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  EMAIL_ALREADY_EXISTS: 'EMAIL_ALREADY_EXISTS',
  
  // Validation errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  REQUIRED_FIELD: 'REQUIRED_FIELD',
  INVALID_FORMAT: 'INVALID_FORMAT',
  INVALID_LENGTH: 'INVALID_LENGTH',
  
  // Resource errors
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  RESOURCE_ALREADY_EXISTS: 'RESOURCE_ALREADY_EXISTS',
  RESOURCE_IN_USE: 'RESOURCE_IN_USE',
  
  // Permission errors
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
} as const;

// API Response Status
export const API_RESPONSE_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error',
  VALIDATION_ERROR: 'validation_error',
  AUTH_ERROR: 'auth_error',
} as const;

// API Cache Keys
export const API_CACHE_KEYS = {
  PRODUCTS: {
    LIST: 'products:list',
    BY_ID: (id: number) => `products:${id}`,
    BY_CATEGORY: (categoryId: string) => `products:category:${categoryId}`,
    FEATURED: 'products:featured',
  },
  CATEGORIES: {
    LIST: 'categories:list',
    BY_ID: (id: string) => `categories:${id}`,
  },
  USER: {
    PROFILE: 'user:profile',
    PREFERENCES: 'user:preferences',
  },
} as const; 