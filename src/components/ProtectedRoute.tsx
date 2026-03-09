import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Permission, UserRole } from '@/types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermissions?: Permission[];
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

export function ProtectedRoute({ 
  children, 
  requiredPermissions = [], 
  allowedRoles,
  redirectTo = '/login' 
}: ProtectedRouteProps) {
  const { user, isAuthenticated, hasAnyPermission } = useAuth();
  const location = useLocation();

  // Not authenticated - redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check role-based access
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    const defaultRoute = user.role === 'guardian' ? '/portal' : '/dashboard';
    return <Navigate to={defaultRoute} replace />;
  }

  // Check permission-based access
  if (requiredPermissions.length > 0 && !hasAnyPermission(requiredPermissions)) {
    // Redirect to appropriate dashboard based on role
    const defaultRoute = user.role === 'guardian' ? '/portal' : '/dashboard';
    return <Navigate to={defaultRoute} replace />;
  }

  return <>{children}</>;
}

// Component to protect admin routes (non-guardian roles)
export function AdminRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute 
      allowedRoles={['super_admin', 'branch_admin', 'treasurer', 'academic_staff', 'dormitory_supervisor']}
    >
      {children}
    </ProtectedRoute>
  );
}

// Component to protect guardian routes
export function GuardianRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['guardian']} redirectTo="/login">
      {children}
    </ProtectedRoute>
  );
}
