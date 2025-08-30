import { useAuthContext } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import { Navigate, Outlet } from "react-router-dom";

type AdminRole = 'SuperAdmin' | 'ClassTeacher' | 'Mentor' | 'Staff';
type UserType = 'staff' | 'parent';

interface AuthGuardProps {
  allowedUserTypes?: UserType[];
  allowedRoles?: AdminRole[];
  redirectTo?: string;
  unauthorizedRedirectTo?: string;
  reverse?: boolean;
  loadingComponent?: React.ReactNode;
}

export const AuthGuard = ({
  allowedUserTypes,
  allowedRoles,
  redirectTo = '/login',
  unauthorizedRedirectTo,
  reverse = false,
  loadingComponent,
}: AuthGuardProps) => {
  const { userType, userRoles, isLoading } = useAuthContext();

  if (isLoading) {
    return loadingComponent ?? (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#2B0318]" />
      </div>
    );
  }

  if (reverse) {
    // For login/signup pages - only allow unauthenticated users
    if (userType) {
      const homeRoute = userType === "staff" ? "/admin" : "/parent";
      return <Navigate to={homeRoute} replace />;
    }
    return <Outlet />;
  }

  // Normal route protection
  if (!userType) {
    return <Navigate to={redirectTo} replace />;
  }

  // Check user type first
  if (allowedUserTypes && !allowedUserTypes.includes(userType)) {
    const fallbackRoute = unauthorizedRedirectTo ??
      (userType === "staff" ? "/admin" : "/parent");
    return <Navigate to={fallbackRoute} replace />;
  }

  // Then check roles if specified (only for staff)
  if (allowedRoles && userType === "staff" && userRoles) {
    const hasRequiredRole = allowedRoles.some(role => (userRoles as AdminRole[]).includes(role as AdminRole));
    if (!hasRequiredRole) {
      return <Navigate to={unauthorizedRedirectTo ?? "/admin"} replace />;
    }
  }

  return <Outlet />;
};