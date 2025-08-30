import { Suspense } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Outlet,
} from "react-router-dom";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import UserLayout from "@/layouts/UserLayout";
import StaffRegistrationPage from "@/pages/Staff/StaffRegsiter";
import { DashboardOverview } from "@/components/DashboardOverview";
import AttendanceSystemPage from "@/pages/Attendance/Attendance";
import MentorAllocationPage from "@/pages/Staff/MentorAllocation";
import ClassTeacherAllocationPage from "@/pages/Staff/ClassTeacherAllocation";
import TeacherAllocationPage from "@/pages/Staff/TeacherAllocation";
import StudentAllocationPage from "@/pages/Student/StudentAllocation";
import StudentRegistrationPage from "@/pages/Student/StudentRegister";
import SettingsPage from "@/pages/Settings/Settings";
import MarkAttendancePage from "@/pages/Marking/Marking";
import ParentLayout from "@/layouts/ParentLayout";
import ParentDashboardPage from "@/pages/Parent/Parent";
import TeachersMentorsPage from "@/pages/Parent/teacher-mentor/Page";
import AttendancePage from "@/pages/Parent/attendance/Page";
import ExamResultsPage from "@/pages/Parent/exam-result/Page";
import ChildProfilePage from "@/pages/Parent/child-profile/Page";
import LoginPage from "@/pages/Auth/Login";
import { AuthGuard } from "@/components/AuthGuard";
import AllUsersPage from "@/pages/AllUsers/AllUsers";
import AllStudentsPage from "@/pages/AllStudents/AllStudents";
import { Toaster } from "sonner";

// Layout wrappers
const UserLayoutWrapper = () => (
  <UserLayout>
    <Outlet />
  </UserLayout>
);

const ParentLayoutWrapper = () => (
  <ParentLayout>
    <Outlet />
  </ParentLayout>
);

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Public Routes - Only accessible when not logged in */}
      <Route element={<AuthGuard reverse />}>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* Private Admin Routes - Staff with specific roles */}
      <Route
        element={
          <AuthGuard
            allowedUserTypes={["staff"]}
            unauthorizedRedirectTo="/login"
          />
        }
      >
        <Route path="/admin" element={<UserLayoutWrapper />}>
          {/* Dashboard accessible to all staff roles */}
          <Route index element={<DashboardOverview />} />

          {/* SuperAdmin only routes */}
          <Route element={<AuthGuard allowedRoles={["SuperAdmin"]} />}>
            <Route
              path="staff-registration"
              element={<StaffRegistrationPage />}
            />
            <Route
              path="student-registration"
              element={<StudentRegistrationPage />}
            />
            <Route
              path="student-allocation"
              element={<StudentAllocationPage />}
            />
            <Route
              path="teacher-allocation"
              element={<TeacherAllocationPage />}
            />
            <Route
              path="class-teacher-allocation"
              element={<ClassTeacherAllocationPage />}
            />
            <Route
              path="mentor-allocation"
              element={<MentorAllocationPage />}
            />
            <Route path="all-users" element={<AllUsersPage />} />
            <Route path="all-students" element={<AllStudentsPage />} />
          </Route>

          {/* ClassTeacher accessible routes */}
          <Route
            element={
              <AuthGuard allowedRoles={["SuperAdmin", "ClassTeacher"]} />
            }
          >
            <Route
              path="attendance-system"
              element={<AttendanceSystemPage />}
            />
            <Route path="mark-attendance" element={<MarkAttendancePage />} />
          </Route>

          {/* All staff accessible routes */}
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>

      {/* Private Parent Routes */}
      <Route
        element={
          <AuthGuard
            allowedUserTypes={["parent"]}
            unauthorizedRedirectTo="/login"
          />
        }
      >
        <Route path="/parent" element={<ParentLayoutWrapper />}>
          <Route index element={<ParentDashboardPage />} />
          <Route path="child-profile" element={<ChildProfilePage />} />
          <Route path="exam-results" element={<ExamResultsPage />} />
          <Route path="attendance" element={<AttendancePage />} />
          <Route path="teachers-mentors" element={<TeachersMentorsPage />} />
        </Route>
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<h1>404 Page Not Found</h1>} />
    </>
  )
);

const AppRoutes: React.FC = () => {
  return (
    <>
      <Suspense fallback={<LoadingSpinner />}>
        <RouterProvider router={router} />
      </Suspense>
      <Toaster position="top-right" richColors />
    </>
  );
};

export default AppRoutes;
