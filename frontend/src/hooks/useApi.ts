import { useState, useCallback, useEffect } from 'react';
import { apiCache, generateCacheKey } from '@/api/cache';
import { ApiError, ApiResponse } from '@/api/types';
import { env } from '@/config/env';

type ApiState<T> = {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
};

type UseApiOptions = {
  cacheKey?: string;
  cacheTTL?: number;
  enabled?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: ApiError) => void;
};

export function useApi<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  options: UseApiOptions = {}
) {
  const {
    cacheKey,
    cacheTTL,
    enabled = true,
    onSuccess,
    onError,
  } = options;

  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    // Check cache if cacheKey is provided
    if (cacheKey) {
      const cachedData = apiCache.get<T>(cacheKey);
      if (cachedData) {
        setState(prev => ({ ...prev, data: cachedData }));
        return;
      }
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await apiCall();
      
      // Cache the response if cacheKey is provided
      if (cacheKey) {
        apiCache.set(cacheKey, response.data, cacheTTL);
      }

      setState(prev => ({
        ...prev,
        data: response.data,
        loading: false,
      }));

      onSuccess?.(response.data);
    } catch (error) {
      const apiError = error as ApiError;
      setState(prev => ({
        ...prev,
        error: apiError,
        loading: false,
      }));
      onError?.(apiError);
    }
  }, [apiCall, cacheKey, cacheTTL, enabled, onSuccess, onError]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    if (cacheKey) {
      apiCache.delete(cacheKey);
    }
    fetchData();
  }, [fetchData, cacheKey]);

  return {
    ...state,
    refetch,
  };
}

// Helper hook for paginated data
export function usePaginatedApi<T>(
  apiCall: (page: number, limit: number) => Promise<ApiResponse<T[]>>,
  options: UseApiOptions & {
    initialPage?: number;
    initialLimit?: number;
  } = {}
) {
  const {
    initialPage = 1,
    initialLimit = env.pagination.defaultPageSize,
    ...apiOptions
  } = options;

  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const { data, loading, error, refetch } = useApi<T[]>(
    () => apiCall(page, limit),
    {
      ...apiOptions,
      cacheKey: apiOptions.cacheKey 
        ? generateCacheKey(apiOptions.cacheKey, { page, limit })
        : undefined,
    }
  );

  const nextPage = useCallback(() => {
    setPage(prev => prev + 1);
  }, []);

  const prevPage = useCallback(() => {
    setPage(prev => Math.max(1, prev - 1));
  }, []);

  const setPageSize = useCallback((newLimit: number) => {
    setLimit(Math.min(newLimit, env.pagination.maxPageSize));
    setPage(1); // Reset to first page when changing page size
  }, []);

  return {
    data,
    loading,
    error,
    refetch,
    page,
    limit,
    nextPage,
    prevPage,
    setPage,
    setPageSize,
  };
} 