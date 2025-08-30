"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { staffSchema, type StaffFormData } from "@/lib/validations/staff";
import { useState } from "react";
import { registerUser } from "@/services/register/register";
import type { User } from "@/lib/types/User";
import { useToast } from "@/hooks/use-toast";

type InputBlockProps = {
  id: string;
  label: string;
  type?: React.HTMLInputTypeAttribute;
  error?: { message?: string };
} & React.InputHTMLAttributes<HTMLInputElement>;

export function StaffRegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(
    null
  );
  const [submitMessage, setSubmitMessage] = useState("");

  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<StaffFormData>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      role: "Teacher",
    },
  });

  const onSubmit = async (data: StaffFormData) => {
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const [year, month, day] = data.dob.split("-");
      const formattedDob = `${day}-${month}-${year}`;

      const userData: Omit<User, "user_id"> = {
        fname: data.fname,
        mname: data.mname ?? undefined,
        lname: data.lname,
        address: data.address,
        gender: data.gender,
        dob: formattedDob,
        email: data.email,
        phone: data.phone,
        password: data.password,
        role: data.role,
      };

      const response = await registerUser(userData);

      if (!response.status) {
        toast.error("Registration failed");
        throw new Error(response.message || "Registration failed");
      }

      setSubmitStatus("success");
      setSubmitMessage("Staff member registered successfully!");
      toast.success("Staff member registered successfully!");
      reset();
    } catch (error) {
      toast.error("Registration failed. Please try again.");
      setSubmitStatus("error");
      setSubmitMessage(
        error instanceof Error
          ? error.message
          : "Registration failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-7xl mx-auto">
      <CardHeader>
        <CardTitle>Staff Registration</CardTitle>
        <CardDescription>
          Register a new staff member in the system
        </CardDescription>
      </CardHeader>
      <CardContent>
        {submitStatus && (
          <Alert
            variant={submitStatus === "success" ? "default" : "destructive"}
            className="mb-6"
          >
            {submitStatus === "success" ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertDescription>{submitMessage}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputBlock
                id="fname"
                label="First Name *"
                error={errors.fname}
                {...register("fname")}
              />
              <InputBlock
                id="mname"
                label="Middle Name"
                error={errors.mname}
                {...register("mname")}
              />
              <InputBlock
                id="lname"
                label="Last Name *"
                error={errors.lname}
                {...register("lname")}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
                <Select
                  onValueChange={(value) =>
                    setValue("gender", value as StaffFormData["gender"])
                  }
                >
                  <SelectTrigger
                    className={errors.gender ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && (
                  <p className="text-sm text-red-500">
                    {errors.gender.message}
                  </p>
                )}
              </div>

              <InputBlock
                id="dob"
                type="date"
                label="Date of Birth *"
                error={errors.dob}
                {...register("dob")}
                max={new Date().toISOString().split("T")[0]} // Prevent future dates
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Textarea
                id="address"
                {...register("address")}
                placeholder="Enter complete address"
                className={errors.address ? "border-red-500" : ""}
                rows={3}
              />
              {errors.address && (
                <p className="text-sm text-red-500">{errors.address.message}</p>
              )}
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputBlock
                id="email"
                type="email"
                label="Email Address *"
                error={errors.email}
                {...register("email")}
              />
              <InputBlock
                id="phone"
                type="tel"
                label="Phone Number *"
                error={errors.phone}
                {...register("phone")}
              />
            </div>
          </div>

          {/* Role */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Role</h3>
            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Select
                onValueChange={(value) =>
                  setValue("role", value as StaffFormData["role"])
                }
                defaultValue="Teacher"
              >
                <SelectTrigger className={errors.role ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Teacher">Teacher</SelectItem>
                  <SelectItem value="Mentor">Mentor</SelectItem>
                  <SelectItem value="ClassTeacher">Class Teacher</SelectItem>
                  <SelectItem value="SuperAdmin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-sm text-red-500">{errors.role.message}</p>
              )}
            </div>
          </div>

          {/* Account Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Account Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputBlock
                id="password"
                type="password"
                label="Password *"
                error={errors.password}
                {...register("password")}
              />
              <InputBlock
                id="confirmPassword"
                type="password"
                label="Confirm Password *"
                error={errors.confirmPassword}
                {...register("confirmPassword")}
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registering...
                </>
              ) : (
                "Register Staff Member"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => reset()}
              disabled={isSubmitting}
            >
              Reset Form
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

const InputBlock: React.FC<InputBlockProps> = ({
  id,
  label,
  type = "text",
  error,
  ...props
}) => (
  <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    <Input
      id={id}
      type={type}
      className={error ? "border-red-500" : ""}
      {...props}
    />
    {error && <p className="text-sm text-red-500">{error.message}</p>}
  </div>
);
