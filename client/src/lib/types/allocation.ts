export interface Student {
  student_id: number;
  fname: string;
  mname?: string;
  lname: string;
  email: string;
  std: string;
  div: string;
  roll_no: string;
  course: string;
  father_name: string;
  mother_name: string;
  father_phone: string;
  mother_phone: string;
  student_cast: string;
  cast_group: string;
  admission_date: string;
  allocated_class?: string;
  allocated_date?: string;
}

export interface Staff {
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
  allocated_subject?: string;
  allocated_class?: string;
  allocated_date?: string;
}

export interface AllocationAction {
  type: "allocate" | "deallocate";
  selectedIds: number[];
  allocationData?: {
    class?: string;
    subject?: string;
    mentor?: string;
  };
}
