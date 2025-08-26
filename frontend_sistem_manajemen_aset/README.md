# Asset Management System - Frontend

A modern, scalable React.js frontend for managing organizational assets with QR code integration.

## 🚀 Tech Stack

- **React 18** with TypeScript
- **Vite** for blazing fast development
- **TailwindCSS** for styling with custom design system
- **React Query (TanStack Query)** for server state management
- **Zustand** for client state management
- **React Hook Form + Zod** for form validation
- **React Router DOM** for routing
- **html5-qrcode** for QR code scanning
- **qrcode + jsPDF** for QR code generation

## 📁 Project Structure

```
src/
├── api/                    # API service files
│   ├── auth.ts            # Authentication API
│   ├── assets.ts          # Assets API
│   ├── locations.ts       # Locations API
│   └── users.ts           # Users API
├── components/            # Reusable UI components
│   ├── layout/           # Layout components
│   ├── qr/               # QR code components
│   └── ui/               # shadcn/ui components
├── features/             # Feature-specific components (future)
├── hooks/                # Custom React hooks
│   ├── useAuth.ts        # Authentication hook
│   ├── useAssets.ts      # Assets management hooks
│   └── useLocations.ts   # Locations management hooks
├── pages/                # Application pages
├── store/                # Global state (Zustand)
├── types/                # TypeScript type definitions
├── utils/                # Utility functions
└── lib/                  # Core utilities (API client, etc.)
```

## 🔐 Authentication & Authorization

### Role-Based Access Control

- **Admin**: Full access (CRUD for users, assets, locations)
- **Staff**: CRUD for assets + view locations only

### Authentication Flow

1. JWT token-based authentication
2. Token stored in Zustand with persistence
3. Automatic token refresh
4. Protected routes with role checking

```typescript
// Example: Protected route usage
<AdminRoute>
  <UserManagement />
</AdminRoute>
```

## 🏗️ Key Features

### 1. Asset Management
- Complete CRUD operations
- QR code generation and scanning
- Image upload support
- Asset history tracking
- Advanced filtering and search

### 2. QR Code Integration
```typescript
// QR Code scanning
const { scanResult } = useQRScanner({
  onScan: (data) => {
    // Handle scanned asset
    navigateToAsset(data.asset_id);
  }
});

// QR Code generation
<QRGenerator 
  asset={asset} 
  size={256} 
  includeText={true} 
/>
```

### 3. Optimistic Updates
```typescript
const updateAssetMutation = useMutation({
  mutationFn: updateAsset,
  onMutate: async (newAsset) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries(['assets', id]);
    
    // Snapshot previous value
    const previousAsset = queryClient.getQueryData(['assets', id]);
    
    // Optimistically update
    queryClient.setQueryData(['assets', id], newAsset);
    
    return { previousAsset };
  },
  onError: (err, variables, context) => {
    // Rollback on error
    if (context?.previousAsset) {
      queryClient.setQueryData(['assets', id], context.previousAsset);
    }
  },
});
```

## 🎨 Design System

### Professional Color Palette
- **Primary**: Professional Blue (`hsl(217 91% 60%)`)
- **Success**: Green (`hsl(142 71% 45%)`)
- **Warning**: Amber (`hsl(38 92% 50%)`)
- **Destructive**: Red (`hsl(0 84% 60%)`)

### Component Variants
```typescript
// Button variants using design system
<Button variant="primary">Create Asset</Button>
<Button variant="success">Approve</Button>
<Button variant="warning">Review</Button>
```

## 🔧 Environment Setup

Create `.env` file:
```env
# Laravel API Configuration
VITE_API_URL=http://localhost:8000/api

# Environment
VITE_APP_ENV=development

# QR Code Configuration
VITE_QR_CODE_SIZE=256
VITE_QR_CODE_MARGIN=4
```

## 📡 API Integration

### Error Handling
```typescript
export const handleApiError = (error: unknown) => {
  if (error instanceof ApiError) {
    if (error.errors) {
      // Handle validation errors
      Object.entries(error.errors).forEach(([field, messages]) => {
        messages.forEach(message => {
          toast.error(`${field}: ${message}`);
        });
      });
    } else {
      toast.error(error.message);
    }
  }
};
```

### Request Interceptors
- Automatic JWT token attachment
- 401 handling with redirect to login
- Request/response error handling

## 🚦 Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment**
   ```bash
   cp .env.example .env
   # Edit .env with your Laravel API URL
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 📱 Key Components

### Login Form
```typescript
const LoginForm = () => {
  const { login, isLoggingIn } = useAuth();
  const form = useForm({
    resolver: zodResolver(loginSchema),
  });

  return (
    <form onSubmit={form.handleSubmit(login)}>
      {/* Form fields */}
    </form>
  );
};
```

### Asset Scanner
```typescript
const AssetScanner = () => {
  const navigate = useNavigate();
  
  const handleScan = (qrData: string) => {
    const asset = JSON.parse(qrData);
    navigate(`/assets/${asset.asset_id}`);
  };

  return <QRScanner onScan={handleScan} />;
};
```

## 🔒 Security Features

- JWT token management
- Role-based route protection
- API request authentication
- CSRF protection ready
- Input validation with Zod

## 📊 State Management

### Authentication Store (Zustand)
```typescript
const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
      clearAuth: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    { name: 'auth-storage' }
  )
);
```

### Server State (React Query)
- Automatic caching and synchronization
- Optimistic updates for better UX
- Background refetching
- Error boundaries

## 🎯 Best Practices Implemented

1. **TypeScript First**: Full type safety
2. **Component Composition**: Reusable, focused components
3. **Custom Hooks**: Business logic separation
4. **Error Boundaries**: Graceful error handling
5. **Performance**: Code splitting and lazy loading ready
6. **Accessibility**: ARIA labels and keyboard navigation
7. **Responsive Design**: Mobile-first approach

## 🚀 Deployment

This project is configured for deployment on platforms like:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Traditional web servers

Build assets are optimized and ready for production use.

## 📚 Development Guidelines

### Adding New Features
1. Create types in `src/types/`
2. Add API functions in `src/api/`
3. Create custom hooks in `src/hooks/`
4. Build components in `src/components/`
5. Add pages in `src/pages/`
6. Update routing in `src/App.tsx`

### Code Style
- Use TypeScript strictly
- Follow React hooks patterns
- Implement proper error handling
- Write semantic, accessible HTML
- Use design system tokens

---

**Built with ❤️ for efficient asset management**