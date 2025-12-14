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
  GraduationCap,
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
  Phone,
} from "lucide-react"
import { format } from "date-fns"
import type { StudentUser, UserFilters } from "@/lib/types/user-management"
import { Link } from "react-router-dom"

// Mock data for students
const mockStudents: StudentUser[] = [
  {
    student_id: 1,
    fname: "John",
    mname: "David",
    lname: "Doe",
    email: "john.doe@student.school.com",
    std: "10",
    div: "A",
    roll_no: "001",
    prn: "PRN2024001",
    course: "Science",
    father_name: "Robert Doe",
    mother_name: "Mary Doe",
    father_phone: "9876543210",
    mother_phone: "9876543211",
    student_cast: "General",
    cast_group: "General",
    address: "123 Main Street, City",
    gender: "Male",
    dob: "2008-05-15",
    admission_date: "2024-04-01",
    status: "active",
    created_at: "2024-04-01T10:30:00Z",
  },
  {
    student_id: 2,
    fname: "Jane",
    lname: "Smith",
    email: "jane.smith@student.school.com",
    std: "10",
    div: "B",
    roll_no: "002",
    prn: "PRN2024002",
    course: "Commerce",
    father_name: "James Smith",
    mother_name: "Jennifer Smith",
    father_phone: "9876543212",
    mother_phone: "9876543213",
    student_cast: "OBC",
    cast_group: "OBC",
    address: "456 Oak Avenue, City",
    gender: "Female",
    dob: "2008-08-20",
    admission_date: "2024-04-02",
    status: "active",
    created_at: "2024-04-02T11:15:00Z",
  },
  {
    student_id: 3,
    fname: "Alice",
    lname: "Johnson",
    email: "alice.johnson@student.school.com",
    std: "11",
    div: "A",
    roll_no: "003",
    prn: "PRN2024003",
    course: "Science",
    father_name: "Andrew Johnson",
    mother_name: "Anna Johnson",
    father_phone: "9876543214",
    mother_phone: "9876543215",
    student_cast: "General",
    cast_group: "General",
    address: "789 Pine Road, City",
    gender: "Female",
    dob: "2007-03-10",
    admission_date: "2024-04-03",
    status: "active",
    created_at: "2024-04-03T09:45:00Z",
  },
  {
    student_id: 4,
    fname: "Bob",
    lname: "Wilson",
    email: "bob.wilson@student.school.com",
    std: "9",
    div: "C",
    roll_no: "004",
    prn: "PRN2024004",
    course: "General",
    father_name: "William Wilson",
    mother_name: "Betty Wilson",
    father_phone: "9876543216",
    mother_phone: "9876543217",
    student_cast: "SC",
    cast_group: "SC",
    address: "321 Elm Street, City",
    gender: "Male",
    dob: "2009-12-05",
    admission_date: "2024-04-04",
    status: "transferred",
    created_at: "2024-04-04T14:20:00Z",
  },
  {
    student_id: 5,
    fname: "Carol",
    lname: "Brown",
    email: "carol.brown@student.school.com",
    std: "12",
    div: "A",
    roll_no: "005",
    prn: "PRN2024005",
    course: "Arts",
    father_name: "Charles Brown",
    mother_name: "Catherine Brown",
    father_phone: "9876543218",
    mother_phone: "9876543219",
    student_cast: "General",
    cast_group: "General",
    address: "654 Maple Drive, City",
    gender: "Female",
    dob: "2006-07-22",
    admission_date: "2024-04-05",
    status: "active",
    created_at: "2024-04-05T16:10:00Z",
  },
]

export function AllStudents() {
  const [students] = useState<StudentUser[]>(mockStudents)
  const [filters, setFilters] = useState<UserFilters>({
    search: "",
    status: "",
    gender: "",
    standard: "",
    division: "",
    course: "",
  })

  // Filter students based on current filters
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch =
        filters.search === "" ||
        student.fname.toLowerCase().includes(filters.search.toLowerCase()) ||
        student.lname.toLowerCase().includes(filters.search.toLowerCase()) ||
        student.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        student.roll_no.includes(filters.search) ||
        student.prn.toLowerCase().includes(filters.search.toLowerCase())

      const matchesStatus = !filters.status || student.status === filters.status
      const matchesGender = !filters.gender || student.gender === filters.gender
      const matchesStandard = !filters.standard || student.std === filters.standard
      const matchesDivision = !filters.division || student.div === filters.division
      const matchesCourse = !filters.course || student.course === filters.course

      return matchesSearch && matchesStatus && matchesGender && matchesStandard && matchesDivision && matchesCourse
    })
  }, [students, filters])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "graduated":
        return "bg-blue-100 text-blue-800"
      case "transferred":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCourseColor = (course: string) => {
    switch (course) {
      case "Science":
        return "bg-purple-100 text-purple-800"
      case "Commerce":
        return "bg-blue-100 text-blue-800"
      case "Arts":
        return "bg-pink-100 text-pink-800"
      case "General":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getInitials = (fname: string, lname: string) => {
    return `${fname[0]}${lname[0]}`.toUpperCase()
  }

  // const handleStatusChange = (studentId: number, newStatus: string) => {
  //   // console.log(`Changing status of student ${studentId} to ${newStatus}`)
  //   // Implement status change logic
  // }

  // const handleDeleteStudent = (studentId: number) => {
  //   // console.log(`Deleting student ${studentId}`)
  //   // Implement delete logic with confirmation
  // }

  // const exportStudents = () => {
  //   // console.log("Exporting students data")
  //   // Implement export functionality
  // }

  const standards = [...new Set(students.map((student) => student.std))].sort()
  const divisions = [...new Set(students.map((student) => student.div))].sort()
  const courses = [...new Set(students.map((student) => student.course))]
  const statuses = ["active", "inactive", "graduated", "transferred"]
  const genders = ["Male", "Female", "Other"]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Students</h1>
          <p className="text-muted-foreground">Manage all registered students and their information</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button asChild>
            <Link to="/student-registration">
              <Plus className="mr-2 h-4 w-4" />
              Add Student
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
            <p className="text-xs text-muted-foreground">Registered students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {students.filter((s) => s.status === "active").length}
            </div>
            <p className="text-xs text-muted-foreground">Currently enrolled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Science Stream</CardTitle>
            <GraduationCap className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {students.filter((s) => s.course === "Science").length}
            </div>
            <p className="text-xs text-muted-foreground">Science students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Graduated</CardTitle>
            <UserX className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {students.filter((s) => s.status === "graduated").length}
            </div>
            <p className="text-xs text-muted-foreground">Completed studies</p>
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
          <CardDescription>Filter students by various criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search students..."
                value={filters.search}
                onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                className="pl-10"
              />
            </div>

            <Select
              value={filters.standard}
              onValueChange={(value) => setFilters((prev) => ({ ...prev, standard: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Standards" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Standards</SelectItem>
                {standards.map((std) => (
                  <SelectItem key={std} value={std}>
                    Standard {std}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.division}
              onValueChange={(value) => setFilters((prev) => ({ ...prev, division: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Divisions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Divisions</SelectItem>
                {divisions.map((div) => (
                  <SelectItem key={div} value={div}>
                    Division {div}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.course}
              onValueChange={(value) => setFilters((prev) => ({ ...prev, course: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Courses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                {courses.map((course) => (
                  <SelectItem key={course} value={course}>
                    {course}
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

            <Button
              variant="outline"
              onClick={() => setFilters({ search: "", status: "", gender: "", standard: "", division: "", course: "" })}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Students List */}
      <Card>
        <CardHeader>
          <CardTitle>Students ({filteredStudents.length})</CardTitle>
          <CardDescription>List of all registered students</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredStudents.map((student) => (
              <div
                key={student.student_id}
                className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={`/placeholder.svg?height=48&width=48`} />
                    <AvatarFallback>{getInitials(student.fname, student.lname)}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold">
                        {student.fname} {student.mname} {student.lname}
                      </h3>
                      <Badge variant="outline">
                        {student.std}-{student.div}
                      </Badge>
                      <Badge className={getCourseColor(student.course)} variant="outline">
                        {student.course}
                      </Badge>
                      <Badge className={getStatusColor(student.status)} variant="outline">
                        {student.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <span>📧 {student.email}</span>
                        <span>🎓 Roll: {student.roll_no}</span>
                        <span>🆔 PRN: {student.prn}</span>
                      </div>
                      <div className="flex items-center gap-4 mt-1">
                        <span>
                          👨‍👩‍👧‍👦 {student.father_name} / {student.mother_name}
                        </span>
                        <span>📞 {student.father_phone}</span>
                        <span>📅 Admitted {format(new Date(student.admission_date), "MMM dd, yyyy")}</span>
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
                      Edit Student
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Phone className="mr-2 h-4 w-4" />
                      Contact Parents
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {student.status === "active" ? (
                      <DropdownMenuItem >
                        <UserX className="mr-2 h-4 w-4" />
                        Mark Inactive
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem >
                        <UserCheck className="mr-2 h-4 w-4" />
                        Mark Active
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Student
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>

          {filteredStudents.length === 0 && (
            <div className="text-center py-12">
              <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Students Found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
