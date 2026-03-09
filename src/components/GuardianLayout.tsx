import { motion } from "framer-motion";
import {
  GraduationCap,
  ClipboardList,
  Receipt,
  PiggyBank,
  User,
  Home,
  Bell,
  LogOut,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "Beranda", url: "/portal", icon: Home, exact: true },
  { title: "Profil Anak", url: "/portal/child", icon: User },
  { title: "Nilai", url: "/portal/grades", icon: GraduationCap },
  { title: "Absensi", url: "/portal/attendance", icon: ClipboardList },
  { title: "Tagihan", url: "/portal/bills", icon: Receipt },
  { title: "Tabungan", url: "/portal/savings", icon: PiggyBank },
];

export function GuardianLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur-xl">
        <div className="mx-auto max-w-4xl px-4 h-14 flex items-center justify-between">
          <Link to="/portal" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-gold">
              <span className="text-xs font-bold text-accent-foreground">B</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-foreground leading-none">BoardingCore</p>
              <p className="text-[10px] text-muted-foreground">Portal Wali Santri</p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <button className="p-2 rounded-md hover:bg-muted transition-colors relative">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-destructive" />
            </button>
            <div className="flex items-center gap-2 pl-2 border-l">
              <div className="h-7 w-7 rounded-full gradient-primary flex items-center justify-center">
                <span className="text-[10px] font-semibold text-primary-foreground">
                  {user?.avatar || "WS"}
                </span>
              </div>
              {user && (
                <div className="hidden sm:block">
                  <p className="text-xs font-medium text-foreground leading-none">{user.name}</p>
                  <p className="text-[10px] text-muted-foreground">Wali Santri</p>
                </div>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-md hover:bg-muted transition-colors ml-1"
              title="Keluar"
            >
              <LogOut className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl w-full px-4 flex-1 pb-24 md:pb-6">
        {/* Desktop Side Nav + Content */}
        <div className="md:flex md:gap-6 md:pt-6">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-52 shrink-0">
            <nav className="bg-card border rounded-xl p-2 sticky top-20">
              {navItems.map((item) => {
                const isActive = item.exact
                  ? location.pathname === item.url
                  : location.pathname.startsWith(item.url);
                return (
                  <Link
                    key={item.url}
                    to={item.url}
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0 pt-4 md:pt-0">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card border-t">
        <div className="grid grid-cols-6 h-16">
          {navItems.map((item) => {
            const isActive = item.exact
              ? location.pathname === item.url
              : location.pathname.startsWith(item.url);
            return (
              <Link
                key={item.url}
                to={item.url}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive && "text-primary")} />
                <span className="hidden xs:block">{item.title}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
