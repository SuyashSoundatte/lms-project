import { apiRequest, METHOD } from "../api/api";
import type { User } from "../../lib/types/User";
import type { Student } from "../../lib/types/parent";

interface ApiResponse<T> {
  statuscode: number;
  data: T;
  message: string;
  status: boolean;
}

export const registerUser = async (
  userData: Omit<User, "user_id">
): Promise<ApiResponse<User>> => {
  try {
    const response = await apiRequest<User>({
      method: METHOD.POST,
      url: "/createUser",
      data: userData,
      requiresAuth: true,
    });

    if (!response.status) {
      throw new Error(response.message || "User registration failed");
    }

    // console.log("User registration successful:", response);
    return response;
  } catch (error) {
    // console.error("User registration error:", error);
    throw error;
  }
};

export const registerStudent = async (
  studentData: Omit<Student, "student_id">
): Promise<ApiResponse<Student>> => {
  try {
    // Format dates to match expected API format (YYYY-MM-DD)
    const formattedData = {
      ...studentData,
      dob: formatDateForAPI(studentData.dob),
      admission_date: formatDateForAPI(studentData.admission_date),
    };

    const response = await apiRequest<Student>({
      method: METHOD.POST,
      url: "/createStudent",
      data: formattedData,
      requiresAuth: true,
    });

    if (!response.status) {
      throw new Error(response.message || "Student registration failed");
    }

    // console.log("Student registration successful:", response);
    return response;
  } catch (error) {
    // console.error("Student registration error:", error);
    throw error;
  }
};

// Helper function to format dates for API
const formatDateForAPI = (dateString: string): string => {
  if (!dateString) return "";

  try {
    // Convert from any format to YYYY-MM-DD
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date format");
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  } catch (error) {
    // console.error("Date formatting error:", error);
    return dateString; // Return original if formatting fails
  }
};
