import { Package } from 'lucide-react';

export const Assets = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center">
            <Package className="mr-3 h-8 w-8 text-primary" />
            Asset Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and track all your organization's assets
          </p>
        </div>
      </div>

      <div className="text-center py-12">
        <Package className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">Assets Management</h3>
        <p className="text-muted-foreground">
          Asset management features will be implemented here. This includes CRUD operations,
          filtering, searching, and asset details.
        </p>
      </div>
    </div>
  );
};