import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authAPI } from '../api/auth';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const { login, logout, user, isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: authAPI.login,
    onSuccess: (data) => {
      login(data.user, data.token);
      toast.success('Login successful!');
      queryClient.invalidateQueries(['auth']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Login failed');
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authAPI.logout,
    onSuccess: () => {
      logout();
      queryClient.clear();
      toast.success('Logged out successfully');
    },
    onError: () => {
      // Force logout even if API call fails
      logout();
      queryClient.clear();
    },
  });

  const { data: currentUser, isLoading: isLoadingUser } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: authAPI.me,
    enabled: isAuthenticated && !!user,
    retry: false,
  });

  return {
    user: currentUser || user,
    isAuthenticated,
    isLoading: loginMutation.isPending || logoutMutation.isPending,
    isLoadingUser,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    loginError: loginMutation.error,
  };
};