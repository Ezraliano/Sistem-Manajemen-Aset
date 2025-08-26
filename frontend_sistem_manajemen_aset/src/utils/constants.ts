export const ASSET_STATUSES = [
  { value: 'active', label: 'Active', color: 'success' },
  { value: 'inactive', label: 'Inactive', color: 'muted' },
  { value: 'maintenance', label: 'Maintenance', color: 'warning' },
  { value: 'disposed', label: 'Disposed', color: 'destructive' },
] as const;

export const ASSET_CONDITIONS = [
  { value: 'excellent', label: 'Excellent', color: 'success' },
  { value: 'good', label: 'Good', color: 'primary' },
  { value: 'fair', label: 'Fair', color: 'warning' },
  { value: 'poor', label: 'Poor', color: 'destructive' },
] as const;

export const USER_ROLES = [
  { value: 'admin', label: 'Administrator' },
  { value: 'staff', label: 'Staff' },
] as const;

export const QR_CODE_CONFIG = {
  size: parseInt(import.meta.env.VITE_QR_CODE_SIZE || '256'),
  margin: parseInt(import.meta.env.VITE_QR_CODE_MARGIN || '4'),
} as const;

export const PAGINATION = {
  defaultPageSize: 10,
  pageSizeOptions: [10, 25, 50, 100],
} as const;