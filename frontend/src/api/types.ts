// API Response Types
export type ApiResponse<T> = {
  data: T;
  message?: string;
  status: number;
};

export type PaginatedResponse<T> = ApiResponse<T> & {
  total: number;
  page: number;
  limit: number;
};

// API Error Types
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export type ValidationError = {
  field: string;
  message: string;
  code: string;
};

export type ApiErrorResponse = {
  status: number;
  message: string;
  code?: string;
  errors?: ValidationError[];
};

// API Request Types
export type PaginationParams = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
};

export type FilterParams = {
  search?: string;
  [key: string]: any;
};

// API Response Helper Functions
export const isApiError = (error: any): error is ApiError => {
  return error instanceof ApiError;
};

export const createApiError = (error: any): ApiError => {
  if (error.response) {
    const { status, data } = error.response;
    return new ApiError(
      status,
      data.message || 'An error occurred',
      data.code,
      data.errors
    );
  }
  return new ApiError(500, 'Network error');
}; 