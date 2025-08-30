import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  UserCheck,
  UserX,
  Save,
  CheckCircle,
  AlertCircle,
  Search,
  RotateCcw,
  CalendarIcon,
} from "lucide-react"
import { format } from "date-fns"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useTeacherContext } from "@/context/TeacherContext"
import { getStudentsByClass } from "@/services/attendance/getStudentForAttendance"
import { markAttendance, type BulkAttendanceRequest } from "@/services/attendance/markAttendance"
import { useToast } from "@/hooks/use-toast"

interface Student {
  student_id: number
  fname: string
  mname: string
  lname: string
  roll_no: string
  div: string
  std: string
  status: "present" | "absent"
  profile_photo?: string
  notes?: string
}

export function AttendanceMarkingPage() {
  const selectedDate = new Date() // Fixed to today's date
  const [selectedStd, setSelectedStd] = useState<string>("")
  const [selectedDiv, setSelectedDiv] = useState<string>("")
  const [students, setStudents] = useState<Student[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"success" | "error" | null>(null)
  const [isLoadingStudents, setIsLoadingStudents] = useState(false)

  const { classes, loading } = useTeacherContext()

  const { toast } = useToast()

  // Get unique standards and divisions
  const standards = Array.from(new Set(classes?.map(cls => cls.std) || []))
  const divisions = Array.from(new Set(classes?.map(cls => cls.div) || []))

  useEffect(() => {
    if (standards.length > 0 && !selectedStd) {
      setSelectedStd(standards[0])
    }
    if (divisions.length > 0 && !selectedDiv) {
      setSelectedDiv(divisions[0])
    }
  }, [classes])

  const fetchStudentsForAttendance = async (std: string, div: string) => {
    if (!std || !div) return

    setIsLoadingStudents(true)
    try {
      const studentsResponse = await getStudentsByClass(std, div)
      if (studentsResponse.status && studentsResponse.data.length > 0) {
        const formattedStudents = studentsResponse.data.map((student: any) => ({
          ...student,
          status: "present" as const,
          notes: ""
        }))
        setStudents(formattedStudents)
      } else {
        setStudents([])
      }
    } catch (error) {
      // console.error("Error fetching students:", error)
      setStudents([])
    } finally {
      setIsLoadingStudents(false)
    }
  }

  useEffect(() => {
    if (selectedStd && selectedDiv) {
      fetchStudentsForAttendance(selectedStd, selectedDiv)
    }
  }, [selectedStd, selectedDiv])

  const filteredStudents = students.filter(
    (student) =>
      `${student.fname} ${student.lname}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.roll_no.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const updateStudentStatus = (studentId: number, status: Student["status"], notes?: string) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.student_id === studentId ? { ...student, status, notes: notes || student.notes } : student,
      ),
    )
  }

  const resetAttendance = () => {
    setStudents((prev) => prev.map((student) => ({ ...student, status: "present" as const, notes: "" })))
  }

  const markAllPresent = () => {
    setStudents((prev) => prev.map((student) => ({ ...student, status: "present" as const, notes: "" })))
  }

  const markAllAbsent = () => {
    setStudents((prev) => prev.map((student) => ({ ...student, status: "absent" as const, notes: "" })))
  }

  const saveAttendance = async () => {
    setIsSaving(true);
    setSaveStatus(null);

    try {
      if (!selectedStd || !selectedDiv) {
        throw new Error("Standard and division selection is required");
      }

      const formatDate = (date: Date): string => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const attendanceData: BulkAttendanceRequest = {
        std: selectedStd, // ✅ send as string
        div: selectedDiv,
        attendance_date: formatDate(selectedDate),
        students: students.map(student => ({
          student_id: student.student_id,
          status: student.status,
        })),
      };

      const response = await markAttendance(attendanceData);

      if (response.data.duplicates && response.data.duplicates.length > 0) {
        toast.warning(`Attendance already marked for class ${selectedStd}-${selectedDiv}`);
      } else {
        toast.success(`Attendance taken successfully for ${selectedStd}-${selectedDiv}`);
      }

      setSaveStatus("success");
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      setSaveStatus("error");
      toast.error("Failed to save attendance");
    } finally {
      setIsSaving(false);
    }
  };


  const attendanceStats = {
    present: students.filter((s) => s.status === "present").length,
    absent: students.filter((s) => s.status === "absent").length,
    total: students.length,
  }

  return (
    <div className="min-h-screen md:p-6">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header */}
        <Card>
          <CardHeader className="pb-3 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div>
                <CardTitle className="text-lg md:text-xl">Mark Attendance</CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  {format(selectedDate, "EEE, MMM dd")} • Class {selectedStd}-{selectedDiv}
                </CardDescription>
              </div>

              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" disabled className="px-2 cursor-not-allowed">
                  <CalendarIcon className="h-4 w-4" />
                </Button>
                <Select
                  value={selectedStd}
                  onValueChange={setSelectedStd}
                  disabled={loading || standards.length === 0}
                >
                  <SelectTrigger className="w-20 h-9">
                    <SelectValue placeholder={loading ? "Loading..." : "Std"} />
                  </SelectTrigger>
                  <SelectContent>
                    {standards.map((std) => (
                      <SelectItem key={std} value={std} className="text-sm">
                        {std}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={selectedDiv}
                  onValueChange={setSelectedDiv}
                  disabled={loading || divisions.length === 0}
                >
                  <SelectTrigger className="w-16 h-9">
                    <SelectValue placeholder={loading ? "Loading..." : "Div"} />
                  </SelectTrigger>
                  <SelectContent>
                    {divisions.map((div) => (
                      <SelectItem key={div} value={div} className="text-sm">
                        {div}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0 space-y-3">
            {/* Quick Stats */}
            <div className="flex justify-between gap-1">
              <div className="flex-1 text-center p-1 bg-gray-50 rounded">
                <div className="text-sm font-bold text-gray-900">{attendanceStats.total}</div>
                <div className="text-[10px] text-gray-600">Total</div>
              </div>
              <div className="flex-1 text-center p-1 bg-green-50 rounded">
                <div className="text-sm font-bold text-green-600">{attendanceStats.present}</div>
                <div className="text-[10px] text-green-600">Present</div>
              </div>
              <div className="flex-1 text-center p-1 bg-red-50 rounded">
                <div className="text-sm font-bold text-red-600">{attendanceStats.absent}</div>
                <div className="text-[10px] text-red-600">Absent</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={markAllPresent}
                variant={students.length > 0 && students.every(s => s.status === "present") ? "green" : "outline"}
                size="sm"
                className="h-8 text-xs"
                disabled={students.length === 0}
              >
                <UserCheck className="mr-1 h-3 w-3" />
                All Present
              </Button>
              <Button
                onClick={markAllAbsent}
                variant={students.length > 0 && students.every(s => s.status === "absent") ? "destructive" : "outline"}
                size="sm"
                className="h-8 text-xs"
                disabled={students.length === 0}
              >
                <UserX className="mr-1 h-3 w-3" />
                All Absent
              </Button>
              <Button
                onClick={resetAttendance}
                variant="outline"
                size="sm"
                className="h-8 text-xs col-span-2"
                disabled={students.length === 0}
              >
                <RotateCcw className="mr-1 h-3 w-3" />
                Reset All
              </Button>
            </div>
          </CardContent>
        </Card>

        {saveStatus && (
          <Alert variant={saveStatus === "success" ? "default" : "destructive"}>
            {saveStatus === "success" ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <AlertDescription>
              {saveStatus === "success"
                ? "Attendance saved successfully!"
                : "Failed to save attendance. Please try again."}
            </AlertDescription>
          </Alert>
        )}

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by name or roll number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            disabled={students.length === 0}
          />
        </div>

        {/* Students Table */}
        <Card>
          <CardContent className="p-0">
            {isLoadingStudents ? (
              <div className="p-8 text-center">Loading students...</div>
            ) : students.length === 0 ? (
              <div className="p-8 text-center">
                {selectedStd && selectedDiv ? "No students found for this class" : "Please select standard and division"}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Roll</TableHead>
                    <TableHead className="w-[60px]">Photo</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-right w-[200px]">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.student_id} className="hover:bg-gray-50">
                      <TableCell>{student.roll_no}</TableCell>
                      <TableCell>
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={student.profile_photo} />
                          <AvatarFallback>
                            {student.fname.charAt(0)}{student.lname.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">
                        {student.fname} {student.mname ? `${student.mname} ` : ''}{student.lname}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant={student.status === "present" ? "green" : "outline"}
                            size="sm"
                            onClick={() => updateStudentStatus(student.student_id, "present")}
                            className="h-8 px-3"
                          >
                            Present
                          </Button>
                          <Button
                            variant={student.status === "absent" ? "destructive" : "outline"}
                            size="sm"
                            onClick={() => updateStudentStatus(student.student_id, "absent")}
                            className="h-8 px-3"
                          >
                            Absent
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <div className="sticky bottom-4 z-10">
          <Card className="bg-transparent border-none shadow-none">
            <CardContent className="">
              <Button
                onClick={saveAttendance}
                disabled={isSaving || students.length === 0}
                className="w-full"
                size="lg"
              >
                {isSaving ? (
                  <>
                    <Save className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Attendance ({attendanceStats.present}/{attendanceStats.total})
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}