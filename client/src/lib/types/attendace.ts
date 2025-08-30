export interface AttendanceRecord {
  id: string;
  student_id: number;
  student_name: string;
  roll_no: string;
  status: "present" | "absent" | "late" | "excused";
  date: string;
  marked_by: string;
  marked_at: string;
  notes?: string;
}

export interface AttendanceSession {
  id: string;
  date: string;
  standard: string;
  division: string;
  total_students: number;
  present_count: number;
  absent_count: number;
  late_count: number;
  excused_count: number;
  marked_by: string;
  created_at: string;
  updated_at: string;
}

export interface StudentAttendanceStats {
  student_id: number;
  student_name: string;
  roll_no: string;
  total_days: number;
  present_days: number;
  absent_days: number;
  late_days: number;
  excused_days: number;
  attendance_percentage: number;
}
