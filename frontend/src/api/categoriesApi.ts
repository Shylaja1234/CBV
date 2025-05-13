import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '@/constants/api';

interface Category {
  id: string;
  name: string;
}

// Function to fetch all categories
export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await apiClient.get<Category[]>(API_ENDPOINTS.CATEGORIES.BASE);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

// Function to fetch a single category by ID
export const fetchCategoryById = async (id: string): Promise<Category | null> => {
  try {
    const response = await apiClient.get<Category>(API_ENDPOINTS.CATEGORIES.BY_ID(id));
    return response.data;
  } catch (error) {
    console.error(`Error fetching category with ID ${id}:`, error);
    return null;
  }
};

// Function to create a category
export const createCategory = async (category: Omit<Category, 'id'>): Promise<Category | null> => {
  try {
    const response = await apiClient.post<Category>(API_ENDPOINTS.CATEGORIES.BASE, category);
    return response.data;
  } catch (error) {
    console.error('Error creating category:', error);
    return null;
  }
};

// Function to update a category
export const updateCategory = async (
  id: string,
  category: Partial<Category>
): Promise<Category | null> => {
  try {
    const response = await apiClient.put<Category>(API_ENDPOINTS.CATEGORIES.BY_ID(id), category);
    return response.data;
  } catch (error) {
    console.error(`Error updating category with ID ${id}:`, error);
    return null;
  }
};

// Function to delete a category
export const deleteCategory = async (id: string): Promise<boolean> => {
  try {
    await apiClient.delete(API_ENDPOINTS.CATEGORIES.BY_ID(id));
    return true;
  } catch (error) {
    console.error(`Error deleting category with ID ${id}:`, error);
    return false;
  }
};
