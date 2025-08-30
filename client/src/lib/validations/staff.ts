import { z } from "zod";

export const staffSchema = z
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
    phone: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .max(15, "Phone number must be less than 15 digits"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(255, "Password is too long"),
    confirmPassword: z.string(),
    role: z.enum(["Teacher", "Mentor", "ClassTeacher"], {
      required_error: "Please select a role",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type StaffFormData = z.infer<typeof staffSchema>;
