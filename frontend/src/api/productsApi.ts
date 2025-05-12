import { apiClient } from './apiClient';

// TODO: Replace with actual role check from auth context or user state
const isStaffOrAdmin = () => {
  // Example: return user?.role === 'STAFF' || user?.role === 'ADMIN';
  return false; // Default to false for now
};

// Type for actual backend product data structure (for fetch responses)
// This should ideally align with what the backend GET /api/staff/products actually returns.
// For now, let's assume it returns something similar to the Prisma model.
export interface BackendProduct {
  id: number;
  name: string;
  description?: string | null; // Prisma schema has String?
  price: number;          // Prisma schema has Float
  stock: number;          // Prisma schema has Int
  category?: string | null; // Prisma schema has String?
  imageUrl?: string | null;
  createdAt: string; // Assuming DateTime becomes string
  updatedAt: string; // Assuming DateTime becomes string
  // pricing?: any[]; // If pricing is included, define its type
}

// Type for product payload for POST/PUT requests
export interface ProductInput {
  name: string;
  description?: string | null;
  price: number;
  stock: number;
  category?: string | null;
  imageUrl?: string | null;
}

// Types for API responses
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

// Function to fetch products with filters
export const fetchProducts = async (
  filters: {
    category?: string;
    search?: string;
    sortBy?: string;
    priceRange?: [number, number];
    ratings?: string[];
    brands?: string[];
    page?: number;
    limit?: number;
  } = {}
): Promise<PaginatedResponse<BackendProduct[]>> => {
  try {
    const endpoint = isStaffOrAdmin() ? '/api/staff/products' : '/api/products';
    const response = await apiClient.get<PaginatedResponse<BackendProduct[]>>(endpoint, { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Function to fetch a single product by ID
export const fetchProductById = async (id: number): Promise<ApiResponse<BackendProduct>> => {
  try {
    const endpoint = isStaffOrAdmin() ? `/api/staff/products/${id}` : `/api/products/${id}`;
    const response = await apiClient.get<ApiResponse<BackendProduct>>(endpoint);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    throw error;
  }
};

// Function to create a product
export const createProduct = async (product: any): Promise<ApiResponse<BackendProduct>> => {
  try {
    const response = await apiClient.post('/api/staff/products', product);
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

// Function to update a product
export const updateProduct = async (
  id: number, 
  product: Partial<any>
): Promise<ApiResponse<BackendProduct>> => {
  try {
    const response = await apiClient.put(`/api/staff/products/${id}`, product);
    return response.data;
  } catch (error) {
    console.error(`Error updating product with ID ${id}:`, error);
    throw error;
  }
};

// Function to delete a product
export const deleteProduct = async (id: number): Promise<ApiResponse<boolean>> => {
  try {
    const response = await apiClient.delete(`/api/staff/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting product with ID ${id}:`, error);
    throw error;
  }
};
