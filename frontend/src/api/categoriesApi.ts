import { apiClient } from './apiClient';
import { Category } from '@/data/products';
import { ApiResponse } from './productsApi';

// Function to fetch all categories
export const fetchCategories = async (): Promise<ApiResponse<Category[]>> => {
  try {
    const response = await apiClient.get('/api/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// Function to fetch a single category by ID
export const fetchCategoryById = async (id: string): Promise<ApiResponse<Category>> => {
  try {
    const response = await apiClient.get(`/api/categories/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching category with ID ${id}:`, error);
    throw error;
  }
};

// Function to create a category
export const createCategory = async (category: Omit<Category, 'id'>): Promise<ApiResponse<Category>> => {
  try {
    const response = await apiClient.post('/api/categories', category);
    return response.data;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

// Function to update a category
export const updateCategory = async (
  id: string,
  category: Partial<Category>
): Promise<ApiResponse<Category>> => {
  try {
    const response = await apiClient.put(`/api/categories/${id}`, category);
    return response.data;
  } catch (error) {
    console.error(`Error updating category with ID ${id}:`, error);
    throw error;
  }
};

// Function to delete a category
export const deleteCategory = async (id: string): Promise<ApiResponse<boolean>> => {
  try {
    const response = await apiClient.delete(`/api/categories/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting category with ID ${id}:`, error);
    throw error;
  }
};

// Mock implementation for development
export const fetchCategoriesMock = async (): Promise<ApiResponse<Category[]>> => {
  // Import the categories data
  const { categories } = await import('@/data/products');
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return {
    data: categories,
    status: 200
  };
};
