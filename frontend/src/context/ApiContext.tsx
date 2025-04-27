import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { ApiError } from '@/api/types';
import { apiCache } from '@/api/cache';
import { env } from '@/config/env';

type ApiState = {
  loading: boolean;
  error: ApiError | null;
  lastUpdated: number | null;
};

type ApiAction =
  | { type: 'START_LOADING' }
  | { type: 'SET_ERROR'; error: ApiError }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LAST_UPDATED' };

const initialState: ApiState = {
  loading: false,
  error: null,
  lastUpdated: null,
};

function apiReducer(state: ApiState, action: ApiAction): ApiState {
  switch (action.type) {
    case 'START_LOADING':
      return { ...state, loading: true, error: null };
    case 'SET_ERROR':
      return { ...state, loading: false, error: action.error };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'SET_LAST_UPDATED':
      return { ...state, loading: false, lastUpdated: Date.now() };
    default:
      return state;
  }
}

type ApiContextType = {
  state: ApiState;
  clearError: () => void;
  clearCache: () => void;
  setError: (error: ApiError) => void;
};

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export function ApiProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(apiReducer, initialState);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const setError = useCallback((error: ApiError) => {
    dispatch({ type: 'SET_ERROR', error });
  }, []);

  const clearCache = useCallback(() => {
    apiCache.clear();
    dispatch({ type: 'SET_LAST_UPDATED' });
  }, []);

  const value = {
    state,
    clearError,
    clearCache,
    setError,
  };

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
}

export function useApiContext() {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error('useApiContext must be used within an ApiProvider');
  }
  return context;
}

// Helper hook for handling API errors
export function useApiErrorHandler() {
  const { setError, clearError } = useApiContext();

  const handleError = useCallback(
    (error: unknown) => {
      if (error instanceof ApiError) {
        setError(error);
      } else {
        setError(new ApiError(500, 'An unexpected error occurred'));
      }
    },
    [setError]
  );

  return {
    handleError,
    clearError,
  };
} 