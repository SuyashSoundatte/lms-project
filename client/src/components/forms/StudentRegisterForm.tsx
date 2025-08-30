import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { studentSchema, type StudentFormData } from "@/lib/validations/student"
import { useState } from "react"
import { registerStudent } from "@/services/register/register"
import { useToast } from "@/hooks/use-toast"
import { STD_OPTIONS } from "@/lib/constants/classes"

type InputBlockProps = {
  id: string
  label: string
  type?: React.HTMLInputTypeAttribute
  error?: { message?: string }
} & React.InputHTMLAttributes<HTMLInputElement>

const InputBlock: React.FC<InputBlockProps> = ({ id, label, type = "text", error, ...props }) => (
  <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    <Input id={id} type={type} className={error ? "border-red-500" : ""} {...props} />
    {error && <p className="text-sm text-red-500">{error.message}</p>}
  </div>
)

export function StudentRegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null)
  const [submitMessage, setSubmitMessage] = useState("")
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      gender: "Male",
      std: "",
    }
  })

  const onSubmit = async (formData: StudentFormData) => {
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const submitData = {
        ...formData,
        profile_photo: "https://example.com/default-profile.jpg",
      }

      const { confirmPassword, ...dataToSend } = submitData

      const response = await registerStudent(dataToSend)

      if (!response.status) {
        throw new Error(response.message || "Student registration failed")
      }

      setSubmitStatus("success")
      setSubmitMessage("Student registered successfully!")
      toast.success("Student registered successfully!")
      reset()
    } catch (error) {
      setSubmitStatus("error")
      setSubmitMessage(
        error instanceof Error ? error.message : "Registration failed. Please try again."
      )
      toast.error("Registration failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="max-w-7xl mx-auto">
      <CardHeader>
        <CardTitle>Student Registration</CardTitle>
        <CardDescription>Register a new student in the system</CardDescription>
      </CardHeader>
      <CardContent>
        {submitStatus && (
          <Alert variant={submitStatus === "success" ? "default" : "destructive"} className="mb-6">
            {submitStatus === "success" ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <AlertDescription>{submitMessage}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Student Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Student Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputBlock id="fname" label="First Name *" error={errors.fname} {...register("fname")} />
              <InputBlock id="mname" label="Middle Name" error={errors.mname} {...register("mname")} />
              <InputBlock id="lname" label="Last Name *" error={errors.lname} {...register("lname")} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
                <Select
                  onValueChange={(value) => setValue("gender", value as "Male" | "Female" | "Other")}
                >
                  <SelectTrigger className={errors.gender ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && <p className="text-sm text-red-500">{errors.gender.message}</p>}
              </div>

              <InputBlock
                id="dob"
                type="date"
                label="Date of Birth *"
                error={errors.dob}
                {...register("dob")}
                max={new Date().toISOString().split('T')[0]}
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
              {errors.address && <p className="text-sm text-red-500">{errors.address.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputBlock
                id="email"
                type="email"
                label="Email Address *"
                error={errors.email}
                {...register("email")}
              />
              <InputBlock
                id="password"
                type="password"
                label="Password *"
                error={errors.password}
                {...register("password")}
              />
            </div>

            <InputBlock
              id="confirmPassword"
              type="password"
              label="Confirm Password *"
              error={errors.confirmPassword}
              {...register("confirmPassword")}
            />
          </div>

          {/* Parent Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Parent Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Father Information */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-700">Father's Information</h4>
                <InputBlock
                  id="father_name"
                  label="Father's Name *"
                  error={errors.father_name}
                  {...register("father_name")}
                />
                <InputBlock
                  id="father_occu"
                  label="Father's Occupation *"
                  error={errors.father_occu}
                  {...register("father_occu")}
                />
                <InputBlock
                  id="father_phone"
                  type="tel"
                  label="Father's Phone *"
                  error={errors.father_phone}
                  {...register("father_phone")}
                />
              </div>

              {/* Mother Information */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-700">Mother's Information</h4>
                <InputBlock
                  id="mother_name"
                  label="Mother's Name *"
                  error={errors.mother_name}
                  {...register("mother_name")}
                />
                <InputBlock
                  id="mother_occu"
                  label="Mother's Occupation *"
                  error={errors.mother_occu}
                  {...register("mother_occu")}
                />
                <InputBlock
                  id="mother_phone"
                  type="tel"
                  label="Mother's Phone *"
                  error={errors.mother_phone}
                  {...register("mother_phone")}
                />
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Academic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="std">Standard *</Label>
                <Select
                  onValueChange={(value) => setValue("std", value)}
                >
                  <SelectTrigger className={errors.std ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select standard" />
                  </SelectTrigger>
                  <SelectContent>
                    {STD_OPTIONS.map((std) => (
                      <SelectItem key={std} value={std}>
                        {std}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.std && <p className="text-sm text-red-500">{errors.std.message}</p>}
              </div>

              <InputBlock
                id="roll_no"
                label="Roll Number *"
                error={errors.roll_no}
                {...register("roll_no")}
              />

              <InputBlock
                id="course"
                label="Course *"
                error={errors.course}
                {...register("course")}
              />

              <InputBlock
                id="admission_date"
                type="date"
                label="Admission Date *"
                error={errors.admission_date}
                {...register("admission_date")}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          {/* Caste Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Caste Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputBlock
                id="student_cast"
                label="Caste *"
                error={errors.student_cast}
                {...register("student_cast")}
              />

              <div className="space-y-2">
                <Label htmlFor="cast_group">Caste Group *</Label>
                <Select
                  onValueChange={(value: "General" | "OBC" | "SC" | "ST" | "EWS") =>
                    setValue("cast_group", value)
                  }
                  defaultValue="General"
                >
                  <SelectTrigger className={errors.cast_group ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select caste group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="General">General</SelectItem>
                    <SelectItem value="OBC">OBC</SelectItem>
                    <SelectItem value="SC">SC</SelectItem>
                    <SelectItem value="ST">ST</SelectItem>
                    <SelectItem value="EWS">EWS</SelectItem>
                  </SelectContent>
                </Select>
                {errors.cast_group && <p className="text-sm text-red-500">{errors.cast_group.message}</p>}
              </div>
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
                "Register Student"
              )}
            </Button>
            <Button type="button" variant="outline" onClick={() => reset()} disabled={isSubmitting}>
              Reset Form
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}