import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { itemsAPI } from '../api/items';
import toast from 'react-hot-toast';

export const useItems = (params = {}) => {
  const queryClient = useQueryClient();

  const {
    data: items,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['items', params],
    queryFn: () => itemsAPI.getAll(params),
  });

  const createItemMutation = useMutation({
    mutationFn: itemsAPI.create,
    onMutate: async (newItem) => {
      await queryClient.cancelQueries(['items']);
      const previousItems = queryClient.getQueryData(['items', params]);
      
      // Optimistic update
      queryClient.setQueryData(['items', params], (old) => ({
        ...old,
        data: [{ ...newItem, id: Date.now() }, ...(old?.data || [])],
      }));

      return { previousItems };
    },
    onError: (error, newItem, context) => {
      queryClient.setQueryData(['items', params], context.previousItems);
      toast.error(error.response?.data?.message || 'Failed to create item');
    },
    onSuccess: () => {
      toast.success('Item created successfully!');
    },
    onSettled: () => {
      queryClient.invalidateQueries(['items']);
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: ({ id, ...data }) => itemsAPI.update(id, data),
    onMutate: async ({ id, ...updatedItem }) => {
      await queryClient.cancelQueries(['items']);
      const previousItems = queryClient.getQueryData(['items', params]);
      
      // Optimistic update
      queryClient.setQueryData(['items', params], (old) => ({
        ...old,
        data: old?.data?.map(item => 
          item.id === id ? { ...item, ...updatedItem } : item
        ) || [],
      }));

      return { previousItems };
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(['items', params], context.previousItems);
      toast.error(error.response?.data?.message || 'Failed to update item');
    },
    onSuccess: () => {
      toast.success('Item updated successfully!');
    },
    onSettled: () => {
      queryClient.invalidateQueries(['items']);
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: itemsAPI.delete,
    onMutate: async (id) => {
      await queryClient.cancelQueries(['items']);
      const previousItems = queryClient.getQueryData(['items', params]);
      
      // Optimistic update
      queryClient.setQueryData(['items', params], (old) => ({
        ...old,
        data: old?.data?.filter(item => item.id !== id) || [],
      }));

      return { previousItems };
    },
    onError: (error, id, context) => {
      queryClient.setQueryData(['items', params], context.previousItems);
      toast.error(error.response?.data?.message || 'Failed to delete item');
    },
    onSuccess: () => {
      toast.success('Item deleted successfully!');
    },
    onSettled: () => {
      queryClient.invalidateQueries(['items']);
    },
  });

  return {
    items: items?.data || [],
    pagination: items?.pagination,
    isLoading,
    error,
    createItem: createItemMutation.mutate,
    updateItem: updateItemMutation.mutate,
    deleteItem: deleteItemMutation.mutate,
    isCreating: createItemMutation.isPending,
    isUpdating: updateItemMutation.isPending,
    isDeleting: deleteItemMutation.isPending,
  };
};

export const useItem = (id) => {
  return useQuery({
    queryKey: ['items', id],
    queryFn: () => itemsAPI.getById(id),
    enabled: !!id,
  });
};

export const useItemByCode = (code) => {
  return useQuery({
    queryKey: ['items', 'code', code],
    queryFn: () => itemsAPI.getByCode(code),
    enabled: !!code,
  });
};