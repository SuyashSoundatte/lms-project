import { useState, useEffect, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Calendar as CalendarIcon,
  Filter,
  Loader2,
  Search,
} from "lucide-react";
import { format, parseISO, subDays, startOfMonth, endOfMonth } from "date-fns";
import {
  getAttendanceByPhone,
  type StudentAttendanceReport,
} from "@/services/attendance/markAttendance";

type AttendanceStatus = "present" | "absent";

interface StatusCounts {
  present: number;
  absent: number;
  total: number;
}

interface AttendanceRecord {
  date: Date;
  status: AttendanceStatus;
  formattedDate: string;
  dayOfWeek: string;
}

function flattenAttendanceData(
  report: StudentAttendanceReport | undefined
): AttendanceRecord[] {
  if (!report) return [];
  return report.attendance.map((a) => {
    const date = parseISO(a.date);
    return {
      date,
      status: a.status as AttendanceStatus,
      formattedDate: format(date, "MMM dd, yyyy"),
      dayOfWeek: format(date, "EEEE"),
    };
  });
}

export function AttendanceView() {
  const today = new Date();

  const [startDate, setStartDate] = useState<Date>(startOfMonth(today));
  const [endDate, setEndDate] = useState<Date>(endOfMonth(today));
  const [sheetOpen, setSheetOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [attendanceReport, setAttendanceReport] =
    useState<StudentAttendanceReport>();
  const [studentInfo, setStudentInfo] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  /* ─────────────────── Fetch student profile (localStorage) ─────────────────── */
  useEffect(() => {
    const raw = localStorage.getItem("student");
    if (!raw) {
      setError("No student information found. Please log in again.");
      return;
    }
    try {
      setStudentInfo(JSON.parse(raw));
    } catch {
      setError("Failed to load student information");
    }
  }, []);

  /* ───────────────────── Fetch attendance for date range ────────────────────── */
  useEffect(() => {
    if (!studentInfo?.father_phone || !startDate || !endDate) return;

    setLoading(true);
    setError(null);
    setAttendanceReport(undefined);

    getAttendanceByPhone(
      studentInfo.father_phone,
      format(startDate, "yyyy-MM-dd"),
      format(endDate, "yyyy-MM-dd")
    )
      .then((res) => {
        if (res.status && res.data?.length) {
          const record =
            res.data.find((s) => s.student_id === studentInfo.id) ??
            res.data[0];
          setAttendanceReport(record);
        } else {
          setError(res.message || "No attendance records found");
        }
      })
      .catch(() => setError("Failed to fetch attendance records"))
      .finally(() => setLoading(false));
  }, [studentInfo, startDate, endDate]);

  /* ─────────────────────────── Derived projections ──────────────────────────── */
  const attendanceData = useMemo(
    () => flattenAttendanceData(attendanceReport),
    [attendanceReport]
  );

  const filteredAttendanceData = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return attendanceData;
    return attendanceData.filter(
      ({ formattedDate, dayOfWeek, status }) =>
        formattedDate.toLowerCase().includes(q) ||
        dayOfWeek.toLowerCase().includes(q) ||
        status.includes(q)
    );
  }, [attendanceData, searchQuery]);

  const statusCounts = useMemo<StatusCounts>(() => {
    return filteredAttendanceData.reduce(
      (acc, { status }) => {
        acc[status]++;
        acc.total++;
        return acc;
      },
      { present: 0, absent: 0, total: 0 }
    );
  }, [filteredAttendanceData]);

  /* ───────────────────────────── Helper utilities ───────────────────────────── */
  const isDateDisabled = (date: Date, type: "start" | "end") => {
    if (date > today) return true;
    if (type === "start" && date > endDate) return true;
    if (type === "end" && date < startDate) return true;
    return false;
  };

  const quickRange = (days: number) => {
    const past = subDays(today, days);
    setStartDate(past);
    setEndDate(today);
  };

  const thisMonth = () => {
    setStartDate(startOfMonth(today));
    setEndDate(endOfMonth(today));
  };

  const lastMonth = () => {
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    setStartDate(startOfMonth(lastMonth));
    setEndDate(endOfMonth(lastMonth));
  };

  const badgeVariant = (s: AttendanceStatus) =>
    s === "present" ? "default" : "destructive";

  const applyDates = () => setSheetOpen(false);

  /* ─────────────────────────────────── UI ───────────────────────────────────── */
  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <header className="space-y-2">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Attendance Record
        </h1>
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
          {studentInfo
            ? `${studentInfo.fname} ${studentInfo.lname} (${studentInfo.std} ${studentInfo.div})`
            : "View your child's daily attendance history"}
        </p>
      </header>

      {/* Mobile Sheet for Date Selection */}
      <div className="block lg:hidden">
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between h-12 px-4 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  Date Range
                </span>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400 truncate ml-2">
                {format(startDate, "MMM dd")} - {format(endDate, "MMM dd")}
              </span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="bottom"
            className="h-[85vh] p-0 flex flex-col bg-white dark:bg-gray-900"
          >
            <div className="flex-1 overflow-y-auto">
              <SheetHeader className="px-4 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <SheetTitle className="text-left text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Select Date Range
                    </SheetTitle>
                    <SheetDescription className="text-left text-sm text-gray-600 dark:text-gray-400">
                      Choose dates for attendance records
                    </SheetDescription>
                  </div>
                </div>
              </SheetHeader>

              <div className="px-4 py-4 space-y-6">
                {/* Quick Select */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Quick Select
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => quickRange(7)}
                      className="h-10 text-sm"
                    >
                      Last 7 Days
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => quickRange(30)}
                      className="h-10 text-sm"
                    >
                      Last 30 Days
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={thisMonth}
                      className="h-10 text-sm"
                    >
                      This Month
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={lastMonth}
                      className="h-10 text-sm"
                    >
                      Last Month
                    </Button>
                  </div>
                </div>

                {/* Date Pickers */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Start Date
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full h-11 justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {format(startDate, "MMM dd, yyyy")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={(d) => d && setStartDate(d)}
                          disabled={(d) => isDateDisabled(d, "start")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      End Date
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full h-11 justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {format(endDate, "MMM dd, yyyy")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={(d) => d && setEndDate(d)}
                          disabled={(d) => isDateDisabled(d, "end")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            </div>

            {/* Apply Button */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-900">
              <Button onClick={applyDates} className="w-full h-11 font-medium">
                Apply Date Range
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Date Selection */}
      <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 md:p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Date Range Selection
            </h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {format(startDate, "MMM dd, yyyy")} –{" "}
              {format(endDate, "MMM dd, yyyy")}
            </span>
          </div>

          <div className="flex flex-col xl:flex-row gap-4 items-end">
            <div className="flex flex-col md:flex-row gap-3 flex-1">
              <div className="flex flex-col gap-2 flex-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Start Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-start w-full">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(startDate, "MMM dd, yyyy")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(d) => d && setStartDate(d)}
                      disabled={(d) => isDateDisabled(d, "start")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex flex-col gap-2 flex-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  End Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-start w-full">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(endDate, "MMM dd, yyyy")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={(d) => d && setEndDate(d)}
                      disabled={(d) => isDateDisabled(d, "end")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => quickRange(7)}>
                7 Days
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => quickRange(30)}
              >
                30 Days
              </Button>
              <Button variant="outline" size="sm" onClick={thisMonth}>
                This Month
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Stats */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by date, day, or status…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 bg-white dark:bg-gray-800"
            />
          </div>
          {searchQuery && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSearchQuery("")}
              className="shrink-0"
            >
              Clear
            </Button>
          )}
        </div>

        {/* Stats Cards - Mobile Friendly */}
        {filteredAttendanceData.length > 0 && (
          <div className="w-full overflow-x-auto">
            <div className="flex gap-3 md:gap-4 min-w-max pb-2 md:grid md:grid-cols-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 md:p-4 flex-shrink-0 w-[calc(50vw-1.5rem)] md:w-auto">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <div>
                    <div className="text-lg md:text-xl font-semibold text-green-600 dark:text-green-400">
                      {statusCounts.present}
                    </div>
                    <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                      Present
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 md:p-4 flex-shrink-0 w-[calc(50vw-1.5rem)] md:w-auto">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full" />
                  <div>
                    <div className="text-lg md:text-xl font-semibold text-red-600 dark:text-red-400">
                      {statusCounts.absent}
                    </div>
                    <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                      Absent
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 md:p-4 flex-shrink-0 w-[calc(50vw-1.5rem)] md:w-auto">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-400 rounded-full" />
                  <div>
                    <div className="text-lg md:text-xl font-semibold text-gray-600 dark:text-gray-300">
                      {statusCounts.total}
                    </div>
                    <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                      Total Days
                    </div>
                  </div>
                </div>
              </div>

              {attendanceReport && (
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 md:p-4 flex-shrink-0 w-[calc(50vw-1.5rem)] md:w-auto">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full" />
                    <div>
                      <div className="text-lg md:text-xl font-semibold text-blue-600 dark:text-blue-400">
                        {attendanceReport.attendance_percentage.toFixed(1)}%
                      </div>
                      <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                        Overall
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Data Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100">
            {attendanceReport
              ? `${attendanceReport.fname} ${attendanceReport.lname} (${attendanceReport.std} ${attendanceReport.div}) - Roll No: ${attendanceReport.roll_no}`
              : "Attendance Records"}
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12 gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
            <span className="text-gray-600 dark:text-gray-400">
              Loading records…
            </span>
          </div>
        ) : error ? (
          <div className="py-12 text-center">
            <div className="text-red-600 dark:text-red-400 font-medium mb-2">
              Error
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {error}
            </div>
          </div>
        ) : filteredAttendanceData.length ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-900/50">
                  <TableHead className="w-[140px] font-semibold">
                    Date
                  </TableHead>
                  <TableHead className="w-[120px] font-semibold">Day</TableHead>
                  <TableHead className="w-[120px] font-semibold">
                    Status
                  </TableHead>
                  <TableHead className="text-right font-semibold">
                    Indicator
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAttendanceData
                  .sort((a, b) => b.date.getTime() - a.date.getTime())
                  .map((r) => (
                    <TableRow
                      key={r.date.valueOf()}
                      className="hover:bg-gray-50 dark:hover:bg-gray-900/50"
                    >
                      <TableCell className="font-medium">
                        {r.formattedDate}
                      </TableCell>
                      <TableCell className="text-gray-500 dark:text-gray-400">
                        {r.dayOfWeek}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={badgeVariant(r.status)}
                          className="text-xs"
                        >
                          {r.status[0].toUpperCase() + r.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              r.status === "present"
                                ? "bg-green-500"
                                : "bg-red-400"
                            }`}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="py-16 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <CalendarIcon className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No Records Found
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              {searchQuery
                ? `No attendance records match "${searchQuery}".`
                : "No attendance records found for the selected date range."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
