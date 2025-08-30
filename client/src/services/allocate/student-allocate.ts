import { apiRequest, METHOD, type ApiResponse } from "../api/api";

interface StudentAllocationResult {
  updatedStudents: number[];
  div: string;
  std: string;
  message: string;
}

// Function to allocate students to a division and standard
export const allocateStudentsByStdDiv = async (
  studentIds: number[],
  div: string,
  std?: string
): Promise<ApiResponse<StudentAllocationResult>> => {
  const response = await apiRequest<StudentAllocationResult>({
    method: METHOD.POST,
    url: "/allocateStudentDiv",
    data: { div, std, studentIds },
    requiresAuth: true,
  });

  return response;
};

// Function to transfer students to another division/standard
export const transferStudentsByStdDiv = async (
  studentIds: number[],
  newDiv: string,
  newStd?: string
): Promise<ApiResponse<StudentAllocationResult>> => {
  const response = await apiRequest<StudentAllocationResult>({
    method: METHOD.PUT,
    url: "/transferStudentDiv",
    data: {
      div: newDiv,
      std: newStd,
      studentIds,
      action: "transfer", // You might need this to differentiate in your SP
    },
    requiresAuth: true,
  });

  return response;
};
// Function to deallocate multiple students one by one
export const deallocateStudents = async (
  allocationIds: number[]
): Promise<StudentAllocationResult[]> => {
  const results: StudentAllocationResult[] = [];

  for (const allocationId of allocationIds) {
    const response = await apiRequest<StudentAllocationResult>({
      method: METHOD.DELETE,
      url: `/removeAllocation/${allocationId}`,
      requiresAuth: true,
    });

    results.push(response.data);
  }

  return results;
};
