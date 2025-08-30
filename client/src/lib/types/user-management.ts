export interface StaffUser {
  user_id: number;
  fname: string;
  mname?: string;
  lname: string;
  email: string;
  phone: string;
  role: string;
  address: string;
  gender: string;
  dob: string;
  created_at: string;
  status: "active" | "inactive" | "suspended";
  last_login?: string;
}

export interface StudentUser {
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
  father_name: string;
  mother_name: string;
  father_phone: string;
  mother_phone: string;
  student_cast: string;
  cast_group: string;
  address: string;
  gender: string;
  dob: string;
  admission_date: string;
  status: "active" | "inactive" | "graduated" | "transferred";
  created_at: string;
}

export interface UserFilters {
  search: string;
  role?: string;
  status?: string;
  gender?: string;
  standard?: string;
  division?: string;
  course?: string;
}
