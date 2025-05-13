import { apiClient } from './apiClient';

interface Category {
  id: string;
  name: string;
}

// Function to fetch all categories
export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await apiClient.get<Category[]>('/api/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// Function to fetch a single category by ID
export const fetchCategoryById = async (id: string): Promise<Category> => {
  try {
    const response = await apiClient.get<Category>(`/api/categories/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching category with ID ${id}:`, error);
    throw error;
  }
};

// Function to create a category
export const createCategory = async (category: Omit<Category, 'id'>): Promise<Category> => {
  try {
    const response = await apiClient.post<Category>('/api/categories', category);
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
): Promise<Category> => {
  try {
    const response = await apiClient.put<Category>(`/api/categories/${id}`, category);
    return response.data;
  } catch (error) {
    console.error(`Error updating category with ID ${id}:`, error);
    throw error;
  }
};

// Function to delete a category
export const deleteCategory = async (id: string): Promise<boolean> => {
  try {
    const response = await apiClient.delete<boolean>(`/api/categories/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting category with ID ${id}:`, error);
    throw error;
  }
};
