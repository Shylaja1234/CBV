import { env } from '@/config/env';

type CacheEntry<T> = {
  data: T;
  timestamp: number;
};

class ApiCache {
  private cache: Map<string, CacheEntry<any>>;
  private defaultTTL: number;

  constructor(defaultTTL: number = env.cache.defaultTTL) {
    this.cache = new Map();
    this.defaultTTL = defaultTTL;
  }

  set<T>(key: string, data: T, ttl?: number): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
    };
    this.cache.set(key, entry);

    // Set timeout to remove the entry
    setTimeout(() => {
      this.cache.delete(key);
    }, ttl || this.defaultTTL);
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;
    
    if (!entry) {
      return null;
    }

    // Check if the entry is still valid
    const age = Date.now() - entry.timestamp;
    if (age > this.defaultTTL) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }
}

// Create a singleton instance
export const apiCache = new ApiCache();

// Helper function to generate cache keys
export const generateCacheKey = (
  endpoint: string,
  params?: Record<string, any>
): string => {
  const baseKey = endpoint;
  if (!params) {
    return baseKey;
  }

  const sortedParams = Object.keys(params)
    .sort()
    .reduce((acc, key) => {
      acc[key] = params[key];
      return acc;
    }, {} as Record<string, any>);

  return `${baseKey}:${JSON.stringify(sortedParams)}`;
}; 