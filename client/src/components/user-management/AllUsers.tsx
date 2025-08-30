"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Users,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  Download,
  Plus,
  Eye,
} from "lucide-react"
import { format } from "date-fns"
import type { StaffUser, UserFilters } from "@/lib/types/user-management"
import { Link } from "react-router-dom"

// Mock data for staff users
const mockStaffUsers: StaffUser[] = [
  {
    user_id: 1,
    fname: "Sarah",
    mname: "Jane",
    lname: "Wilson",
    email: "sarah.wilson@school.com",
    phone: "9876543210",
    role: "Teacher",
    address: "123 Main Street, City",
    gender: "Female",
    dob: "1985-05-15",
    created_at: "2024-01-15T10:30:00Z",
    status: "active",
    last_login: "2024-01-20T09:15:00Z",
  },
  {
    user_id: 2,
    fname: "Michael",
    lname: "Brown",
    email: "michael.brown@school.com",
    phone: "9876543211",
    role: "Principal",
    address: "456 Oak Avenue, City",
    gender: "Male",
    dob: "1978-08-20",
    created_at: "2024-01-10T14:20:00Z",
    status: "active",
    last_login: "2024-01-21T08:30:00Z",
  },
  {
    user_id: 3,
    fname: "Emily",
    lname: "Davis",
    email: "emily.davis@school.com",
    phone: "9876543212",
    role: "Teacher",
    address: "789 Pine Road, City",
    gender: "Female",
    dob: "1990-03-10",
    created_at: "2024-01-12T11:45:00Z",
    status: "active",
    last_login: "2024-01-19T16:20:00Z",
  },
  {
    user_id: 4,
    fname: "Robert",
    lname: "Johnson",
    email: "robert.johnson@school.com",
    phone: "9876543213",
    role: "Librarian",
    address: "321 Elm Street, City",
    gender: "Male",
    dob: "1982-12-05",
    created_at: "2024-01-08T09:10:00Z",
    status: "inactive",
    last_login: "2024-01-15T14:45:00Z",
  },
  {
    user_id: 5,
    fname: "Lisa",
    lname: "Anderson",
    email: "lisa.anderson@school.com",
    phone: "9876543214",
    role: "Counselor",
    address: "654 Maple Drive, City",
    gender: "Female",
    dob: "1987-07-22",
    created_at: "2024-01-05T13:25:00Z",
    status: "active",
    last_login: "2024-01-20T11:10:00Z",
  },
]

export function AllUsers() {
  const [users] = useState<StaffUser[]>(mockStaffUsers)
  const [filters, setFilters] = useState<UserFilters>({
    search: "",
    role: "",
    status: "",
    gender: "",
  })

  // Filter users based on current filters
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        filters.search === "" ||
        user.fname.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.lname.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.phone.includes(filters.search)

      const matchesRole = !filters.role || user.role === filters.role
      const matchesStatus = !filters.status || user.status === filters.status
      const matchesGender = !filters.gender || user.gender === filters.gender

      return matchesSearch && matchesRole && matchesStatus && matchesGender
    })
  }, [users, filters])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "suspended":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Principal":
        return "bg-purple-100 text-purple-800"
      case "Teacher":
        return "bg-blue-100 text-blue-800"
      case "Admin":
        return "bg-orange-100 text-orange-800"
      case "Librarian":
        return "bg-teal-100 text-teal-800"
      case "Counselor":
        return "bg-pink-100 text-pink-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getInitials = (fname: string, lname: string) => {
    return `${fname[0]}${lname[0]}`.toUpperCase()
  }

  const handleStatusChange = (userId: number, newStatus: string) => {
    console.log(`Changing status of user ${userId} to ${newStatus}`)
    // Implement status change logic
  }

  const handleDeleteUser = (userId: number) => {
    console.log(`Deleting user ${userId}`)
    // Implement delete logic with confirmation
  }

  const exportUsers = () => {
    console.log("Exporting users data")
    // Implement export functionality
  }

  const roles = [...new Set(users.map((user) => user.role))]
  const statuses = ["active", "inactive", "suspended"]
  const genders = ["Male", "Female", "Other"]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Users</h1>
          <p className="text-muted-foreground">Manage all staff members and their information</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportUsers} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button asChild>
            <Link to="/staff-registration">
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">Registered staff members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{users.filter((u) => u.status === "active").length}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Teachers</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{users.filter((u) => u.role === "Teacher").length}</div>
            <p className="text-xs text-muted-foreground">Teaching staff</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive Users</CardTitle>
            <UserX className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{users.filter((u) => u.status === "inactive").length}</div>
            <p className="text-xs text-muted-foreground">Not active</p>
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
          <CardDescription>Filter users by various criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users..."
                value={filters.search}
                onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                className="pl-10"
              />
            </div>

            <Select value={filters.role} onValueChange={(value) => setFilters((prev) => ({ ...prev, role: value }))}>
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

            <Select
              value={filters.status}
              onValueChange={(value) => setFilters((prev) => ({ ...prev, status: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.gender}
              onValueChange={(value) => setFilters((prev) => ({ ...prev, gender: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Genders" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genders</SelectItem>
                {genders.map((gender) => (
                  <SelectItem key={gender} value={gender}>
                    {gender}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={() => setFilters({ search: "", role: "", status: "", gender: "" })}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
          <CardDescription>List of all registered staff members</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div
                key={user.user_id}
                className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={`/placeholder.svg?height=48&width=48`} />
                    <AvatarFallback>{getInitials(user.fname, user.lname)}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">
                        {user.fname} {user.mname} {user.lname}
                      </h3>
                      <Badge className={getRoleColor(user.role)} variant="outline">
                        {user.role}
                      </Badge>
                      <Badge className={getStatusColor(user.status)} variant="outline">
                        {user.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      <div>{user.email}</div>
                      <div className="flex items-center gap-4 mt-1">
                        <span>📞 {user.phone}</span>
                        <span>👤 {user.gender}</span>
                        <span>📅 Joined {format(new Date(user.created_at), "MMM dd, yyyy")}</span>
                        {user.last_login && (
                          <span>🕒 Last login {format(new Date(user.last_login), "MMM dd, yyyy")}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit User
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {user.status === "active" ? (
                      <DropdownMenuItem onClick={() => handleStatusChange(user.user_id, "inactive")}>
                        <UserX className="mr-2 h-4 w-4" />
                        Deactivate
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem onClick={() => handleStatusChange(user.user_id, "active")}>
                        <UserCheck className="mr-2 h-4 w-4" />
                        Activate
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteUser(user.user_id)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete User
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Users Found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
