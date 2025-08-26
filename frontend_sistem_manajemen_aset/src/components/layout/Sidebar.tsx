import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Package,
  MapPin,
  Users,
  QrCode,
  LogOut,
  Settings,
  BarChart3,
} from 'lucide-react';

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['admin', 'staff'],
  },
  {
    name: 'Assets',
    href: '/assets',
    icon: Package,
    roles: ['admin', 'staff'],
  },
  {
    name: 'Locations',
    href: '/locations',
    icon: MapPin,
    roles: ['admin', 'staff'],
  },
  {
    name: 'QR Scanner',
    href: '/qr-scanner',
    icon: QrCode,
    roles: ['admin', 'staff'],
  },
  {
    name: 'Users',
    href: '/users',
    icon: Users,
    roles: ['admin'], // Admin only
  },
  {
    name: 'Reports',
    href: '/reports',
    icon: BarChart3,
    roles: ['admin'],
  },
];

export const Sidebar = () => {
  const { user } = useAuthStore();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  const filteredNavigation = navigation.filter(item =>
    item.roles.includes(user?.role || 'staff')
  );

  return (
    <div className="flex h-full flex-col bg-sidebar">
      {/* Logo */}
      <div className="flex h-16 flex-shrink-0 items-center px-6 border-b border-sidebar-border">
        <div className="flex items-center">
          <Package className="h-8 w-8 text-sidebar-primary" />
          <span className="ml-2 text-lg font-semibold text-sidebar-foreground">
            AssetMS
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-4 py-6">
        {filteredNavigation.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                }`
              }
            >
              <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      {/* User section */}
      <div className="flex-shrink-0 border-t border-sidebar-border">
        <div className="p-4">
          <div className="flex items-center mb-3">
            <div className="h-8 w-8 rounded-full bg-sidebar-primary flex items-center justify-center">
              <span className="text-sm font-medium text-sidebar-primary-foreground">
                {user?.name?.[0]?.toUpperCase()}
              </span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-sidebar-foreground">
                {user?.name}
              </p>
              <p className="text-xs text-sidebar-foreground/70 capitalize">
                {user?.role}
              </p>
            </div>
          </div>
          
          <div className="space-y-1">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
              onClick={() => navigate('/profile')}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};