import { apiClient } from './apiClient';
import { ApiResponse } from './types';

export type StaffUser = {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
};

export const adminApi = {
  // Staff Management
  createStaff: async (staffData: {
    name: string;
    email: string;
    password: string;
  }): Promise<ApiResponse<StaffUser>> => {
    const response = await apiClient.post<ApiResponse<StaffUser>>('/api/admin/staff', staffData);
    return response.data;
  },

  getStaffUsers: async (): Promise<ApiResponse<StaffUser[]>> => {
    const response = await apiClient.get<ApiResponse<StaffUser[]>>('/api/admin/staff');
    return response.data;
  },

  deleteStaff: async (id: number): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/api/admin/staff/${id}`);
    return response.data;
  },
}; 