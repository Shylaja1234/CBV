import api from "@/lib/axios";
import { env } from '@/config/env';

interface UpdateProfileData {
  name: string;
  email: string;
}

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export const userApi = {
  // Get current user profile
  getProfile: async () => {
    try {
      const response = await api.get("/api/users/profile");
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (data: UpdateProfileData) => {
    try {
      const token = localStorage.getItem(env.auth.tokenKey);
      
      const response = await api.put("/api/users/profile", data);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  // Change user password
  changePassword: async (data: ChangePasswordData) => {
    try {
      const response = await api.put("/api/users/change-password", data);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  // Address CRUD
  getAddresses: async () => {
    const response = await api.get('/api/users/addresses');
    return response.data;
  },
  addAddress: async (data: any) => {
    const response = await api.post('/api/users/addresses', data);
    return response.data;
  },
  updateAddress: async (id: number, data: any) => {
    const response = await api.put(`/api/users/addresses/${id}`, data);
    return response.data;
  },
  deleteAddress: async (id: number) => {
    const response = await api.delete(`/api/users/addresses/${id}`);
    return response.data;
  },

  // Order history
  getOrders: async () => {
    const response = await api.get('/api/orders/user');
    return response.data;
  },
  getOrderById: async (id: number) => {
    const response = await api.get(`/api/orders/${id}`);
    return response.data;
  },

  // Razorpay payment
  createRazorpayOrder: async (amount: number) => {
    const response = await api.post('/api/orders/create-razorpay-order', { amount });
    return response.data;
  },
  checkout: async (data: any) => {
    const response = await api.post('/api/orders/checkout', data);
    return response.data;
  },
};

export type { UpdateProfileData, ChangePasswordData }; 