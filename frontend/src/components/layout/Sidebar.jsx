import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  CubeIcon,
  MapPinIcon,
  UsersIcon,
  QrCodeIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import useAuthStore from '../../store/authStore';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { hasRole } = useAuthStore();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'Assets', href: '/assets', icon: CubeIcon },
    { name: 'Locations', href: '/locations', icon: MapPinIcon },
    { name: 'QR Scanner', href: '/scanner', icon: QrCodeIcon },
    { name: 'Reports', href: '/reports', icon: ChartBarIcon },
  ];

  // Add admin-only routes
  if (hasRole('admin')) {
    navigation.push({ name: 'Users', href: '/users', icon: UsersIcon });
  }

  const isActive = (href) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 px-4 bg-primary-600">
            <h2 className="text-lg font-semibold text-white">
              Asset Manager
            </h2>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={`
                    flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200
                    ${
                      isActive(item.href)
                        ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-600'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;