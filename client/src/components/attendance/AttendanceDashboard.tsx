import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CalendarIcon,
  Download,
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  Loader2,
  Plus,
  Search,
} from "lucide-react";
import { format, subWeeks, subMonths } from "date-fns";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { useTeacherContext } from "@/context/TeacherContext";
import {
  getAttendanceReport,
  type AttendanceReportRecord,
} from "@/services/attendance/markAttendance";

import {
  exportTableToExcelWithDateRange,
  exportTableToPDFWithDateRange,
  type ExportColumn,
} from "@/utils/exportTable";
import { Input } from "../ui/input";

interface TeacherClass {
  allocation_id: number;
  std: string;
  div: string;
}

export function AttendanceDashboard() {
  const { loading } = useTeacherContext();
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedStd, setSelectedStd] = useState<string>("");
  const [selectedDiv, setSelectedDiv] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [teacherClasses, setTeacherClasses] = useState<TeacherClass[]>([]);

  const [dateRange, setDateRange] = useState<
    "week" | "month" | "term" | "custom"
  >("month");
  const [startDate, setStartDate] = useState<Date>(subMonths(new Date(), 1));
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [attendanceData, setAttendanceData] = useState<
    AttendanceReportRecord[]
  >([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [reportsError, setReportsError] = useState<string | null>(null);

  const [exportPdfLoading, setExportPdfLoading] = useState(false);
  const [exportExcelLoading, setExportExcelLoading] = useState(false);

  // Search state for filtering students
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const storedClasses = localStorage.getItem("teacherClasses");
    if (storedClasses) {
      try {
        const parsedClasses: TeacherClass[] = JSON.parse(storedClasses);
        setTeacherClasses(parsedClasses);
        if (parsedClasses.length > 0) {
          const firstClass = parsedClasses[0];
          setSelectedStd(firstClass.std);
          setSelectedDiv(firstClass.div);
          setSelectedClass(`${firstClass.std}-${firstClass.div}`);
        }
      } catch {
        setError("Failed to load teacher classes");
      }
    } else {
      setError("No classes found. Please contact administrator.");
    }
  }, []);

  const fetchAttendanceReport = async () => {
    if (!selectedStd || !selectedDiv) return;

    setReportsLoading(true);
    setReportsError(null);

    try {
      const startDateStr = format(startDate, "yyyy-MM-dd");
      const endDateStr = format(endDate, "yyyy-MM-dd");

      const response = await getAttendanceReport(
        selectedStd,
        selectedDiv,
        startDateStr,
        endDateStr
      );

      if (
        response.status === true &&
        response.statuscode === 200 &&
        response.data
      ) {
        setAttendanceData(response.data);
      } else {
        setReportsError(
          response.message || "Failed to fetch attendance report"
        );
      }
    } catch {
      setReportsError("Failed to fetch attendance report");
    } finally {
      setReportsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedStd && selectedDiv) {
      fetchAttendanceReport();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStd, selectedDiv, startDate, endDate]);

  const standards = useMemo(
    () => Array.from(new Set(teacherClasses.map((c) => c.std))),
    [teacherClasses]
  );
  const divisions = useMemo(
    () => Array.from(new Set(teacherClasses.map((c) => c.div))),
    [teacherClasses]
  );

  const handleClassChange = (std: string, div: string) => {
    setSelectedStd(std);
    setSelectedDiv(div);
    setSelectedClass(`${std}-${div}`);
  };

  const hasMultipleClasses = teacherClasses.length > 1;

  const handleDateRangeChange = (
    range: "week" | "month" | "term" | "custom"
  ) => {
    setDateRange(range);
    const today = new Date();
    switch (range) {
      case "week":
        setStartDate(subWeeks(today, 1));
        setEndDate(today);
        break;
      case "month":
        setStartDate(subMonths(today, 1));
        setEndDate(today);
        break;
      case "term":
        setStartDate(subMonths(today, 3));
        setEndDate(today);
        break;
      case "custom":
        // handled by calendar in UI
        break;
    }
  };

  const exportColumns: ExportColumn[] = [
    { header: "Roll No", key: "roll_no" },
    { header: "Student Name", key: "student_name" },
    { header: "Present", key: "present_days" },
    { header: "Absent", key: "absent_days" },
    { header: "Total", key: "total_days" },
    { header: "Percentage (%)", key: "attendance_percentage" },
    { header: "Status", key: "status" },
  ];

  // Helper function to safely get attendance percentage
  const getAttendancePercentage = (
    percentage: number | undefined | null
  ): number => {
    return typeof percentage === "number" && !isNaN(percentage)
      ? percentage
      : 0;
  };

  // Fixed exportData with proper null checks
  const exportData = attendanceData.map((student) => {
    const safePercentage = getAttendancePercentage(
      student.attendance_percentage
    );
    return {
      ...student,
      attendance_percentage: safePercentage.toFixed(1),
      status:
        safePercentage >= 95
          ? "Excellent"
          : safePercentage >= 85
          ? "Good"
          : "At Risk",
    };
  });

  const formatDateRangeString = () =>
    `${format(startDate, "yyyy-MM-dd").replace(/-/g, "")}_${format(
      endDate,
      "yyyy-MM-dd"
    ).replace(/-/g, "")}`;

  const exportReport = async (exportFormat: "pdf" | "excel") => {
    if (attendanceData.length === 0) return;

    if (exportFormat === "excel") {
      setExportExcelLoading(true);
      try {
        await new Promise((r) => setTimeout(r, 50));
        exportTableToExcelWithDateRange(
          exportData,
          exportColumns,
          format(startDate, "yyyy-MM-dd"),
          format(endDate, "yyyy-MM-dd"),
          selectedStd,
          selectedDiv,
          `Attendance_${selectedClass}_${formatDateRangeString()}.xlsx`
        );
      } finally {
        setExportExcelLoading(false);
      }
    } else {
      setExportPdfLoading(true);
      try {
        await new Promise((r) => setTimeout(r, 50));
        exportTableToPDFWithDateRange(
          exportData,
          exportColumns,
          format(startDate, "yyyy-MM-dd"),
          format(endDate, "yyyy-MM-dd"),
          `Attendance Report – Class ${selectedClass}`,
          `Attendance_${selectedClass}_${formatDateRangeString()}.pdf`
        );
      } finally {
        setExportPdfLoading(false);
      }
    }
  };

  const getAttendanceColor = (percentage: number) =>
    percentage >= 95
      ? "text-green-600"
      : percentage >= 85
      ? "text-yellow-600"
      : "text-red-600";

  const getAttendanceBadge = (percentage: number) =>
    percentage >= 95
      ? "default"
      : percentage >= 85
      ? "secondary"
      : "destructive";

  // Fixed summaryStats with proper null checks
  const summaryStats = {
    classAverage:
      attendanceData.length > 0
        ? (() => {
            const validStudents = attendanceData.filter(
              (s) => s.attendance_percentage != null
            );
            if (validStudents.length === 0) return "0";
            const sum = validStudents.reduce(
              (sum, s) =>
                sum + getAttendancePercentage(s.attendance_percentage),
              0
            );
            return (sum / validStudents.length).toFixed(1);
          })()
        : "0",
    perfectAttendance: attendanceData.filter(
      (s) => getAttendancePercentage(s.attendance_percentage) === 100
    ).length,
    atRisk: attendanceData.filter(
      (s) => getAttendancePercentage(s.attendance_percentage) < 85
    ).length,
    totalSessions: attendanceData.length > 0 ? attendanceData[0].total_days : 0,
  };

  // Filter attendance data by search query
  const filteredAttendanceData = useMemo(() => {
    if (!searchQuery.trim()) return attendanceData;
    return attendanceData.filter((student) =>
      student.student_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [attendanceData, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight">
            Attendance Management
          </h2>
          <p className="text-sm text-muted-foreground">
            {selectedClass
              ? `Managing attendance for Class ${selectedClass}`
              : "Manage attendance across all classes"}
          </p>
        </div>

        <div className="flex gap-2 items-center">
          {hasMultipleClasses && (
            <>
              <Select
                value={selectedStd}
                onValueChange={(value) => {
                  const cls = teacherClasses.find((c) => c.std === value);
                  if (cls) handleClassChange(value, cls.div);
                }}
                disabled={loading || standards.length === 0}
              >
                <SelectTrigger className="w-20 h-9">
                  <SelectValue placeholder={loading ? "Loading..." : "Std"} />
                </SelectTrigger>
                <SelectContent>
                  {standards.map((std) => (
                    <SelectItem key={std} value={std}>
                      {std}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={selectedDiv}
                onValueChange={(value) => handleClassChange(selectedStd, value)}
                disabled={loading || divisions.length === 0}
              >
                <SelectTrigger className="w-16 h-9">
                  <SelectValue placeholder={loading ? "Loading..." : "Div"} />
                </SelectTrigger>
                <SelectContent>
                  {divisions.map((div) => (
                    <SelectItem key={div} value={div}>
                      {div}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          )}
          <Button asChild>
            <Link to="/admin/mark-attendance">
              <Plus className="mr-2 h-4 w-4" />
              Mark Today's Attendance
            </Link>
          </Button>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="mb-6">
        <div className="flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-2 lg:grid-cols-4">
          {/* Class Average */}
          <Card className="min-w-[220px] flex-shrink-0 md:min-w-auto">
            <CardHeader className="flex items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Class Average
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {summaryStats.classAverage}%
              </div>
              <p className="text-xs text-muted-foreground">
                Based on {attendanceData.length} students
              </p>
            </CardContent>
          </Card>
          {/* Perfect Attendance */}
          <Card className="min-w-[220px] flex-shrink-0 md:min-w-auto">
            <CardHeader className="flex items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Perfect Attendance
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {summaryStats.perfectAttendance}
              </div>
              <p className="text-xs text-muted-foreground">
                Students with 100% attendance
              </p>
            </CardContent>
          </Card>
          {/* At Risk */}
          <Card className="min-w-[220px] flex-shrink-0 md:min-w-auto">
            <CardHeader className="flex items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">At Risk</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {summaryStats.atRisk}
              </div>
              <p className="text-xs text-muted-foreground">
                Students below 85% attendance
              </p>
            </CardContent>
          </Card>
          {/* Total Days */}
          <Card className="min-w-[220px] flex-shrink-0 md:min-w-auto">
            <CardHeader className="flex items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Days</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {summaryStats.totalSessions}
              </div>
              <p className="text-xs text-muted-foreground">
                In selected period
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {error && (
        <div className="p-4 text-red-600 bg-red-50 rounded-md">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Attendance Reports */}
      <div className="flex flex-wrap gap-4 items-end mb-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Date Range</label>
          <Select value={dateRange} onValueChange={handleDateRangeChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="term">This Term</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {dateRange === "custom" && (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    className={cn(
                      "w-[140px] justify-start text-left font-normal"
                    )}
                    variant="outline"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(startDate, "MMM dd")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => date && setStartDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">End Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    className={cn(
                      "w-[140px] justify-start text-left font-normal"
                    )}
                    variant="outline"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(endDate, "MMM dd")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => date && setEndDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </>
        )}

        <div className="flex gap-2">
          <Button
            onClick={() => exportReport("pdf")}
            variant="outline"
            disabled={reportsLoading || exportPdfLoading}
          >
            {exportPdfLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            Export PDF
          </Button>
          <Button
            onClick={() => exportReport("excel")}
            variant="outline"
            disabled={reportsLoading || exportExcelLoading}
          >
            {exportExcelLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            Export Excel
          </Button>
        </div>
      </div>

      {/* Student Search Bar */}
      <div className="mb-3 flex items-center max-w-xs">
        <div className="relative w-full">
          <Input
            type="text"
            className="pl-9 pr-3 py-2 border rounded shadow-sm w-full focus:outline-none focus:ring"
            placeholder="Search student name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Search className="h-4 w-4" />
          </span>
        </div>
      </div>

      {reportsError && (
        <div className="p-4 text-red-600 bg-red-50 rounded-md mb-6">
          <strong>Error:</strong> {reportsError}
        </div>
      )}

      {reportsLoading ? (
        <div className="flex items-center justify-center space-x-2 py-8">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading attendance report...</span>
        </div>
      ) : (
        <>
          {/* Attendance Table */}
          {filteredAttendanceData.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No attendance data found for the selected period
              {searchQuery ? " or matching your search." : "."}
            </p>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Roll No</TableHead>
                    <TableHead className="w-[200px]">Student Name</TableHead>
                    <TableHead>Present</TableHead>
                    <TableHead>Absent</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Percentage</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAttendanceData.map((student, index) => {
                    const safePercentage = getAttendancePercentage(
                      student.attendance_percentage
                    );
                    // Create unique key with multiple fallbacks
                    const uniqueKey = student.student_id
                      ? `student-${student.student_id}`
                      : student.roll_no
                      ? `roll-${student.roll_no}`
                      : `index-${index}`;

                    return (
                      <TableRow key={uniqueKey}>
                        <TableCell>{student.roll_no}</TableCell>
                        <TableCell className="font-medium">
                          {student.student_name}
                        </TableCell>
                        <TableCell>{student.present_days}</TableCell>
                        <TableCell>{student.absent_days}</TableCell>
                        <TableCell>{student.total_days}</TableCell>
                        <TableCell
                          className={`font-bold ${getAttendanceColor(
                            safePercentage
                          )}`}
                        >
                          {safePercentage.toFixed(1)}%
                        </TableCell>
                        <TableCell>
                          <Badge variant={getAttendanceBadge(safePercentage)}>
                            {safePercentage >= 95
                              ? "Excellent"
                              : safePercentage >= 85
                              ? "Good"
                              : "At Risk"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
