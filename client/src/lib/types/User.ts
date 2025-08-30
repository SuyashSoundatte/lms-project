export interface User {
  user_id: number;
  fname: string;
  mname?: string; // Optional middle name
  lname: string;
  address: string;
  gender: "Male" | "Female" | "Other";
  dob: string;
  email: string;
  phone: string;
  password: string;
  role: "Teacher" | "Mentor" | "ClassTeacher" | "SuperAdmin" | "Admin";

  // These are optional for later use
  teacher_name?: string;
  std?: string;
  div?: string;
  subjects?: string;
  created_at?: string
}
