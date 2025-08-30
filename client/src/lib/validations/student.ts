import { z } from "zod";

export const studentSchema = z
  .object({
    fname: z
      .string()
      .min(1, "First name is required")
      .max(50, "First name must be less than 50 characters"),
    mname: z
      .string()
      .max(50, "Middle name must be less than 50 characters")
      .optional(),
    lname: z
      .string()
      .min(1, "Last name is required")
      .max(50, "Last name must be less than 50 characters"),
    address: z
      .string()
      .min(1, "Address is required")
      .max(255, "Address must be less than 255 characters"),
    gender: z.enum(["Male", "Female", "Other"], {
      required_error: "Please select a gender",
    }),
    dob: z.string().min(1, "Date of birth is required"),
    email: z
      .string()
      .email("Please enter a valid email address")
      .max(100, "Email must be less than 100 characters"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(255, "Password is too long"),
    confirmPassword: z.string(),
    father_name: z
      .string()
      .min(1, "Father's name is required")
      .max(100, "Father's name must be less than 100 characters"),
    father_occu: z
      .string()
      .min(1, "Father's occupation is required")
      .max(100, "Father's occupation must be less than 100 characters"),
    mother_name: z
      .string()
      .min(1, "Mother's name is required")
      .max(100, "Mother's name must be less than 100 characters"),
    mother_occu: z
      .string()
      .min(1, "Mother's occupation is required")
      .max(100, "Mother's occupation must be less than 100 characters"),
    father_phone: z
      .string()
      .min(10, "Father's phone must be at least 10 digits")
      .max(15, "Father's phone must be less than 15 digits"),
    mother_phone: z
      .string()
      .min(10, "Mother's phone must be at least 10 digits")
      .max(15, "Mother's phone must be less than 15 digits"),
    student_cast: z
      .string()
      .min(1, "Caste is required")
      .max(50, "Caste must be less than 50 characters"),
    cast_group: z.enum(["General", "OBC", "SC", "ST", "EWS"], {
      required_error: "Please select a caste group",
    }),
    course: z
      .string()
      .min(1, "Course is required")
      .max(100, "Course must be less than 100 characters"),
    admission_date: z.string().min(1, "Admission date is required"),
    std: z
      .string()
      .min(1, "Standard is required")
      .max(10, "Standard must be less than 10 characters"),
    roll_no: z
      .string()
      .min(1, "Roll number is required")
      .max(20, "Roll number must be less than 20 characters"),
    profile_photo: z.string().url("Must be a valid URL").optional(),
    // div: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type StudentFormData = z.infer<typeof studentSchema>;
