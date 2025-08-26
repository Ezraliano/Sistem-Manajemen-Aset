import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, MapPin, Users, AlertTriangle, TrendingUp, CheckCircle } from 'lucide-react';

// Mock data - in real app, this would come from API
const mockStats = {
  totalAssets: 1248,
  activeAssets: 1156,
  locations: 24,
  users: 12,
  maintenanceAssets: 32,
  recentActivity: [
    { id: 1, action: 'Asset created', asset: 'Laptop Dell XPS 13', user: 'John Doe', time: '2 hours ago' },
    { id: 2, action: 'Location updated', asset: 'Office Building A', user: 'Jane Smith', time: '4 hours ago' },
    { id: 3, action: 'Asset transferred', asset: 'Projector BenQ', user: 'Mike Johnson', time: '1 day ago' },
    { id: 4, action: 'Asset maintenance', asset: 'Printer HP LaserJet', user: 'Sarah Wilson', time: '2 days ago' },
  ]
};

export const Dashboard = () => {
  const { user } = useAuthStore();

  const statsCards = [
    {
      title: 'Total Assets',
      value: mockStats.totalAssets.toLocaleString(),
      description: '+12% from last month',
      icon: Package,
      color: 'text-primary',
      bgColor: 'bg-primary-light',
    },
    {
      title: 'Active Assets',
      value: mockStats.activeAssets.toLocaleString(),
      description: `${mockStats.activeAssets} of ${mockStats.totalAssets}`,
      icon: CheckCircle,
      color: 'text-success',
      bgColor: 'bg-success-light',
    },
    {
      title: 'Locations',
      value: mockStats.locations.toString(),
      description: 'Across all facilities',
      icon: MapPin,
      color: 'text-warning',
      bgColor: 'bg-warning-light',
    },
    {
      title: 'Maintenance',
      value: mockStats.maintenanceAssets.toString(),
      description: 'Assets requiring attention',
      icon: AlertTriangle,
      color: 'text-destructive',
      bgColor: 'bg-destructive-light',
    },
  ];

  // Show users card only for admin
  if (user?.role === 'admin') {
    statsCards.splice(3, 0, {
      title: 'Users',
      value: mockStats.users.toString(),
      description: 'Active system users',
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary-light',
    });
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's an overview of your asset management system
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Your Role</p>
          <p className="text-lg font-semibold text-primary capitalize">
            {user?.role}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`h-10 w-10 rounded-full ${stat.bgColor} flex items-center justify-center`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest actions in your asset management system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockStats.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4">
                  <div className="h-2 w-2 bg-primary rounded-full"></div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium text-foreground">
                      {activity.action}: <span className="text-primary">{activity.asset}</span>
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <span>by {activity.user}</span>
                      <span className="mx-2">•</span>
                      <span>{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks you can perform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <button className="flex items-center p-3 text-left rounded-lg hover:bg-accent transition-colors">
                <Package className="mr-3 h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Add New Asset</p>
                  <p className="text-sm text-muted-foreground">Register a new asset</p>
                </div>
              </button>
              
              <button className="flex items-center p-3 text-left rounded-lg hover:bg-accent transition-colors">
                <MapPin className="mr-3 h-5 w-5 text-warning" />
                <div>
                  <p className="font-medium">Manage Locations</p>
                  <p className="text-sm text-muted-foreground">Add or edit locations</p>
                </div>
              </button>
              
              {user?.role === 'admin' && (
                <button className="flex items-center p-3 text-left rounded-lg hover:bg-accent transition-colors">
                  <Users className="mr-3 h-5 w-5 text-success" />
                  <div>
                    <p className="font-medium">User Management</p>
                    <p className="text-sm text-muted-foreground">Manage system users</p>
                  </div>
                </button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};