import { ApiError } from '@/api/types';
import { env } from '@/config/env';

// Helper function to format API error messages
export function formatApiError(error: ApiError): string {
  if (error.details && Array.isArray(error.details)) {
    return error.details
      .map(detail => `${detail.field}: ${detail.message}`)
      .join('\n');
  }
  return error.message || 'An error occurred';
}

// Helper function to handle API response
export function handleApiResponse<T>(
  response: any,
  onSuccess: (data: T) => void,
  onError: (error: ApiError) => void
) {
  if (response.status >= 200 && response.status < 300) {
    onSuccess(response.data);
  } else {
    onError(new ApiError(response.status, response.data.message));
  }
}

// Helper function to validate API response
export function validateApiResponse<T>(response: any): T {
  if (!response || typeof response !== 'object') {
    throw new ApiError(500, 'Invalid API response');
  }

  if (response.status >= 400) {
    throw new ApiError(response.status, response.message || 'API request failed');
  }

  return response.data;
}

// Helper function to create query string from object
export function createQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach(item => searchParams.append(key, String(item)));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });

  return searchParams.toString();
}

// Helper function to handle file uploads
export async function uploadFile(
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${env.api.baseUrl}/api/upload`);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = (event.loaded / event.total) * 100;
        onProgress?.(progress);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve(response.url);
        } catch (error) {
          reject(new ApiError(500, 'Invalid response format'));
        }
      } else {
        reject(new ApiError(xhr.status, 'Upload failed'));
      }
    };

    xhr.onerror = () => {
      reject(new ApiError(0, 'Network error'));
    };

    xhr.send(formData);
  });
}

// Helper function to handle API timeouts
export function withTimeout<T>(
  promise: Promise<T>,
  timeout: number = env.api.timeout
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new ApiError(408, 'Request timeout')), timeout)
    ),
  ]);
}

// Helper function to retry failed API calls
export async function retry<T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) {
      throw error;
    }
    await new Promise(resolve => setTimeout(resolve, delay));
    return retry(fn, retries - 1, delay * 2);
  }
} 