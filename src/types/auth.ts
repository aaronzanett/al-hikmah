// Role definitions for the RBAC system
export type UserRole = 
  | 'super_admin'
  | 'branch_admin'
  | 'treasurer'
  | 'academic_staff'
  | 'dormitory_supervisor'
  | 'guardian';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  branchId?: string; // For branch-specific roles
  avatar?: string;
}

// Permission definitions
export type Permission = 
  | 'dashboard.view'
  | 'branches.view'
  | 'branches.manage'
  | 'students.view'
  | 'students.manage'
  | 'guardians.view'
  | 'guardians.manage'
  | 'classes.view'
  | 'classes.manage'
  | 'subjects.view'
  | 'subjects.manage'
  | 'grades.view'
  | 'grades.manage'
  | 'attendance.view'
  | 'attendance.manage'
  | 'rooms.view'
  | 'rooms.manage'
  | 'inventory.view'
  | 'inventory.manage'
  | 'bills.view'
  | 'bills.manage'
  | 'payments.view'
  | 'payments.manage'
  | 'expenses.view'
  | 'expenses.manage'
  | 'savings.view'
  | 'savings.manage'
  | 'settings.view'
  | 'settings.manage'
  | 'users.view'
  | 'users.manage'
  // Content management permissions (super admin)
  | 'content_gallery.view'
  | 'content_gallery.manage'
  | 'content_news.view'
  | 'content_news.manage'
  | 'content_contact.view'
  | 'content_contact.manage'
  | 'content_messages.view'
  | 'content_messages.manage'
  // Guardian-specific permissions
  | 'guardian_portal.view'
  | 'child_profile.view'
  | 'child_grades.view'
  | 'child_attendance.view'
  | 'child_bills.view'
  | 'child_savings.view';

// Role-Permission mapping
export const rolePermissions: Record<UserRole, Permission[]> = {
  super_admin: [
    'dashboard.view',
    'branches.view', 'branches.manage',
    'students.view', 'students.manage',
    'guardians.view', 'guardians.manage',
    'classes.view', 'classes.manage',
    'subjects.view', 'subjects.manage',
    'grades.view', 'grades.manage',
    'attendance.view', 'attendance.manage',
    'rooms.view', 'rooms.manage',
    'inventory.view', 'inventory.manage',
    'bills.view', 'bills.manage',
    'payments.view', 'payments.manage',
    'expenses.view', 'expenses.manage',
    'savings.view', 'savings.manage',
    'settings.view', 'settings.manage',
    'users.view', 'users.manage',
    'content_gallery.view', 'content_gallery.manage',
    'content_news.view', 'content_news.manage',
    'content_contact.view', 'content_contact.manage',
    'content_messages.view', 'content_messages.manage',
  ],
  
  branch_admin: [
    'dashboard.view',
    'students.view', 'students.manage',
    'guardians.view', 'guardians.manage',
    'classes.view', 'classes.manage',
    'subjects.view',
    'grades.view',
    'attendance.view',
    'rooms.view', 'rooms.manage',
    'inventory.view', 'inventory.manage',
  ],
  
  treasurer: [
    'dashboard.view',
    'bills.view', 'bills.manage',
    'payments.view', 'payments.manage',
    'expenses.view', 'expenses.manage',
    'savings.view', 'savings.manage',
    'students.view', // View-only for reference
    'guardians.view',
  ],
  
  academic_staff: [
    'dashboard.view',
    'students.view',
    'classes.view', 'classes.manage',
    'subjects.view', 'subjects.manage',
    'grades.view', 'grades.manage',
    'attendance.view', 'attendance.manage',
  ],
  
  dormitory_supervisor: [
    'dashboard.view',
    'students.view',
    'rooms.view', 'rooms.manage',
    'inventory.view', 'inventory.manage',
    'attendance.view', 'attendance.manage', // Dormitory attendance
  ],
  
  guardian: [
    'guardian_portal.view',
    'child_profile.view',
    'child_grades.view',
    'child_attendance.view',
    'child_bills.view',
    'child_savings.view',
  ],
};

// Role display names
export const roleDisplayNames: Record<UserRole, { id: string; en: string }> = {
  super_admin: { id: 'Super Admin', en: 'Super Admin' },
  branch_admin: { id: 'Admin Cabang', en: 'Branch Admin' },
  treasurer: { id: 'Bendahara', en: 'Treasurer' },
  academic_staff: { id: 'Staff Akademik', en: 'Academic Staff' },
  dormitory_supervisor: { id: 'Musyrif Asrama', en: 'Dormitory Supervisor' },
  guardian: { id: 'Wali Santri', en: 'Guardian' },
};

// Route-Permission mapping for protected routes
export const routePermissions: Record<string, Permission[]> = {
  '/dashboard': ['dashboard.view'],
  '/branches': ['branches.view'],
  '/students': ['students.view'],
  '/guardians': ['guardians.view'],
  '/classes': ['classes.view'],
  '/subjects': ['subjects.view'],
  '/grades': ['grades.view'],
  '/attendance': ['attendance.view'],
  '/rooms': ['rooms.view'],
  '/inventory': ['inventory.view'],
  '/bills': ['bills.view'],
  '/payments': ['payments.view'],
  '/expenses': ['expenses.view'],
  '/savings': ['savings.view'],
  '/settings': ['settings.view'],
  '/content/gallery': ['content_gallery.view'],
  '/content/news': ['content_news.view'],
  '/content/contact': ['content_contact.view'],
  '/content/messages': ['content_messages.view'],
  // Guardian portal routes
  '/portal': ['guardian_portal.view'],
  '/portal/child': ['child_profile.view'],
  '/portal/grades': ['child_grades.view'],
  '/portal/attendance': ['child_attendance.view'],
  '/portal/bills': ['child_bills.view'],
  '/portal/savings': ['child_savings.view'],
};

// Helper function to check if a role has a permission
export function hasPermission(role: UserRole, permission: Permission): boolean {
  return rolePermissions[role].includes(permission);
}

// Helper function to check if a role has any of the required permissions
export function hasAnyPermission(role: UserRole, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(role, permission));
}

// Helper function to get accessible routes for a role
export function getAccessibleRoutes(role: UserRole): string[] {
  const permissions = rolePermissions[role];
  return Object.entries(routePermissions)
    .filter(([_, requiredPermissions]) => 
      requiredPermissions.some(p => permissions.includes(p))
    )
    .map(([route]) => route);
}

// Get the default route for each role after login
export function getDefaultRoute(role: UserRole): string {
  if (role === 'guardian') {
    return '/portal';
  }
  return '/dashboard';
}
