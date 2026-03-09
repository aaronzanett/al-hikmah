import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { GuardianLayout } from "@/components/GuardianLayout";
import { ProtectedRoute, AdminRoute, GuardianRoute } from "@/components/ProtectedRoute";

// Public pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import Gallery from "./pages/Gallery";
import News from "./pages/News";
import NewsDetail from "./pages/NewsDetail";
import NotFound from "./pages/NotFound";

// Admin dashboard pages
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Branches from "./pages/Branches";
import Guardians from "./pages/Guardians";
import Classes from "./pages/Classes";
import Subjects from "./pages/Subjects";
import Grades from "./pages/Grades";
import Attendance from "./pages/Attendance";
import Rooms from "./pages/Rooms";
import Inventory from "./pages/Inventory";
import Bills from "./pages/Bills";
import Payments from "./pages/Payments";
import Expenses from "./pages/Expenses";
import Savings from "./pages/Savings";
import Settings from "./pages/Settings";

// Guardian portal pages
import GuardianPortal from "./pages/portal/GuardianPortal";
import ChildProfile from "./pages/portal/ChildProfile";
import PortalGrades from "./pages/portal/PortalGrades";
import PortalAttendance from "./pages/portal/PortalAttendance";
import PortalBills from "./pages/portal/PortalBills";
import PortalSavings from "./pages/portal/PortalSavings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login/admin" element={<AdminLogin />} />

          {/* Admin dashboard routes (requires admin-level role) */}
          <Route
            element={
              <AdminRoute>
                <DashboardLayout />
              </AdminRoute>
            }
          >
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute requiredPermissions={["dashboard.view"]}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/branches"
              element={
                <ProtectedRoute requiredPermissions={["branches.view"]}>
                  <Branches />
                </ProtectedRoute>
              }
            />
            <Route
              path="/students"
              element={
                <ProtectedRoute requiredPermissions={["students.view"]}>
                  <Students />
                </ProtectedRoute>
              }
            />
            <Route
              path="/guardians"
              element={
                <ProtectedRoute requiredPermissions={["guardians.view"]}>
                  <Guardians />
                </ProtectedRoute>
              }
            />
            <Route
              path="/classes"
              element={
                <ProtectedRoute requiredPermissions={["classes.view"]}>
                  <Classes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/subjects"
              element={
                <ProtectedRoute requiredPermissions={["subjects.view"]}>
                  <Subjects />
                </ProtectedRoute>
              }
            />
            <Route
              path="/grades"
              element={
                <ProtectedRoute requiredPermissions={["grades.view"]}>
                  <Grades />
                </ProtectedRoute>
              }
            />
            <Route
              path="/attendance"
              element={
                <ProtectedRoute requiredPermissions={["attendance.view"]}>
                  <Attendance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/rooms"
              element={
                <ProtectedRoute requiredPermissions={["rooms.view"]}>
                  <Rooms />
                </ProtectedRoute>
              }
            />
            <Route
              path="/inventory"
              element={
                <ProtectedRoute requiredPermissions={["inventory.view"]}>
                  <Inventory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bills"
              element={
                <ProtectedRoute requiredPermissions={["bills.view"]}>
                  <Bills />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payments"
              element={
                <ProtectedRoute requiredPermissions={["payments.view"]}>
                  <Payments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/expenses"
              element={
                <ProtectedRoute requiredPermissions={["expenses.view"]}>
                  <Expenses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/savings"
              element={
                <ProtectedRoute requiredPermissions={["savings.view"]}>
                  <Savings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute requiredPermissions={["settings.view"]}>
                  <Settings />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Guardian portal routes */}
          <Route
            element={
              <GuardianRoute>
                <GuardianLayout />
              </GuardianRoute>
            }
          >
            <Route path="/portal" element={<GuardianPortal />} />
            <Route path="/portal/child" element={<ChildProfile />} />
            <Route path="/portal/grades" element={<PortalGrades />} />
            <Route path="/portal/attendance" element={<PortalAttendance />} />
            <Route path="/portal/bills" element={<PortalBills />} />
            <Route path="/portal/savings" element={<PortalSavings />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
