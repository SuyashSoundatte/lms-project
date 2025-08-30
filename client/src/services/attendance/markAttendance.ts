import { apiRequest, METHOD, type ApiResponse } from "../api/api";

export interface AttendanceRecord {
  attendance_id: number;
  std: number; // Standard/grade (e.g., 1, 2, 3...)
  div: string; // Division (e.g., "A", "B", "C")
  student_id: number;
  attendance_date: string;
  status: string;
}

export interface BulkAttendanceRequest {
  std: string;
  div: string;
  attendance_date: string;
  students: {
    student_id: number;
    status: "present" | "absent";
  }[];
}

export interface AttendanceReportRecord {
  student_id: number;
  student_name: string;
  roll_no: string;
  std: string;
  div: string;
  total_days: number;
  present_days: number;
  absent_days: number;
  attendance_percentage: number;
}

interface MarkAttendanceResponse {
  inserted: AttendanceRecord[];
  duplicates: AttendanceRecord[];
}

export interface AttendanceDayRecord {
  date: string; // ISO string, e.g. "2025-07-23"
  status: "present" | "absent";
}

export interface StudentAttendanceReport {
  student_id: number;
  fname: string;
  mname: string;
  lname: string;
  roll_no: string;
  std: string;
  div: string;
  attendance_percentage: number;
  attendance: AttendanceDayRecord[];
}

// --------------------- Attendance API Functions ---------------------

export const markAttendance = async (
  data: BulkAttendanceRequest
): Promise<ApiResponse<MarkAttendanceResponse>> => {
  const response = await apiRequest<MarkAttendanceResponse>({
    method: METHOD.POST,
    url: "/markAttendance",
    data,
    requiresAuth: true,
  });

  return response;
};

export const getClassAttendance = async (
  std: number,
  div: string,
  date?: string
): Promise<ApiResponse<AttendanceRecord[]>> => {
  const url = date
    ? `/attendance/class?std=${std}&div=${div}&date=${date}`
    : `/attendance/class?std=${std}&div=${div}`;

  const response = await apiRequest<AttendanceRecord[]>({
    method: METHOD.GET,
    url,
    requiresAuth: true,
  });

  return response;
};

export const getStudentAttendance = async (
  studentId: number,
  startDate?: string,
  endDate?: string
): Promise<ApiResponse<AttendanceRecord[]>> => {
  let url = `/attendance/student/${studentId}`;

  if (startDate && endDate) {
    url += `?start_date=${startDate}&end_date=${endDate}`;
  } else if (startDate) {
    url += `?start_date=${startDate}`;
  }

  const response = await apiRequest<AttendanceRecord[]>({
    method: METHOD.GET,
    url,
    requiresAuth: true,
  });

  return response;
};

export const getAttendanceReport = async (
  std: string,
  div: string,
  startDate: string,
  endDate: string
): Promise<ApiResponse<AttendanceReportRecord[]>> => {
  const url = `/getAllAttendanceReport?start_date=${startDate}&end_date=${endDate}&std=${std}&div=${div}`;
  // console.log(url)

  const response = await apiRequest<AttendanceReportRecord[]>({
    method: METHOD.GET,
    url,
    requiresAuth: true,
  });

  return response;
};

export const getAttendanceByPhone = async (
  phone: string,
  startDate: string,
  endDate: string
): Promise<ApiResponse<StudentAttendanceReport[]>> => {
  const url = `/getAttendanceByPhone/${phone}?start_date=${startDate}&end_date=${endDate}`;
  const response = await apiRequest<StudentAttendanceReport[]>({
    method: METHOD.GET,
    url,
    requiresAuth: true,
  });
  return response;
};

export const updateAttendance = async (
  attendanceId: number,
  status: string
): Promise<ApiResponse<AttendanceRecord>> => {
  const response = await apiRequest<AttendanceRecord>({
    method: METHOD.PUT,
    url: `/attendance/${attendanceId}`,
    data: { status },
    requiresAuth: true,
  });

  return response;
};

export const deleteAttendance = async (
  attendanceId: number
): Promise<ApiResponse<{ message: string }>> => {
  const response = await apiRequest<{ message: string }>({
    method: METHOD.DELETE,
    url: `/attendance/${attendanceId}`,
    requiresAuth: true,
  });

  return response;
};
