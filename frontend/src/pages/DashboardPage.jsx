import { useQuery } from '@tanstack/react-query';
import {
  CubeIcon,
  MapPinIcon,
  UsersIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { itemsAPI } from '../api/items';
import { locationsAPI } from '../api/locations';
import { usersAPI } from '../api/users';
import useAuthStore from '../store/authStore';

const DashboardPage = () => {
  const { hasRole } = useAuthStore();

  const { data: itemsData, isLoading: itemsLoading } = useQuery({
    queryKey: ['items', { limit: 5 }],
    queryFn: () => itemsAPI.getAll({ limit: 5 }),
  });

  const { data: locationsData, isLoading: locationsLoading } = useQuery({
    queryKey: ['locations', { limit: 5 }],
    queryFn: () => locationsAPI.getAll({ limit: 5 }),
  });

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['users', { limit: 5 }],
    queryFn: () => usersAPI.getAll({ limit: 5 }),
    enabled: hasRole('admin'),
  });

  const stats = [
    {
      name: 'Total Assets',
      value: itemsData?.pagination?.total || 0,
      icon: CubeIcon,
      color: 'bg-blue-500',
      loading: itemsLoading,
    },
    {
      name: 'Locations',
      value: locationsData?.pagination?.total || 0,
      icon: MapPinIcon,
      color: 'bg-green-500',
      loading: locationsLoading,
    },
    {
      name: 'Users',
      value: usersData?.pagination?.total || 0,
      icon: UsersIcon,
      color: 'bg-purple-500',
      loading: usersLoading,
      hidden: !hasRole('admin'),
    },
    {
      name: 'Damaged Assets',
      value: itemsData?.data?.filter(item => item.condition !== 'baik').length || 0,
      icon: ExclamationTriangleIcon,
      color: 'bg-red-500',
      loading: itemsLoading,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to the Asset Management System</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.filter(stat => !stat.hidden).map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="card">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <div className="flex items-center">
                    {stat.loading ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Assets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Assets</h3>
          {itemsLoading ? (
            <div className="flex justify-center">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="space-y-3">
              {itemsData?.data?.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">{item.code}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    item.condition === 'baik' 
                      ? 'bg-green-100 text-green-800'
                      : item.condition === 'rusak ringan'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {item.condition}
                  </span>
                </div>
              ))}
              {(!itemsData?.data || itemsData.data.length === 0) && (
                <p className="text-gray-500 text-center py-4">No assets found</p>
              )}
            </div>
          )}
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Locations</h3>
          {locationsLoading ? (
            <div className="flex justify-center">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="space-y-3">
              {locationsData?.data?.slice(0, 5).map((location) => (
                <div key={location.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{location.name}</p>
                    <p className="text-sm text-gray-600">{location.description}</p>
                  </div>
                </div>
              ))}
              {(!locationsData?.data || locationsData.data.length === 0) && (
                <p className="text-gray-500 text-center py-4">No locations found</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;