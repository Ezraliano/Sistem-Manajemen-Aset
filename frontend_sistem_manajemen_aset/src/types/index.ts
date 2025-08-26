export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'staff';
  created_at: string;
  updated_at: string;
  email_verified_at?: string;
}

export interface Asset {
  id: number;
  name: string;
  description?: string;
  asset_tag: string;
  serial_number?: string;
  purchase_date?: string;
  purchase_price?: number;
  current_value?: number;
  status: 'active' | 'inactive' | 'maintenance' | 'disposed';
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  location_id?: number;
  location?: Location;
  category?: string;
  model?: string;
  manufacturer?: string;
  warranty_expiry?: string;
  notes?: string;
  qr_code?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Location {
  id: number;
  name: string;
  description?: string;
  address?: string;
  building?: string;
  floor?: string;
  room?: string;
  assets_count?: number;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  expires_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

export interface AssetFilters {
  search?: string;
  status?: string;
  location_id?: number;
  category?: string;
  condition?: string;
}

export interface LocationFilters {
  search?: string;
}

export interface UserFilters {
  search?: string;
  role?: string;
}

export type Role = 'admin' | 'staff';

export interface QRCodeData {
  asset_id: number;
  asset_tag: string;
  name: string;
  location?: string;
}