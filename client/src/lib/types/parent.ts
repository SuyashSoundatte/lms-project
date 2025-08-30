export interface Child {
  student_id: number;
  fname: string;
  mname?: string;
  lname: string;
  email: string;
  std: string;
  div: string;
  roll_no: string;
  prn: string;
  course: string;
  admission_date: string;
  profile_photo?: string;
  father_name: string;
  mother_name: string;
  father_phone: string;
  mother_phone: string;
  student_cast: string;
  cast_group: string;
  address: string;
  gender: string;
  dob: string;
}

export interface Student {
  student_id: number;
  student_name?: string;
  fname: string;
  mname?: string;
  lname: string;
  address: string;
  gender: string;
  dob: string;
  email: string;
  password: string;
  father_name: string;
  father_occu: string;
  mother_name: string;
  mother_occu: string;
  father_phone: string;
  mother_phone: string;
  student_cast: string;
  cast_group: "General" | "OBC" | "SC" | "ST" | "EWS";
  course: string;
  admission_date: string;
  profile_photo: string;
  div?: string;
  std: string;
  roll_no: string;
}

export interface ExamResult {
  exam_id: number;
  exam_name: string;
  exam_type: "Unit Test" | "Mid Term" | "Final" | "Assignment" | "Project";
  subject: string;
  max_marks: number;
  obtained_marks: number;
  percentage: number;
  grade: string;
  exam_date: string;
  result_date: string;
  remarks?: string;
}

export interface AttendanceRecord {
  date: string;
  status: "present" | "absent" | "late" | "excused";
  notes?: string;
  marked_by: string;
}

export interface ClassTeacher {
  teacher_id: number;
  name: string;
  email: string;
  phone: string;
  subject_specialization: string;
  experience_years: number;
  profile_photo?: string;
}

export interface Mentor {
  mentor_id: number;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  mentor_group: string;
  profile_photo?: string;
}

export interface ParentDashboardData {
  child: Child;
  classTeacher: ClassTeacher;
  mentor: Mentor;
  recentExams: ExamResult[];
  attendanceStats: {
    total_days: number;
    present_days: number;
    absent_days: number;
    late_days: number;
    excused_days: number;
    attendance_percentage: number;
  };
  recentAttendance: AttendanceRecord[];
}
