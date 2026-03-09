import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Building2,
  BedDouble,
  Wallet,
  Receipt,
  BookOpen,
  ClipboardList,
  Package,
  PiggyBank,
  Settings,
  LogOut,
  ChevronDown,
  UserCog,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useAuth, usePermissions } from "@/contexts/AuthContext";
import { Permission, roleDisplayNames } from "@/types/auth";
import { useNavigate } from "react-router-dom";

interface MenuItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  permission: Permission;
}

const mainItems: MenuItem[] = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard, permission: "dashboard.view" },
];

const managementItems: MenuItem[] = [
  { title: "Cabang / Branches", url: "/branches", icon: Building2, permission: "branches.view" },
  { title: "Santri / Students", url: "/students", icon: Users, permission: "students.view" },
  { title: "Wali / Guardians", url: "/guardians", icon: Users, permission: "guardians.view" },
];

const academicItems: MenuItem[] = [
  { title: "Kelas / Classes", url: "/classes", icon: GraduationCap, permission: "classes.view" },
  { title: "Mata Pelajaran / Subjects", url: "/subjects", icon: BookOpen, permission: "subjects.view" },
  { title: "Nilai / Grades", url: "/grades", icon: ClipboardList, permission: "grades.view" },
  { title: "Absensi / Attendance", url: "/attendance", icon: ClipboardList, permission: "attendance.view" },
];

const dormitoryItems: MenuItem[] = [
  { title: "Kamar / Rooms", url: "/rooms", icon: BedDouble, permission: "rooms.view" },
  { title: "Inventaris / Inventory", url: "/inventory", icon: Package, permission: "inventory.view" },
];

const financeItems: MenuItem[] = [
  { title: "Tagihan / Bills", url: "/bills", icon: Receipt, permission: "bills.view" },
  { title: "Pembayaran / Payments", url: "/payments", icon: Wallet, permission: "payments.view" },
  { title: "Pengeluaran / Expenses", url: "/expenses", icon: Receipt, permission: "expenses.view" },
  { title: "Tabungan / Savings", url: "/savings", icon: PiggyBank, permission: "savings.view" },
];

interface NavGroupProps {
  label: string;
  items: MenuItem[];
  collapsed: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function NavGroup({ label, items, collapsed, open, onOpenChange }: NavGroupProps) {
  const { can } = usePermissions();
  
  // Filter items based on permissions
  const visibleItems = items.filter(item => can(item.permission));
  
  // Don't render group if no items are visible
  if (visibleItems.length === 0) return null;

  if (collapsed) {
    return (
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {visibleItems.map((item) => (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton asChild tooltip={item.title}>
                  <NavLink
                    to={item.url}
                    end
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    activeClassName="bg-sidebar-accent text-sidebar-primary font-semibold"
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  return (
    <Collapsible open={open} onOpenChange={onOpenChange} className="group/collapsible">
      <SidebarGroup>
        <CollapsibleTrigger asChild>
          <SidebarGroupLabel className="cursor-pointer text-[11px] uppercase tracking-wider text-sidebar-foreground/40 hover:text-sidebar-foreground/60 flex items-center justify-between">
            {label}
            <ChevronDown className="h-3 w-3 transition-transform group-data-[state=open]/collapsible:rotate-180" />
          </SidebarGroupLabel>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="flex items-center gap-3 rounded-md px-3 py-2 text-sidebar-foreground/70 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-semibold"
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
}

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { user, logout } = useAuth();
  const { can } = usePermissions();
  const navigate = useNavigate();
  
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    management: true,
    academic: true,
    dormitory: true,
    finance: true,
  });

  const handleOpenChange = (key: string) => (open: boolean) => {
    setOpenGroups((prev) => ({ ...prev, [key]: open }));
  };

  const handleLogout = () => {
    logout();
    navigate("/login/admin");
  };

  // Filter main items based on permissions
  const visibleMainItems = mainItems.filter(item => can(item.permission));

  // Check if management group should be visible
  const showManagement = managementItems.some(item => can(item.permission));
  const showAcademic = academicItems.some(item => can(item.permission));
  const showDormitory = dormitoryItems.some(item => can(item.permission));
  const showFinance = financeItems.some(item => can(item.permission));

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg gradient-gold">
            <span className="text-sm font-bold text-sidebar-primary-foreground">B</span>
          </div>
          {!collapsed && (
            <div className="animate-slide-in">
              <h1 className="text-base font-bold text-sidebar-foreground">BoardingCore</h1>
              <p className="text-[11px] text-sidebar-foreground/50">
                {user ? roleDisplayNames[user.role].id : 'Pesantren Management'}
              </p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {/* Main Dashboard Item */}
        {visibleMainItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {visibleMainItems.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <NavLink
                        to={item.url}
                        end
                        className="flex items-center gap-3 rounded-md px-3 py-2 text-sidebar-foreground/70 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        activeClassName="bg-sidebar-accent text-sidebar-primary font-semibold"
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {showManagement && (
          <NavGroup 
            label="Manajemen / Management" 
            items={managementItems} 
            collapsed={collapsed} 
            open={openGroups.management} 
            onOpenChange={handleOpenChange("management")} 
          />
        )}
        
        {showAcademic && (
          <NavGroup 
            label="Akademik / Academic" 
            items={academicItems} 
            collapsed={collapsed} 
            open={openGroups.academic} 
            onOpenChange={handleOpenChange("academic")} 
          />
        )}
        
        {showDormitory && (
          <NavGroup 
            label="Asrama / Dormitory" 
            items={dormitoryItems} 
            collapsed={collapsed} 
            open={openGroups.dormitory} 
            onOpenChange={handleOpenChange("dormitory")} 
          />
        )}
        
        {showFinance && (
          <NavGroup 
            label="Keuangan / Finance" 
            items={financeItems} 
            collapsed={collapsed} 
            open={openGroups.finance} 
            onOpenChange={handleOpenChange("finance")} 
          />
        )}
      </SidebarContent>

      <SidebarFooter className="p-3">
        <SidebarMenu>
          {can('settings.view') && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Pengaturan">
                <NavLink
                  to="/settings"
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sidebar-foreground/50 text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  activeClassName="bg-sidebar-accent text-sidebar-primary"
                >
                  <Settings className="h-4 w-4 shrink-0" />
                  {!collapsed && <span>Pengaturan / Settings</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          
          {/* User info when expanded */}
          {!collapsed && user && (
            <div className="px-3 py-2 mb-2 border-t border-sidebar-border mt-2 pt-3">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-full gradient-primary flex items-center justify-center">
                  <span className="text-[10px] font-semibold text-primary-foreground">
                    {user.avatar || user.name.slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-sidebar-foreground truncate">{user.name}</p>
                  <p className="text-[10px] text-sidebar-foreground/50 truncate">{user.email}</p>
                </div>
              </div>
            </div>
          )}
          
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Logout">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sidebar-foreground/50 text-sm hover:bg-sidebar-accent hover:text-destructive"
              >
                <LogOut className="h-4 w-4 shrink-0" />
                {!collapsed && <span>Keluar / Logout</span>}
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
