import { BookOpen, GraduationCap, Users, UserCheck, UserPlus, ClipboardList, Home, Calendar, LogOut } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";
import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";

type AdminRole = 'SuperAdmin' | 'ClassTeacher' | 'Mentor' | 'Staff';

interface NavigationItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: AdminRole[];
}

const navigationItems: NavigationItem[] = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: Home,
    roles: ['SuperAdmin', 'ClassTeacher', 'Mentor', 'Staff']
  },
];

const registrationItems: NavigationItem[] = [
  {
    title: "Staff Registration",
    url: "/admin/staff-registration",
    icon: UserPlus,
    roles: ['SuperAdmin']
  },
  {
    title: "Student Registration",
    url: "/admin/student-registration",
    icon: GraduationCap,
    roles: ['SuperAdmin']
  },
];

const allocationItems: NavigationItem[] = [
  {
    title: "Student Allocation",
    url: "/admin/student-allocation",
    icon: Users,
    roles: ['SuperAdmin']
  },
  {
    title: "Teacher Allocation",
    url: "/admin/teacher-allocation",
    icon: UserCheck,
    roles: ['SuperAdmin']
  },
  {
    title: "Class Teacher Allocation",
    url: "/admin/class-teacher-allocation",
    icon: BookOpen,
    roles: ['SuperAdmin']
  },
  {
    title: "Mentor Allocation",
    url: "/admin/mentor-allocation",
    icon: ClipboardList,
    roles: ['SuperAdmin']
  },
];

const attendanceItems: NavigationItem[] = [
  {
    title: "Attendance Dashboard",
    url: "/admin/attendance-system",
    icon: Calendar,
    roles: ['SuperAdmin', 'ClassTeacher']
  },
  {
    title: "Mark Attendance",
    url: "/admin/mark-attendance",
    icon: UserCheck,
    roles: ['SuperAdmin', 'ClassTeacher']
  },
];

const userManagementItems: NavigationItem[] = [
  {
    title: "All Users",
    url: "/admin/all-users",
    icon: Users,
    roles: ['SuperAdmin']
  },
  {
    title: "All Students",
    url: "/admin/all-students",
    icon: GraduationCap,
    roles: ['SuperAdmin']
  },
];

export function AppSidebar() {
  const { logout, initialized, userRoles } = useAuthContext();

  const filterItemsByRole = (items: NavigationItem[]): NavigationItem[] => {
    if (!userRoles) return [];
    return items.filter(item =>
      item.roles.some(role => (userRoles as AdminRole[]).includes(role as AdminRole)))
  };

  if (!initialized) {
    return (
      <div className="flex h-screen w-64 border-r">
        <div className="flex flex-col w-full p-4 gap-4">
          <Skeleton className="h-16 w-full" />
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ))}
          </div>
          <div className="mt-auto">
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  const filteredNavigationItems = filterItemsByRole(navigationItems);
  const filteredRegistrationItems = filterItemsByRole(registrationItems);
  const filteredAllocationItems = filterItemsByRole(allocationItems);
  const filteredAttendanceItems = filterItemsByRole(attendanceItems);
  const filteredUserManagementItems = filterItemsByRole(userManagementItems);

  const shouldShowRegistration = filteredRegistrationItems.length > 0;
  const shouldShowAllocation = filteredAllocationItems.length > 0;
  const shouldShowAttendance = filteredAttendanceItems.length > 0;
  const shouldShowUserManagement = filteredUserManagementItems.length > 0;

  const renderMenuItems = (items: NavigationItem[]) => (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild>
            <Link to={item.url}>
              <item.icon className="size-4" />
              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <BookOpen className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">DKTE LMS</span>
                  <span className="text-xs">Management System</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {filteredNavigationItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              {renderMenuItems(filteredNavigationItems)}
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {shouldShowRegistration && (
          <SidebarGroup>
            <SidebarGroupLabel>Registration</SidebarGroupLabel>
            <SidebarGroupContent>
              {renderMenuItems(filteredRegistrationItems)}
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {shouldShowUserManagement && (
          <SidebarGroup>
            <SidebarGroupLabel>User Management</SidebarGroupLabel>
            <SidebarGroupContent>
              {renderMenuItems(filteredUserManagementItems)}
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {shouldShowAllocation && (
          <SidebarGroup>
            <SidebarGroupLabel>Allocation Management</SidebarGroupLabel>
            <SidebarGroupContent>
              {renderMenuItems(filteredAllocationItems)}
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {shouldShowAttendance && (
          <SidebarGroup>
            <SidebarGroupLabel>Attendance</SidebarGroupLabel>
            <SidebarGroupContent>
              {renderMenuItems(filteredAttendanceItems)}
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3"
              onClick={logout}
            >
              <LogOut className="size-4" />
              <span>Log out</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}