import { apiClient } from '@/lib/api';
import { Asset, AssetFilters, PaginatedResponse, ApiResponse } from '@/types';

export const assetsApi = {
  getAssets: async (
    page = 1,
    filters: AssetFilters = {}
  ): Promise<PaginatedResponse<Asset>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      ...Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => 
          value !== undefined && value !== ''
        )
      ),
    });

    return apiClient.get<PaginatedResponse<Asset>>(`/assets?${params}`);
  },

  getAsset: async (id: number): Promise<Asset> => {
    return apiClient.get<Asset>(`/assets/${id}`);
  },

  getAssetByTag: async (assetTag: string): Promise<Asset> => {
    return apiClient.get<Asset>(`/assets/tag/${assetTag}`);
  },

  createAsset: async (asset: Partial<Asset>): Promise<Asset> => {
    return apiClient.post<Asset>('/assets', asset);
  },

  updateAsset: async (id: number, asset: Partial<Asset>): Promise<Asset> => {
    return apiClient.put<Asset>(`/assets/${id}`, asset);
  },

  deleteAsset: async (id: number): Promise<void> => {
    return apiClient.delete<void>(`/assets/${id}`);
  },

  generateQRCode: async (id: number): Promise<{ qr_code: string }> => {
    return apiClient.post<{ qr_code: string }>(`/assets/${id}/qr-code`);
  },

  uploadImage: async (id: number, file: File): Promise<{ image_url: string }> => {
    const formData = new FormData();
    formData.append('image', file);

    return apiClient.request<{ image_url: string }>(`/assets/${id}/image`, {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  },

  exportAssets: async (filters: AssetFilters = {}): Promise<Blob> => {
    const params = new URLSearchParams(
      Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => 
          value !== undefined && value !== ''
        )
      )
    );

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/assets/export?${params}`,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Export failed');
    }

    return response.blob();
  },

  getAssetHistory: async (id: number): Promise<any[]> => {
    return apiClient.get<any[]>(`/assets/${id}/history`);
  },
};