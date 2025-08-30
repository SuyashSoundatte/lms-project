import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, LogOut, Settings } from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

export function UserProfile() {
  const {
    user,
    student,
    initialized,
    isLoading,
    logout,
    userType
  } = useAuthContext();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getUserData = () => {
    if (userType === 'staff' && user) {
      return {
        name: `${user.fname} ${user.lname}`,
        identifier: user.email,
        role: user.role
      };
    }
    if (userType === 'parent' && student) {
      return {
        name: student.fname,
        identifier: student.father_phone || student.mother_phone,
        role: 'parent'
      };
    }
    return null;
  };

  // Show loading skeleton while auth state is initializing
  if (!initialized || isLoading) {
    return (
      <div className="flex items-center space-x-4 px-4 py-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-3 w-[80px]" />
        </div>
      </div>
    );
  }

  const userData = getUserData();
  if (!userData) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-full justify-start">
          <Avatar className="h-8 w-8 mr-3">
            <AvatarFallback className="bg-blue-600 text-white">
              {getInitials(userData.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium">{userData.name}</span>
            <span className="text-xs text-muted-foreground capitalize">
              {userData.role}
            </span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userData.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {userData.identifier}
            </p>
            <p className="text-xs leading-none text-muted-foreground capitalize">
              {userData.role}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Account Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout} className="text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}