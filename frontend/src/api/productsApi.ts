import { apiClient } from './apiClient';
import { Product } from '@/data/products';

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
): Promise<PaginatedResponse<Product[]>> => {
  try {
    const response = await apiClient.get('/api/products', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Function to fetch a single product by ID
export const fetchProductById = async (id: number): Promise<ApiResponse<Product>> => {
  try {
    const response = await apiClient.get(`/api/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    throw error;
  }
};

// Function to create a product
export const createProduct = async (product: Omit<Product, 'id'>): Promise<ApiResponse<Product>> => {
  try {
    const response = await apiClient.post('/api/products', product);
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

// Function to update a product
export const updateProduct = async (
  id: number, 
  product: Partial<Product>
): Promise<ApiResponse<Product>> => {
  try {
    const response = await apiClient.put(`/api/products/${id}`, product);
    return response.data;
  } catch (error) {
    console.error(`Error updating product with ID ${id}:`, error);
    throw error;
  }
};

// Function to delete a product
export const deleteProduct = async (id: number): Promise<ApiResponse<boolean>> => {
  try {
    const response = await apiClient.delete(`/api/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting product with ID ${id}:`, error);
    throw error;
  }
};

// Mock implementation for development
export const fetchProductsMock = async (
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
): Promise<PaginatedResponse<Product[]>> => {
  // Import the products data
  const { products } = await import('@/data/products');
  
  // Apply filters (simplified version of what would happen on the backend)
  let filtered = [...products];
  
  // Filter by category
  if (filters.category && filters.category !== 'all') {
    filtered = filtered.filter(product => product.category === filters.category);
  }
  
  // Filter by search term
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(product => {
      return (
        product.title.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        (product.tags && product.tags.some(tag => tag.toLowerCase().includes(searchLower)))
      );
    });
  }
  
  // Filter by price range
  if (filters.priceRange) {
    const [min, max] = filters.priceRange;
    filtered = filtered.filter(product => {
      const price = parseInt(product.price.replace(/[^\d]/g, ''));
      return price >= min * 1000 && price <= max * 1000;
    });
  }
  
  // Sort products
  if (filters.sortBy) {
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-low':
          return parseInt(a.price.replace(/[^\d]/g, '')) - parseInt(b.price.replace(/[^\d]/g, ''));
        case 'price-high':
          return parseInt(b.price.replace(/[^\d]/g, '')) - parseInt(a.price.replace(/[^\d]/g, ''));
        case 'newest':
          return b.id - a.id;
        case 'rating':
          return b.featured ? 1 : -1;
        case 'featured':
        default:
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      }
    });
  }
  
  // Pagination
  const page = filters.page || 1;
  const limit = filters.limit || 10;
  const startIndex = (page - 1) * limit;
  const paginatedProducts = filtered.slice(startIndex, startIndex + limit);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    data: paginatedProducts,
    total: filtered.length,
    page,
    limit,
    status: 200
  };
};
