import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScrollToTop } from "@/components/ScrollToTop";
import { DashboardLayout } from "@/components/DashboardLayout";
import { GuardianLayout } from "@/components/GuardianLayout";
import { ProtectedRoute, AdminRoute, GuardianRoute } from "@/components/ProtectedRoute";
import { StudentLayout } from "@/components/StudentLayout";
import { MaintenanceProvider } from "@/contexts/MaintenanceContext";
import { ThemeColorProvider } from "@/contexts/ThemeColorContext";
import PublicLayout from "@/components/PublicLayout";

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
import Users from "./pages/Users";
import ManageHero from "./pages/ManageHero";
import ManageGallery from "./pages/ManageGallery";
import ManageNews from "./pages/ManageNews";
import ContactMessages from "./pages/ContactMessages";
import ManagePrograms from "./pages/ManagePrograms";
import ManageRegistrations from "./pages/ManageRegistrations";
import ManageRegistrationInfo from "./pages/ManageRegistrationInfo";
import Registration from "./pages/Registration";
import RegistrationForm from "./pages/RegistrationForm";
import ReportCardSettings from "./pages/ReportCardSettings";

// Guardian portal pages
import GuardianPortal from "./pages/portal/GuardianPortal";
import ChildProfile from "./pages/portal/ChildProfile";
import PortalGrades from "./pages/portal/PortalGrades";
import PortalAttendance from "./pages/portal/PortalAttendance";
import PortalBills from "./pages/portal/PortalBills";
import PortalSavings from "./pages/portal/PortalSavings";

// Student portal pages
import StudentPortal from "./pages/student/StudentPortal";
import StudentProfile from "./pages/student/StudentProfile";
import StudentSchedule from "./pages/student/StudentSchedule";
import StudentGrades from "./pages/student/StudentGrades";
import StudentAttendance from "./pages/student/StudentAttendance";
import StudentBills from "./pages/student/StudentBills";
import StudentSavings from "./pages/student/StudentSavings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <MaintenanceProvider>
    <ThemeColorProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public routes with shared navbar + footer */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/:id" element={<NewsDetail />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/registration/form" element={<RegistrationForm />} />
          </Route>

          {/* Auth routes (no shared layout) */}
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
              path="/report-card"
              element={
                <ProtectedRoute requiredPermissions={["grades.view"]}>
                  <ReportCardSettings />
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
            <Route
              path="/users"
              element={
                <ProtectedRoute requiredPermissions={["users.view"]}>
                  <Users />
                </ProtectedRoute>
              }
            />
            <Route
              path="/content/hero"
              element={
                <ProtectedRoute requiredPermissions={["content_hero.view"]}>
                  <ManageHero />
                </ProtectedRoute>
              }
            />
            <Route
              path="/content/gallery"
              element={
                <ProtectedRoute requiredPermissions={["content_gallery.view"]}>
                  <ManageGallery />
                </ProtectedRoute>
              }
            />
            <Route
              path="/content/news"
              element={
                <ProtectedRoute requiredPermissions={["content_news.view"]}>
                  <ManageNews />
                </ProtectedRoute>
              }
            />
            <Route
              path="/content/messages"
              element={
                <ProtectedRoute requiredPermissions={["content_messages.view"]}>
                  <ContactMessages />
                </ProtectedRoute>
              }
            />
            <Route
              path="/content/programs"
              element={
                <ProtectedRoute requiredPermissions={["content_programs.view"]}>
                  <ManagePrograms />
                </ProtectedRoute>
              }
            />
            <Route
              path="/content/registration"
              element={
                <ProtectedRoute requiredPermissions={["content_registration.view"]}>
                  <ManageRegistrationInfo />
                </ProtectedRoute>
              }
            />
            <Route
              path="/registrations"
              element={
                <ProtectedRoute requiredPermissions={["registrations.view"]}>
                  <ManageRegistrations />
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

          {/* Student portal routes */}
          <Route
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/student" element={<StudentPortal />} />
            <Route path="/student/profile" element={<StudentProfile />} />
            <Route path="/student/schedule" element={<StudentSchedule />} />
            <Route path="/student/grades" element={<StudentGrades />} />
            <Route path="/student/attendance" element={<StudentAttendance />} />
            <Route path="/student/bills" element={<StudentBills />} />
            <Route path="/student/savings" element={<StudentSavings />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </ThemeColorProvider>
    </MaintenanceProvider>
  </QueryClientProvider>
);

export default App;
