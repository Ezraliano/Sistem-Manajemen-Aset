import { apiClient } from '@/lib/api';
import { AuthResponse, LoginRequest, User } from '@/types';

export const authApi = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/auth/login', credentials);
  },

  logout: async (): Promise<void> => {
    return apiClient.post<void>('/auth/logout');
  },

  me: async (): Promise<User> => {
    return apiClient.get<User>('/auth/me');
  },

  refreshToken: async (): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/auth/refresh');
  },

  forgotPassword: async (email: string): Promise<{ message: string }> => {
    return apiClient.post<{ message: string }>('/auth/forgot-password', { email });
  },

  resetPassword: async (data: {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
  }): Promise<{ message: string }> => {
    return apiClient.post<{ message: string }>('/auth/reset-password', data);
  },
};