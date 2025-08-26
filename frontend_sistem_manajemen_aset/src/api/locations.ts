import { apiClient } from '@/lib/api';
import { Location, LocationFilters, PaginatedResponse } from '@/types';

export const locationsApi = {
  getLocations: async (
    page = 1,
    filters: LocationFilters = {}
  ): Promise<PaginatedResponse<Location>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      ...Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => 
          value !== undefined && value !== ''
        )
      ),
    });

    return apiClient.get<PaginatedResponse<Location>>(`/locations?${params}`);
  },

  getAllLocations: async (): Promise<Location[]> => {
    return apiClient.get<Location[]>('/locations/all');
  },

  getLocation: async (id: number): Promise<Location> => {
    return apiClient.get<Location>(`/locations/${id}`);
  },

  createLocation: async (location: Partial<Location>): Promise<Location> => {
    return apiClient.post<Location>('/locations', location);
  },

  updateLocation: async (id: number, location: Partial<Location>): Promise<Location> => {
    return apiClient.put<Location>(`/locations/${id}`, location);
  },

  deleteLocation: async (id: number): Promise<void> => {
    return apiClient.delete<void>(`/locations/${id}`);
  },

  getLocationAssets: async (id: number): Promise<any[]> => {
    return apiClient.get<any[]>(`/locations/${id}/assets`);
  },
};