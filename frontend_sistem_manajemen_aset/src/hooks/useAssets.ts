import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { assetsApi } from '@/api/assets';
import { Asset, AssetFilters } from '@/types';
import { handleApiError } from '@/lib/api';
import toast from 'react-hot-toast';

export const useAssets = (page = 1, filters: AssetFilters = {}) => {
  return useQuery({
    queryKey: ['assets', page, filters],
    queryFn: () => assetsApi.getAssets(page, filters),
    placeholderData: keepPreviousData,
  });
};

export const useAsset = (id: number) => {
  return useQuery({
    queryKey: ['assets', id],
    queryFn: () => assetsApi.getAsset(id),
    enabled: !!id,
  });
};

export const useAssetByTag = (assetTag: string) => {
  return useQuery({
    queryKey: ['assets', 'tag', assetTag],
    queryFn: () => assetsApi.getAssetByTag(assetTag),
    enabled: !!assetTag,
  });
};

export const useCreateAsset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (asset: Partial<Asset>) => assetsApi.createAsset(asset),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      toast.success(`Asset "${data.name}" created successfully`);
    },
    onError: handleApiError,
  });
};

export const useUpdateAsset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...asset }: { id: number } & Partial<Asset>) =>
      assetsApi.updateAsset(id, asset),
    onMutate: async ({ id, ...newAsset }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['assets', id] });

      // Snapshot the previous value
      const previousAsset = queryClient.getQueryData<Asset>(['assets', id]);

      // Optimistically update to the new value
      if (previousAsset) {
        queryClient.setQueryData<Asset>(['assets', id], {
          ...previousAsset,
          ...newAsset,
        });
      }

      // Return a context object with the snapshotted value
      return { previousAsset, assetId: id };
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousAsset) {
        queryClient.setQueryData(['assets', context.assetId], context.previousAsset);
      }
      handleApiError(err);
    },
    onSettled: (data, error, variables) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['assets', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['assets'] });
    },
    onSuccess: (data) => {
      toast.success(`Asset "${data.name}" updated successfully`);
    },
  });
};

export const useDeleteAsset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => assetsApi.deleteAsset(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      toast.success('Asset deleted successfully');
    },
    onError: handleApiError,
  });
};

export const useGenerateQRCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => assetsApi.generateQRCode(id),
    onSuccess: (data, assetId) => {
      queryClient.invalidateQueries({ queryKey: ['assets', assetId] });
      toast.success('QR code generated successfully');
    },
    onError: handleApiError,
  });
};

export const useUploadAssetImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, file }: { id: number; file: File }) =>
      assetsApi.uploadImage(id, file),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['assets', variables.id] });
      toast.success('Image uploaded successfully');
    },
    onError: handleApiError,
  });
};