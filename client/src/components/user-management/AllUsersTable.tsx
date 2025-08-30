import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Users,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  Download,
  Plus,
  Eye,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { getAllUsers, type User } from "@/services/GetAll/getall";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTableAdvanced } from "@/components/ui/data-table-advanced";
import { Link } from "react-router-dom";
import { UserDetailSheet } from "@/components/UserDetailSheet";
import { useToast } from "@/hooks/use-toast";

interface UserFilters {
  search: string;
  role: string;
  gender: string;
}

export function AllUsersTable() {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<UserFilters>({
    search: "",
    role: "all",
    gender: "all",
  });
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllUsers();
      if (!response) throw new Error("Failed to fetch users");
      setAllUsers(response.data);
      applyFilters(response.data, searchTerm, filters);
      toast.success("Users fetched successfully");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch users");
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const applyFilters = (
    users: User[],
    search: string,
    currentFilters: UserFilters
  ) => {
    const searchLower = search.toLowerCase();
    const filtered = users.filter((user) => {
      const matchesSearch =
        !search ||
        user.user_id.toString().includes(search) ||
        user.fname.toLowerCase().includes(searchLower) ||
        user.mname?.toLowerCase().includes(searchLower) ||
        user.lname.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.phone.includes(search);

      const matchesRole =
        currentFilters.role === "all" || user.role === currentFilters.role;

      const matchesGender =
        currentFilters.gender === "all" ||
        user.gender === currentFilters.gender;

      return matchesSearch && matchesRole && matchesGender;
    });

    setFilteredUsers(filtered);
  };

  useEffect(() => {
    applyFilters(allUsers, searchTerm, filters);
    setCurrentPage(1);
  }, [allUsers, filters, searchTerm]);

  const handleStatusChange = async (userId: number, newStatus: string) => {
    try {
      console.log(userId, newStatus);
      setError(null);
      // await updateUserStatus(userId, newStatus);
      setSuccess("User status updated successfully");
      fetchUsers();
      setTimeout(() => setSuccess(null), 3_000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update user status"
      );
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (
      !confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    )
      return;
    try {
      console.log(userId);
      setError(null);
      // await deleteUser(userId);
      setSuccess("User deleted successfully");
      fetchUsers();
      setTimeout(() => setSuccess(null), 3_000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete user");
    }
  };

  const handleExport = async (format: "csv" | "excel" | "pdf") => {
    try {
      setError(null);
      // export logic here
      setSuccess(`Export started (${format.toUpperCase()})`);
      setTimeout(() => setSuccess(null), 3_000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to export users");
    }
  };

  const handleSaveUserChanges = async (updatedUser: User) => {
    try {
      setError(null);
      // await updateUser(updatedUser);
      const updated = allUsers.map((u) =>
        u.user_id === updatedUser.user_id ? updatedUser : u
      );
      setAllUsers(updated);
      applyFilters(updated, searchTerm, filters);
      setSuccess("User updated successfully");
      setTimeout(() => setSuccess(null), 3_000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user");
    }
  };

  const getInitials = (fname: string, lname: string) =>
    `${fname?.[0] || ""}${lname?.[0] || ""}`.toUpperCase();

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Principal":
        return "bg-purple-100 text-purple-800";
      case "Teacher":
        return "bg-blue-100 text-blue-800";
      case "Admin":
        return "bg-orange-100 text-orange-800";
      case "Librarian":
        return "bg-teal-100 text-teal-800";
      case "Counselor":
        return "bg-pink-100 text-pink-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaginatedData = () => {
    const start = (currentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  };

  const roles = [...new Set(allUsers.map((u) => u.role).filter(Boolean))];
  const genders = [...new Set(allUsers.map((u) => u.gender).filter(Boolean))];

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "user_id",
      header: "ID",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("user_id")}</div>
      ),
    },
    {
      id: "user",
      header: "User",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div
            className="flex items-center space-x-3 cursor-pointer hover:bg-muted/50 p-1 rounded-md"
            onClick={() => setSelectedUser(user)}
          >
            <Avatar className="h-10 w-10">
              <AvatarFallback>
                {getInitials(user.fname, user.lname)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">
                {user.fname} {user.mname} {user.lname}
              </div>
              <div className="text-sm text-muted-foreground">{user.email}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <Badge className={getRoleColor(row.getValue("role"))} variant="outline">
          {row.getValue("role")}
        </Badge>
      ),
    },
    { accessorKey: "phone", header: "Phone" },
    { accessorKey: "gender", header: "Gender" },
    {
      accessorKey: "address",
      header: "Address",
      cell: ({ row }) => (
        <div className="max-w-[200px] truncate" title={row.getValue("address")}>
          {row.getValue("address")}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSelectedUser(user)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedUser(user)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit User
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleStatusChange(user.user_id, "active")}
              >
                <UserCheck className="mr-2 h-4 w-4" />
                Activate
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusChange(user.user_id, "inactive")}
              >
                <UserX className="mr-2 h-4 w-4" />
                Deactivate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => handleDeleteUser(user.user_id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  /* ------------------------------------------------------------------ */
  /*                              UI                                    */
  /* ------------------------------------------------------------------ */
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div>
          <h1 className="text-3xl font-bold">All Users</h1>
          <p className="text-muted-foreground">
            Manage staff members and their information
          </p>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleExport("csv")}>
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("excel")}>
                Export as Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("pdf")}>
                Export as PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button asChild>
            <Link to="/admin/staff-registration">
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Link>
          </Button>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4 overflow-x-auto pb-2">
        <Card className="min-w-[200px]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allUsers.length}</div>
            <p className="text-xs text-muted-foreground">
              Registered staff members
            </p>
          </CardContent>
        </Card>
        <Card className="min-w-[200px]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Teachers</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {allUsers.filter((u) => u.role === "Teacher").length}
            </div>
            <p className="text-xs text-muted-foreground">Teaching staff</p>
          </CardContent>
        </Card>
        <Card className="min-w-[200px]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Admins</CardTitle>
            <UserCheck className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {allUsers.filter((u) => u.role === "Admin").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Administrative staff
            </p>
          </CardContent>
        </Card>
        <Card className="min-w-[200px]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Filtered Results</CardTitle>
            <Filter className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {filteredUsers.length}
            </div>
            <p className="text-xs text-muted-foreground">Matching criteria</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
          <CardDescription>Filter users by role and gender</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Role */}
            <Select
              value={filters.role}
              onValueChange={(v) => setFilters((p) => ({ ...p, role: v }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {roles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* Gender */}
            <Select
              value={filters.gender}
              onValueChange={(v) => setFilters((p) => ({ ...p, gender: v }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Genders" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genders</SelectItem>
                {genders.map((g) => (
                  <SelectItem key={g} value={g}>
                    {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* Clear */}
            <Button
              variant="outline"
              onClick={() => {
                setFilters({ role: "all", gender: "all", search: "" });
                setSearchTerm("");
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
          <CardDescription>List of registered staff members</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTableAdvanced
            columns={columns}
            data={getPaginatedData()}
            loading={loading}
            searchPlaceholder="Search by ID, name, email, or phone..."
            totalCount={filteredUsers.length}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            onSearch={setSearchTerm}
          />
        </CardContent>
      </Card>

      {/* Detail Sheet */}
      <UserDetailSheet
        isOpen={isDetailSheetOpen}
        onClose={() => setIsDetailSheetOpen(false)}
        user={selectedUser}
        onSave={handleSaveUserChanges}
      />
    </div>
  );
}
