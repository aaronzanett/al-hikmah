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

const mainItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
];

const managementItems = [
  { title: "Cabang / Branches", url: "/branches", icon: Building2 },
  { title: "Santri / Students", url: "/students", icon: Users },
  { title: "Wali / Guardians", url: "/guardians", icon: Users },
];

const academicItems = [
  { title: "Kelas / Classes", url: "/classes", icon: GraduationCap },
  { title: "Mata Pelajaran / Subjects", url: "/subjects", icon: BookOpen },
  { title: "Nilai / Grades", url: "/grades", icon: ClipboardList },
  { title: "Absensi / Attendance", url: "/attendance", icon: ClipboardList },
];

const dormitoryItems = [
  { title: "Kamar / Rooms", url: "/rooms", icon: BedDouble },
  { title: "Inventaris / Inventory", url: "/inventory", icon: Package },
];

const financeItems = [
  { title: "Tagihan / Bills", url: "/bills", icon: Receipt },
  { title: "Pembayaran / Payments", url: "/payments", icon: Wallet },
  { title: "Pengeluaran / Expenses", url: "/expenses", icon: Receipt },
  { title: "Tabungan / Savings", url: "/savings", icon: PiggyBank },
];

interface NavGroupProps {
  label: string;
  items: { title: string; url: string; icon: React.ComponentType<{ className?: string }> }[];
  collapsed: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function NavGroup({ label, items, collapsed, open, onOpenChange }: NavGroupProps) {
  if (collapsed) {
    return (
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => (
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
              {items.map((item) => (
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
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    management: true,
    academic: true,
    dormitory: true,
    finance: true,
  });

  const handleOpenChange = (key: string) => (open: boolean) => {
    setOpenGroups((prev) => ({ ...prev, [key]: open }));
  };

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
              <p className="text-[11px] text-sidebar-foreground/50">Pesantren Management</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
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

        <NavGroup label="Manajemen / Management" items={managementItems} collapsed={collapsed} open={openGroups.management} onOpenChange={handleOpenChange("management")} />
        <NavGroup label="Akademik / Academic" items={academicItems} collapsed={collapsed} open={openGroups.academic} onOpenChange={handleOpenChange("academic")} />
        <NavGroup label="Asrama / Dormitory" items={dormitoryItems} collapsed={collapsed} open={openGroups.dormitory} onOpenChange={handleOpenChange("dormitory")} />
        <NavGroup label="Keuangan / Finance" items={financeItems} collapsed={collapsed} open={openGroups.finance} onOpenChange={handleOpenChange("finance")} />
      </SidebarContent>

      <SidebarFooter className="p-3">
        <SidebarMenu>
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
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Logout">
              <NavLink
                to="/login"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sidebar-foreground/50 text-sm hover:bg-sidebar-accent hover:text-destructive"
                activeClassName=""
              >
                <LogOut className="h-4 w-4 shrink-0" />
                {!collapsed && <span>Keluar / Logout</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
