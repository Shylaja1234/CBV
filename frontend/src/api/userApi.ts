import axios from "@/lib/axios";
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
      console.log('Getting user profile...');
      const response = await axios.get("/api/users/profile");
      console.log('Profile response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error getting profile:', {
        error,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data
      });
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (data: UpdateProfileData) => {
    try {
      console.log('Updating profile with data:', data);
      const token = localStorage.getItem(env.auth.tokenKey);
      console.log('Auth token present:', !!token);
      
      const response = await axios.put("/api/users/profile", data);
      console.log('Update response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error updating profile:', {
        error,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data
      });
      throw error;
    }
  },

  // Change user password
  changePassword: async (data: ChangePasswordData) => {
    try {
      console.log('Changing password...');
      const response = await axios.put("/api/users/change-password", data);
      console.log('Password change response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error changing password:', {
        error,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data
      });
      throw error;
    }
  },

  // Address CRUD
  getAddresses: async () => {
    const response = await axios.get('/api/users/addresses');
    return response.data;
  },
  addAddress: async (data: any) => {
    const response = await axios.post('/api/users/addresses', data);
    return response.data;
  },
  updateAddress: async (id: number, data: any) => {
    const response = await axios.put(`/api/users/addresses/${id}`, data);
    return response.data;
  },
  deleteAddress: async (id: number) => {
    const response = await axios.delete(`/api/users/addresses/${id}`);
    return response.data;
  },

  // Order history
  getOrders: async () => {
    const response = await axios.get('/api/orders/user');
    return response.data;
  },
  getOrderById: async (id: number) => {
    const response = await axios.get(`/api/orders/${id}`);
    return response.data;
  },

  // Razorpay payment
  createRazorpayOrder: async (amount: number) => {
    const response = await axios.post('/api/orders/create-razorpay-order', { amount });
    return response.data;
  },
  checkout: async (data: any) => {
    const response = await axios.post('/api/orders/checkout', data);
    return response.data;
  },
};

export type { UpdateProfileData, ChangePasswordData }; 