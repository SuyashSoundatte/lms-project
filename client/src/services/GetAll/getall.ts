import { apiRequest, METHOD } from "../api/api";
import type { User } from "../../lib/types/User";
import type { Student } from "../../lib/types/parent";

interface getAllUserResponse {
  statuscode: number;
  data: User[];
  message: string;
  status: boolean;
}

interface GetAllStudentsResponse {
  statuscode: number;
  data: Student[];
  message: string;
  status: boolean;
}

export type { User } from "../../lib/types/User";
export type { Student } from "../../lib/types/parent";

export const getAllUsers = async (): Promise<getAllUserResponse> => {
  const response = await apiRequest<User[]>({
    method: METHOD.GET,
    url: "/getAllUsers",
    requiresAuth: true,
  });
  // console.log("response for all users in get all", response);
  // console.log(response.data);
  const SuperAdminCount = response.data.filter(
    (user) => user.role === "SuperAdmin"
  ).length;
  const ClassTeacherCount = response.data.filter(
    (user) => user.role === "ClassTeacher"
  ).length;
  const TeacherCount = response.data.filter(
    (user) => user.role === "Teacher"
  ).length;
  const MentorCount = response.data.filter(
    (user) => user.role === "Mentor"
  ).length;

  localStorage.setItem("SuperAdminCount", SuperAdminCount.toString());
  localStorage.setItem("ClassTeacherCount", ClassTeacherCount.toString());
  localStorage.setItem("TeacherCount", TeacherCount.toString());
  localStorage.setItem("MentorCount", MentorCount.toString());

  return response;
};

export const getAllStudents = async (): Promise<GetAllStudentsResponse> => {
  const response = await apiRequest<Student[]>({
    method: METHOD.GET,
    url: "/getAllStudents",
    requiresAuth: true,
  });

  const StudentCount = response.data.length;
  localStorage.setItem("StudentCount", StudentCount.toString());
  // console.log("response", response);
  return response;
};

export const getAllMentors = async (): Promise<getAllUserResponse> => {
  const response = await apiRequest<User[]>({
    method: METHOD.GET,
    url: "/getAllMentors",
    requiresAuth: true,
  });

  // console.log("response", response);
  return response;
};

export const getAllUnallocatedStudents =
  async (): Promise<GetAllStudentsResponse> => {
    const response = await apiRequest<Student[]>({
      method: METHOD.GET,
      url: "/getUnallocatedStudents",
      requiresAuth: true,
    });

    // console.log("response", response);
    return response;
  };

export const getAllocatedStudents =
  async (): Promise<GetAllStudentsResponse> => {
    const response = await apiRequest<Student[]>({
      method: METHOD.GET,
      url: "/getAllocatedStudents",
      requiresAuth: true,
    });

    // console.log("allocated students", response);
    // console.log("response", response);
    return response;
  };

export const getAllUnallocatedUsers = async (): Promise<getAllUserResponse> => {
  const response = await apiRequest<User[]>({
    method: METHOD.GET,
    url: "/getAllUsers",
    requiresAuth: true,
  });

  // console.log("response", response);
  const unallocatedStaffCount = response.data.length;
  localStorage.setItem(
    "unallocatedStaffCount",
    unallocatedStaffCount.toString()
  );
  return response;
};

export const getAllocatedTeachers = async (): Promise<getAllUserResponse> => {
  const response = await apiRequest<User[]>({
    method: METHOD.GET,
    url: "/getAllocatedTeachers",
    requiresAuth: true,
  });

  // console.log("response", response);
  return response;
};

export const getUnallocatedTeachers = async (): Promise<getAllUserResponse> => {
  const response = await apiRequest<User[]>({
    method: METHOD.GET,
    url: "/getUnallocatedTeachers",
    requiresAuth: true,
  });

  // console.log("response", response);
  return response;
};

export const getAllocatedClassTeachers =
  async (): Promise<getAllUserResponse> => {
    const response = await apiRequest<User[]>({
      method: METHOD.GET,
      url: "/getAllocatedClassTeachers",
      requiresAuth: true,
    });

    // console.log("response", response);
    return response;
  };

export const getUnallocatedClassTeachers =
  async (): Promise<getAllUserResponse> => {
    const response = await apiRequest<User[]>({
      method: METHOD.GET,
      url: "/getUnallocatedClassTeachers",
      requiresAuth: true,
    });

    // console.log("response", response);
    return response;
  };

export const getAllocatedMentors = async (): Promise<getAllUserResponse> => {
  const response = await apiRequest<User[]>({
    method: METHOD.GET,
    url: "/getAllocatedMentors",
    requiresAuth: true,
  });

  // console.log("response", response);
  return response;
};

export const getUnallocatedMentors = async (): Promise<getAllUserResponse> => {
  const response = await apiRequest<User[]>({
    method: METHOD.GET,
    url: "/getUnallocatedMentors",
    requiresAuth: true,
  });

  // console.log("response", response);
  return response;
};
// --------------------- Additional API Functions ---------------------

// export const updateUserStatus = async (userId: number, status: string) => {
//   const response = await apiRequest({
//     method: METHOD.PUT,
//     url: `/updateUserStatus/${userId}`,
//     data: { status },
//     requiresAuth: true,
//   });
//   return response;
// };

// export const deleteUser = async (userId: number) => {
//   const response = await apiRequest({
//     method: METHOD.DELETE,
//     url: `/deleteUser/${userId}`,
//     requiresAuth: true,
//   });
//   return response;
// };

// export const updateStudentStatus = async (
//   studentId: number,
//   status: string
// ) => {
//   const response = await apiRequest({
//     method: METHOD.PUT,
//     url: `/updateStudentStatus/${studentId}`,
//     data: { status },
//     requiresAuth: true,
//   });
//   return response;
// };

// export const deleteStudent = async (studentId: number) => {
//   const response = await apiRequest({
//     method: METHOD.DELETE,
//     url: `/deleteStudent/${studentId}`,
//     requiresAuth: true,
//   });
//   return response;
// };
