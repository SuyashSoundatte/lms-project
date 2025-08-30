import { apiRequest, METHOD, type ApiResponse } from "../api/api";

interface ClassTeacherAssignmentResult {
  result: {
    recordsets: [
      {
        status: number;
        message: string;
      }[]
    ];
    recordset: {
      status: number;
      message: string;
    }[];
    output: object;
    rowsAffected: unknown[];
  };
}

// Function to assign class teacher by standard and division
export const assignClassTeacherByStdDiv = async (
  userId: number,
  std: string,
  div: string
): Promise<ApiResponse<ClassTeacherAssignmentResult>> => {
  const response = await apiRequest<ClassTeacherAssignmentResult>({
    method: METHOD.POST,
    url: "/assignClassTeacher",
    data: { userId, std, div },
    requiresAuth: true,
  });

  // console.log("Assign class teacher response:", response);
  return response;
};

export const assignMentorByStdDiv = async (
  userId: number,
  std: string,
  div: string
): Promise<ApiResponse<ClassTeacherAssignmentResult>> => {
  const response = await apiRequest<ClassTeacherAssignmentResult>({
    method: METHOD.POST,
    url: "/assignMentor",
    data: { userId, std, div },
    requiresAuth: true,
  });

  // console.log("Assign class teacher response:", response);
  return response;
};

// Function to deallocate class teacher using allocation_id
export const deassign = async (
  allocationId: number
): Promise<ApiResponse<ClassTeacherAssignmentResult>> => {
  const response = await apiRequest<ClassTeacherAssignmentResult>({
    method: METHOD.DELETE,
    url: `/removeAllocation/${allocationId}`, 
    requiresAuth: true,
  });

  // console.log("Deassign class teacher response:", response);
  return response;
};
