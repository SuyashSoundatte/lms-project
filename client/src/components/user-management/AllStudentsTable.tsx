"use client";

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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  GraduationCap,
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
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { format } from "date-fns";
import { getAllStudents, type Student } from "@/services/GetAll/getall";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTableAdvanced } from "@/components/ui/data-table-advanced";
import { Link } from "react-router-dom";
import { StudentDetailSheet } from "@/components/UserDetailSheet";
import { CLASS_DIVISION_MAP, STD_OPTIONS } from "@/lib/constants/classes";
import { useToast } from "@/hooks/use-toast";

interface StudentFilters {
  search: string;
  gender: string;
  standard: string;
  division: string;
  course: string;
  cast_group: string;
}

export function AllStudentsTable() {
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<StudentFilters>({
    search: "",
    gender: "all",
    standard: "all",
    division: "all",
    course: "all",
    cast_group: "all",
  });
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);
  const [availableDivisions, setAvailableDivisions] = useState<string[]>([]);

  const { toast } = useToast();

  // Update available divisions when standard changes
  useEffect(() => {
    if (filters.standard === "all") {
      setAvailableDivisions([]);
    } else {
      setAvailableDivisions(CLASS_DIVISION_MAP[filters.standard] || []);
      // Reset division filter when standard changes
      setFilters((prev) => ({ ...prev, division: "all" }));
    }
  }, [filters.standard]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getAllStudents();

      if (response) {
        toast.success("Students fetched successfully");
        setAllStudents(response.data);
        applyFilters(response.data, filters);
      } else {
        setError(response || "Failed to fetch students");
      }
    } catch (err) {
      toast.error("Failed to fetch students");
      setError(err instanceof Error ? err.message : "Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (
    students: Student[],
    currentFilters: StudentFilters
  ) => {
    const filtered = students.filter((student) => {
      // Helper function to safely convert to lowercase
      const toLower = (str: string | null | undefined): string => {
        return (str || "").toLowerCase();
      };

      // Helper function to safely check includes for phone numbers
      const safeIncludes = (
        str: string | null | undefined,
        search: string
      ): boolean => {
        return (str || "").includes(search);
      };

      const searchLower = (currentFilters.search || "").toLowerCase();

      const matchesSearch =
        currentFilters.search === "" ||
        toLower(student.fname).includes(searchLower) ||
        toLower(student.mname).includes(searchLower) ||
        toLower(student.lname).includes(searchLower) ||
        toLower(student.email).includes(searchLower) ||
        toLower(student.roll_no).includes(searchLower) ||
        safeIncludes(student.father_phone, currentFilters.search) ||
        safeIncludes(student.mother_phone, currentFilters.search) ||
        toLower(
          `${student.fname || ""} ${student.mname || ""} ${student.lname || ""}`
        ).includes(searchLower) ||
        toLower(`${student.fname || ""} ${student.lname || ""}`).includes(
          searchLower
        );

      const matchesGender =
        currentFilters.gender === "all" ||
        student.gender === currentFilters.gender;
      const matchesStandard =
        currentFilters.standard === "all" ||
        student.std === currentFilters.standard;
      const matchesDivision =
        currentFilters.division === "all" ||
        student.div === currentFilters.division;
      const matchesCourse =
        currentFilters.course === "all" ||
        student.course === currentFilters.course;
      const matchesCastGroup =
        currentFilters.cast_group === "all" ||
        student.cast_group === currentFilters.cast_group;

      return (
        matchesSearch &&
        matchesGender &&
        matchesStandard &&
        matchesDivision &&
        matchesCourse &&
        matchesCastGroup
      );
    });

    setFilteredStudents(filtered);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    applyFilters(allStudents, filters);
  }, [allStudents, filters]);



  const handleStatusChange = async (studentId: number, newStatus: string) => {
    try {
      setError(null);
      console.log(studentId, newStatus);
      setSuccess(`Student status updated successfully`);
      fetchStudents();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update student status"
      );
    }
  };

  const handleDeleteStudent = async (studentId: number) => {
    if (
      !confirm(
        "Are you sure you want to delete this student? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setError(null);
      console.log(studentId);
      setSuccess("Student deleted successfully");
      fetchStudents();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete student");
    }
  };

  const handleExport = async (format: "csv" | "excel" | "pdf") => {
    try {
      setError(null);
      setSuccess(`Export initiated for ${format.toUpperCase()} format`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to export students"
      );
    }
  };

  const handleViewStudentDetails = (student: Student) => {
    setSelectedStudent(student);
    setIsDetailSheetOpen(true);
  };

  const handleSaveStudentChanges = async (updatedStudent: Student) => {
    try {
      setError(null);
      const updatedStudents = allStudents.map((student) =>
        student.student_id === updatedStudent.student_id
          ? updatedStudent
          : student
      );
      setAllStudents(updatedStudents);
      applyFilters(updatedStudents, filters);
      setSuccess("Student updated successfully");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update student");
    }
  };

  const getCourseColor = (course: string | null) => {
    if (!course) return "bg-gray-100 text-gray-800";

    switch (course.toLowerCase()) {
      case "science":
        return "bg-purple-100 text-purple-800";
      case "commerce":
        return "bg-blue-100 text-blue-800";
      case "jee":
        return "bg-green-100 text-green-800";
      case "neet":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getInitials = (fname: string | null, lname: string | null) => {
    return `${fname?.[0] || ""}${lname?.[0] || ""}`.toUpperCase();
  };

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredStudents.slice(startIndex, endIndex);
  };

  // Filter options with null checks
  const courses = [
    ...new Set(
      allStudents
        .map((student) => student.course)
        .filter((course): course is string => !!course)
    ),
  ];
  const genders = [
    ...new Set(
      allStudents
        .map((student) => student.gender)
        .filter((gender): gender is string => !!gender)
    ),
  ];

  const columns: ColumnDef<Student>[] = [
    {
      accessorKey: "roll_no",
      header: "Roll No",
      cell: ({ row }) => (
        <div className="font-medium text-blue-600">
          {row.getValue("roll_no") || "N/A"}
        </div>
      ),
    },
    {
      id: "student",
      header: "Student",
      cell: ({ row }) => {
        const student = row.original;
        return (
          <div
            className="flex items-center space-x-3 cursor-pointer hover:bg-muted/50 p-1 rounded-md transition-colors"
            onClick={() => handleViewStudentDetails(student)}
          >
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={student.profile_photo}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <AvatarFallback>
                {getInitials(student.fname, student.lname)}
              </AvatarFallback>
            </Avatar>

            <div>
              <div className="font-medium">
                {[student.fname, student.mname, student.lname]
                  .filter(Boolean)
                  .join(" ") || "N/A"}
              </div>
              <div className="text-sm text-muted-foreground">
                {student.email || "No email"}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      id: "class_info",
      header: "Class",
      cell: ({ row }) => {
        const student = row.original;
        return (
          <div className="space-y-1">
            <Badge variant="outline">
              {student.std || "N/A"}-{student.div || "N/A"}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "course",
      header: "Course",
      cell: ({ row }) => (
        <Badge
          className={getCourseColor(row.getValue("course"))}
          variant="outline"
        >
          {row.getValue("course") || "N/A"}
        </Badge>
      ),
    },
    {
      accessorKey: "cast_group",
      header: "Category",
      cell: ({ row }) => (
        <Badge variant="outline">{row.getValue("cast_group") || "N/A"}</Badge>
      ),
    },
    {
      id: "parents",
      header: "Parents Contact",
      cell: ({ row }) => {
        const student = row.original;
        return (
          <div className="text-sm space-y-1">
            <div>F: {student.father_phone || "N/A"}</div>
            <div>M: {student.mother_phone || "N/A"}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "admission_date",
      header: "Admitted",
      cell: ({ row }) => {
        const admissionDate = row.getValue("admission_date") as string;
        return admissionDate ? (
          <div className="text-sm">
            {format(new Date(admissionDate), "MMM dd, yyyy")}
          </div>
        ) : (
          <span className="text-muted-foreground">N/A</span>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const student = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => handleViewStudentDetails(student)}
              >
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleViewStudentDetails(student)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Student
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Phone className="mr-2 h-4 w-4" />
                Contact Parents
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleStatusChange(student.student_id, "active")}
              >
                <UserCheck className="mr-2 h-4 w-4" />
                Mark Active
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  handleStatusChange(student.student_id, "inactive")
                }
              >
                <UserX className="mr-2 h-4 w-4" />
                Mark Inactive
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => handleDeleteStudent(student.student_id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Student
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Students</h1>
          <p className="text-muted-foreground">
            Manage all registered students and their information
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
            <Link to="/admin/student-registration">
              <Plus className="mr-2 h-4 w-4" />
              Add Student
            </Link>
          </Button>
        </div>
      </div>

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

      <div className="grid gap-4 md:grid-cols-4 overflow-x-auto pb-2">
        <div className="flex md:contents gap-4 min-w-max md:min-w-0">
          <Card className="min-w-[200px]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Students
              </CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allStudents.length}</div>
              <p className="text-xs text-muted-foreground">
                Registered students
              </p>
            </CardContent>
          </Card>

          <Card className="min-w-[200px]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">JEE Course</CardTitle>
              <GraduationCap className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {allStudents.filter((s) => s.course === "JEE").length}
              </div>
              <p className="text-xs text-muted-foreground">JEE students</p>
            </CardContent>
          </Card>

          <Card className="min-w-[200px]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">NEET Course</CardTitle>
              <GraduationCap className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {allStudents.filter((s) => s.course === "NEET").length}
              </div>
              <p className="text-xs text-muted-foreground">NEET students</p>
            </CardContent>
          </Card>

          <Card className="min-w-[200px]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Filtered Results
              </CardTitle>
              <Filter className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {filteredStudents.length}
              </div>
              <p className="text-xs text-muted-foreground">Matching criteria</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
          <CardDescription>Filter students by various criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
            <Select
              value={filters.standard}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, standard: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All Standards" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Standards</SelectItem>
                {STD_OPTIONS.map((std) => (
                  <SelectItem key={std} value={std}>
                    {std}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.division}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, division: value }))
              }
              disabled={!filters.standard || filters.standard === "all"}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    filters.standard === "all"
                      ? "Select standard first"
                      : "All Divisions"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Divisions</SelectItem>
                {availableDivisions.map((div) => (
                  <SelectItem key={div} value={div}>
                    {div}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.course}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, course: value }))
              }
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
              value={filters.gender}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, gender: value }))
              }
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
              onClick={() => {
                setFilters({
                  search: "",
                  gender: "all",
                  standard: "all",
                  division: "all",
                  course: "all",
                  cast_group: "all",
                });
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Students ({filteredStudents.length})</CardTitle>
          <CardDescription>List of all registered students</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTableAdvanced
            columns={columns}
            data={getPaginatedData()}
            loading={loading}
            searchPlaceholder="Search by name, email, roll number, or parent phone..."
            totalCount={filteredStudents.length}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            onSearch={(searchValue) =>
              setFilters((prev) => ({ ...prev, search: searchValue }))
            }
          />
        </CardContent>
      </Card>

      <StudentDetailSheet
        isOpen={isDetailSheetOpen}
        onClose={() => setIsDetailSheetOpen(false)}
        student={selectedStudent}
        onSave={handleSaveStudentChanges}
      />
    </div>
  );
}
