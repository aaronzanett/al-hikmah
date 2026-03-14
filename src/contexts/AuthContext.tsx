import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User, UserRole, Permission, hasPermission, hasAnyPermission, getDefaultRoute, rolePermissions } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  getDefaultRoute: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration - replace with actual auth later
export const mockUsers: Record<string, User> = {
  'super_admin': {
    id: '1',
    name: 'Ahmad Fauzan',
    email: 'superadmin@pesantren.id',
    role: 'super_admin',
    avatar: 'AF',
  },
  'branch_admin': {
    id: '2',
    name: 'Budi Santoso',
    email: 'branchadmin@pesantren.id',
    role: 'branch_admin',
    branchId: 'branch-1',
    avatar: 'BS',
  },
  'treasurer': {
    id: '3',
    name: 'Siti Rahayu',
    email: 'treasurer@pesantren.id',
    role: 'treasurer',
    avatar: 'SR',
  },
  'academic_staff': {
    id: '4',
    name: 'Umar Hadi',
    email: 'academic@pesantren.id',
    role: 'academic_staff',
    avatar: 'UH',
  },
  'dormitory_supervisor': {
    id: '5',
    name: 'Ustadz Hamid',
    email: 'musyrif@pesantren.id',
    role: 'dormitory_supervisor',
    avatar: 'UH',
  },
  'guardian': {
    id: '6',
    name: 'H. Muhammad Ridwan',
    email: 'wali@gmail.com',
    role: 'guardian',
    avatar: 'MR',
  },
  'student': {
    id: '7',
    name: 'Muhammad Azzam Ridwan',
    email: 'azzam@pesantren.id',
    role: 'student',
    avatar: 'MA',
  },
};

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(() => {
    // Check localStorage for persisted user
    const savedUser = localStorage.getItem('auth_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = useCallback((userData: User) => {
    setUser(userData);
    localStorage.setItem('auth_user', JSON.stringify(userData));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('auth_user');
  }, []);

  const checkPermission = useCallback((permission: Permission): boolean => {
    if (!user) return false;
    return hasPermission(user.role, permission);
  }, [user]);

  const checkAnyPermission = useCallback((permissions: Permission[]): boolean => {
    if (!user) return false;
    return hasAnyPermission(user.role, permissions);
  }, [user]);

  const getUserDefaultRoute = useCallback((): string => {
    if (!user) return '/login';
    return getDefaultRoute(user.role);
  }, [user]);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    hasPermission: checkPermission,
    hasAnyPermission: checkAnyPermission,
    getDefaultRoute: getUserDefaultRoute,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Hook to get current user's permissions
export function usePermissions() {
  const { user } = useAuth();
  
  if (!user) {
    return {
      permissions: [] as Permission[],
      can: () => false,
      canAny: () => false,
    };
  }
  
  const permissions = rolePermissions[user.role];
  
  return {
    permissions,
    can: (permission: Permission) => permissions.includes(permission),
    canAny: (perms: Permission[]) => perms.some(p => permissions.includes(p)),
  };
}
