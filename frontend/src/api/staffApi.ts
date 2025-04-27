import { apiClient } from './apiClient';
import { ApiResponse } from './types';
import { UserRole } from '@/context/AuthContext';

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  createdAt: string;
  updatedAt: string;
};

export type Pricing = {
  id: number;
  productId: number;
  basePrice: number;
  discount: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
};

export interface StaffMember {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: 'ACTIVE' | 'INACTIVE';
  department: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStaffData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  department: string;
}

export interface UpdateStaffData {
  name?: string;
  email?: string;
  department?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export const staffApi = {
  // Product Management
  getProducts: async (): Promise<ApiResponse<Product[]>> => {
    const response = await apiClient.get<ApiResponse<Product[]>>('/api/staff/products');
    return response.data;
  },

  createProduct: async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Product>> => {
    const response = await apiClient.post<ApiResponse<Product>>('/api/staff/products', productData);
    return response.data;
  },

  updateProduct: async (id: number, productData: Partial<Product>): Promise<ApiResponse<Product>> => {
    const response = await apiClient.put<ApiResponse<Product>>(`/api/staff/products/${id}`, productData);
    return response.data;
  },

  deleteProduct: async (id: number): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/api/staff/products/${id}`);
    return response.data;
  },

  // Pricing Management
  getPricing: async (productId: number): Promise<ApiResponse<Pricing[]>> => {
    const response = await apiClient.get<ApiResponse<Pricing[]>>(`/api/staff/pricing/${productId}`);
    return response.data;
  },

  createPricing: async (pricingData: Omit<Pricing, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Pricing>> => {
    const response = await apiClient.post<ApiResponse<Pricing>>('/api/staff/pricing', pricingData);
    return response.data;
  },

  updatePricing: async (id: number, pricingData: Partial<Pricing>): Promise<ApiResponse<Pricing>> => {
    const response = await apiClient.put<ApiResponse<Pricing>>(`/api/staff/pricing/${id}`, pricingData);
    return response.data;
  },

  deletePricing: async (id: number): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/api/staff/pricing/${id}`);
    return response.data;
  },

  // Get all staff members
  getAllStaff: async (): Promise<StaffMember[]> => {
    const response = await apiClient.get<StaffMember[]>('/api/admin/staff');
    return response.data.map(staff => ({
      ...staff,
      department: staff.department || 'Not Assigned',
      status: staff.status as 'ACTIVE' | 'INACTIVE'
    }));
  },

  // Create a new staff member
  createStaff: async (data: CreateStaffData): Promise<StaffMember> => {
    const response = await apiClient.post<StaffMember>('/api/admin/staff', data);
    return {
      ...response.data,
      department: response.data.department || 'Not Assigned',
      status: response.data.status as 'ACTIVE' | 'INACTIVE'
    };
  },

  // Update a staff member
  updateStaff: async (id: number, data: UpdateStaffData): Promise<StaffMember> => {
    const response = await apiClient.put<StaffMember>(`/api/admin/staff/${id}`, data);
    return {
      ...response.data,
      department: response.data.department || 'Not Assigned',
      status: response.data.status as 'ACTIVE' | 'INACTIVE'
    };
  },

  // Delete a staff member
  deleteStaff: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/admin/staff/${id}`);
  },

  // Toggle staff member status
  toggleStatus: async (id: number): Promise<StaffMember> => {
    const response = await apiClient.patch<StaffMember>(`/api/admin/staff/${id}/toggle-status`);
    return response.data;
  },

  // Change password
  changePassword: async (data: ChangePasswordData): Promise<ApiResponse<void>> => {
    const response = await apiClient.post<ApiResponse<void>>('/api/auth/change-password', data);
    return response.data;
  }
}; 