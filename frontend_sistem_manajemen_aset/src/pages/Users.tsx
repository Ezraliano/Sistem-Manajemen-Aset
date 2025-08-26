import { Users as UsersIcon } from 'lucide-react';

export const Users = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center">
            <UsersIcon className="mr-3 h-8 w-8 text-primary" />
            User Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage system users and their permissions
          </p>
        </div>
      </div>

      <div className="text-center py-12">
        <UsersIcon className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">User Management</h3>
        <p className="text-muted-foreground">
          User management features will be implemented here. This includes CRUD operations
          for users, role management, and permission settings.
        </p>
      </div>
    </div>
  );
};