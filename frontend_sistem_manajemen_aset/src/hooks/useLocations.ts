import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { locationsApi } from '@/api/locations';
import { Location, LocationFilters } from '@/types';
import { handleApiError } from '@/lib/api';
import toast from 'react-hot-toast';

export const useLocations = (page = 1, filters: LocationFilters = {}) => {
  return useQuery({
    queryKey: ['locations', page, filters],
    queryFn: () => locationsApi.getLocations(page, filters),
    placeholderData: keepPreviousData,
  });
};

export const useAllLocations = () => {
  return useQuery({
    queryKey: ['locations', 'all'],
    queryFn: () => locationsApi.getAllLocations(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useLocation = (id: number) => {
  return useQuery({
    queryKey: ['locations', id],
    queryFn: () => locationsApi.getLocation(id),
    enabled: !!id,
  });
};

export const useCreateLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (location: Partial<Location>) => locationsApi.createLocation(location),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      toast.success(`Location "${data.name}" created successfully`);
    },
    onError: handleApiError,
  });
};

export const useUpdateLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...location }: { id: number } & Partial<Location>) =>
      locationsApi.updateLocation(id, location),
    onMutate: async ({ id, ...newLocation }) => {
      await queryClient.cancelQueries({ queryKey: ['locations', id] });
      const previousLocation = queryClient.getQueryData<Location>(['locations', id]);

      if (previousLocation) {
        queryClient.setQueryData<Location>(['locations', id], {
          ...previousLocation,
          ...newLocation,
        });
      }

      return { previousLocation, locationId: id };
    },
    onError: (err, variables, context) => {
      if (context?.previousLocation) {
        queryClient.setQueryData(['locations', context.locationId], context.previousLocation);
      }
      handleApiError(err);
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: ['locations', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['locations'] });
    },
    onSuccess: (data) => {
      toast.success(`Location "${data.name}" updated successfully`);
    },
  });
};

export const useDeleteLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => locationsApi.deleteLocation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      toast.success('Location deleted successfully');
    },
    onError: handleApiError,
  });
};