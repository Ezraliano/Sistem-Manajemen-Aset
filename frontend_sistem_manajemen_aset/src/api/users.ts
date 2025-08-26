import { apiClient } from '@/lib/api';
import { User, UserFilters, PaginatedResponse } from '@/types';

export const usersApi = {
  getUsers: async (
    page = 1,
    filters: UserFilters = {}
  ): Promise<PaginatedResponse<User>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      ...Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => 
          value !== undefined && value !== ''
        )
      ),
    });

    return apiClient.get<PaginatedResponse<User>>(`/users?${params}`);
  },

  getUser: async (id: number): Promise<User> => {
    return apiClient.get<User>(`/users/${id}`);
  },

  createUser: async (user: Partial<User> & { password: string }): Promise<User> => {
    return apiClient.post<User>('/users', user);
  },

  updateUser: async (id: number, user: Partial<User>): Promise<User> => {
    return apiClient.put<User>(`/users/${id}`, user);
  },

  deleteUser: async (id: number): Promise<void> => {
    return apiClient.delete<void>(`/users/${id}`);
  },

  updatePassword: async (id: number, data: {
    current_password?: string;
    password: string;
    password_confirmation: string;
  }): Promise<{ message: string }> => {
    return apiClient.patch<{ message: string }>(`/users/${id}/password`, data);
  },
};