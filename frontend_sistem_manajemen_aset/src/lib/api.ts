import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const apiClient = {
  get: async <T>(endpoint: string): Promise<T> => {
    return apiClient.request<T>(endpoint, { method: 'GET' });
  },

  post: async <T>(endpoint: string, data?: any): Promise<T> => {
    return apiClient.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  put: async <T>(endpoint: string, data: any): Promise<T> => {
    return apiClient.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  patch: async <T>(endpoint: string, data: any): Promise<T> => {
    return apiClient.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  delete: async <T>(endpoint: string): Promise<T> => {
    return apiClient.request<T>(endpoint, { method: 'DELETE' });
  },

  request: async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    const { token } = useAuthStore.getState();
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

      // Handle 401 Unauthorized
      if (response.status === 401) {
        useAuthStore.getState().clearAuth();
        toast.error('Session expired. Please login again.');
        window.location.href = '/login';
        throw new ApiError('Unauthorized', 401);
      }

      const data = await response.json();

      if (!response.ok) {
        const message = data.message || `HTTP ${response.status}: ${response.statusText}`;
        throw new ApiError(message, response.status, data.errors);
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      // Network or parsing errors
      console.error('API request failed:', error);
      throw new ApiError('Network error. Please check your connection.', 0);
    }
  },
};

// Request interceptor to add auth header
export const setAuthToken = (token: string | null) => {
  if (token) {
    // Store token for future requests
    localStorage.setItem('auth-token', token);
  } else {
    localStorage.removeItem('auth-token');
  }
};

// Response interceptor for handling common errors
export const handleApiError = (error: unknown) => {
  if (error instanceof ApiError) {
    if (error.errors) {
      // Handle validation errors
      Object.entries(error.errors).forEach(([field, messages]) => {
        messages.forEach(message => {
          toast.error(`${field}: ${message}`);
        });
      });
    } else {
      toast.error(error.message);
    }
  } else {
    toast.error('An unexpected error occurred');
  }
};