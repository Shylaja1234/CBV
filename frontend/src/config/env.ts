// Environment configuration
export const env = {
  // API Configuration
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://cbv-dxnm.onrender.com',
    timeout: 10000,
  },
  
  // Feature flags
  features: {
    enableMockData: import.meta.env.VITE_ENABLE_MOCK_DATA === 'true',
    enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  },
  
  // Authentication
  auth: {
    tokenKey: 'authToken',
    refreshTokenKey: 'refreshToken',
    tokenExpiryKey: 'tokenExpiry',
  },
  
  // Pagination defaults
  pagination: {
    defaultPageSize: 10,
    maxPageSize: 100,
  },
  
  // Cache configuration
  cache: {
    defaultTTL: 5 * 60 * 1000, // 5 minutes
  },
  
  google: {
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
    developerKey: import.meta.env.VITE_GOOGLE_DEVELOPER_KEY || '',
  },
} as const; 