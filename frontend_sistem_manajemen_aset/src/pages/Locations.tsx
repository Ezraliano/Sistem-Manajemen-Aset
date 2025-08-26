import { MapPin } from 'lucide-react';

export const Locations = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center">
            <MapPin className="mr-3 h-8 w-8 text-primary" />
            Location Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage locations where assets are stored
          </p>
        </div>
      </div>

      <div className="text-center py-12">
        <MapPin className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">Location Management</h3>
        <p className="text-muted-foreground">
          Location management features will be implemented here. This includes CRUD operations
          for locations and viewing assets by location.
        </p>
      </div>
    </div>
  );
};