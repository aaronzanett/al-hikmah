import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Bell, Search } from "lucide-react";
import { Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { roleDisplayNames } from "@/types/auth";

export function DashboardLayout() {
  const { user } = useAuth();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0 w-0">
          <header className="h-14 flex items-center justify-between border-b bg-card/95 backdrop-blur-sm px-4 shrink-0 sticky top-0 z-30">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-md hover:bg-muted transition-colors">
                <Search className="h-4 w-4 text-muted-foreground" />
              </button>
              <button className="p-2 rounded-md hover:bg-muted transition-colors relative">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
              </button>
              <div className="ml-2 flex items-center gap-2.5 pl-2 border-l">
                <div className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center">
                  <span className="text-xs font-semibold text-primary-foreground">
                    {user?.avatar || user?.name?.slice(0, 2).toUpperCase() || "??"}
                  </span>
                </div>
                {user && (
                  <div className="hidden sm:block">
                    <p className="text-xs font-semibold text-foreground leading-none">{user.name}</p>
                    <p className="text-[10px] text-muted-foreground leading-tight">
                      {roleDisplayNames[user.role].id}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
