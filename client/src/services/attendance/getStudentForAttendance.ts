import type { ApiResponse } from "@/services/api/api"; // adjust path accordingly
import { apiRequest, METHOD } from "@/services/api/api";

export interface StudentForAttendance {
  student_id: number;
  fname: string;
  mname: string;
  lname: string;
  address: string;
  gender: string;
  dob: string;
  email: string;
  password?: string;
  father_name?: string;
  father_occu?: string;
  mother_name?: string;
  mother_occu?: string;
  father_phone?: string;
  mother_phone?: string;
  student_cast?: string;
  cast_group?: string;
  course?: string;
  admission_date?: string;
  profile_photo?: string;
  div: string;
  std: string;
  roll_no?: string;
}

export const getStudentsByClass = async (
  std: string | number,
  div: string
): Promise<ApiResponse<StudentForAttendance[]>> => {
  const url = `/getStudentsByClassOrStdDiv?std=${std}&div=${div}`;

  return await apiRequest<StudentForAttendance[]>({
    method: METHOD.GET,
    url,
    requiresAuth: true, // token will be attached from localStorage
  });
};
