import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Role } from '@/types';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: Role;
  requireAuth?: boolean;
}

export const ProtectedRoute = ({
  children,
  requiredRole,
  requireAuth = true,
}: ProtectedRouteProps) => {
  const location = useLocation();
  const { isAuthenticated, user } = useAuthStore();

  // If auth is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user is authenticated but accessing login page
  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Check role-based access
  if (requiredRole && user?.role !== requiredRole) {
    // If admin role is required and user is not admin
    if (requiredRole === 'admin') {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center">
            <div className="text-6xl mb-4">🚫</div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Access Denied</h1>
            <p className="text-muted-foreground mb-4">
              You don't have permission to access this page.
            </p>
            <p className="text-sm text-muted-foreground">
              Admin privileges required.
            </p>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
};

// Higher-order component for role-based route protection
export const withRoleProtection = (Component: React.ComponentType, requiredRole?: Role) => {
  return (props: any) => (
    <ProtectedRoute requiredRole={requiredRole}>
      <Component {...props} />
    </ProtectedRoute>
  );
};

// Helper components for specific roles
export const AdminRoute = ({ children }: { children: ReactNode }) => (
  <ProtectedRoute requiredRole="admin">{children}</ProtectedRoute>
);

export const StaffRoute = ({ children }: { children: ReactNode }) => (
  <ProtectedRoute requiredRole="staff">{children}</ProtectedRoute>
);

// Public route (redirects to dashboard if authenticated)
export const PublicRoute = ({ children }: { children: ReactNode }) => (
  <ProtectedRoute requireAuth={false}>{children}</ProtectedRoute>
);