"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { User, MapPin, Phone, Mail, GraduationCap } from "lucide-react"
import type { Child } from "@/lib/types/parent"

// Mock data
const mockChild: Child = {
  student_id: 1,
  fname: "John",
  mname: "David",
  lname: "Doe",
  email: "john.doe@student.school.com",
  std: "10",
  div: "A",
  roll_no: "001",
  prn: "PRN2024001",
  course: "Science",
  admission_date: "2024-04-01",
  father_name: "Robert Doe",
  mother_name: "Mary Doe",
  father_phone: "9876543210",
  mother_phone: "9876543211",
  student_cast: "General",
  cast_group: "General",
  address: "123 Main Street, City, State - 123456",
  gender: "Male",
  dob: "2008-05-15",
}

export function ChildProfile() {
  const child = mockChild

  return (
    <div className="space-y-4 md:space-y-6 md:p-0">
      {/* Header */}
      <div className="px-2 md:px-0">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Student Profile</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Complete information about your child
        </p>
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <User className="h-4 w-4 md:h-5 md:w-5" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:gap-6">
            <div className="flex flex-col items-center space-y-3 md:space-y-4">
              <Avatar className="h-24 w-24 md:h-32 md:w-32">
                <AvatarImage src={child.profile_photo || "/placeholder.svg"} />
                <AvatarFallback className="text-xl md:text-2xl">
                  {child.fname[0]}
                  {child.lname[0]}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="text-lg md:text-xl font-semibold">
                  {child.fname} {child.mname} {child.lname}
                </h3>
                <p className="text-sm md:text-base text-muted-foreground">{child.email}</p>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-3 md:space-y-4">
                <div>
                  <label className="text-xs md:text-sm font-medium text-muted-foreground">
                    Student ID
                  </label>
                  <p className="text-base md:text-lg">{child.student_id}</p>
                </div>
                <div>
                  <label className="text-xs md:text-sm font-medium text-muted-foreground">
                    PRN Number
                  </label>
                  <p className="text-base md:text-lg">{child.prn}</p>
                </div>
                <div>
                  <label className="text-xs md:text-sm font-medium text-muted-foreground">
                    Roll Number
                  </label>
                  <p className="text-base md:text-lg">{child.roll_no}</p>
                </div>
                <div>
                  <label className="text-xs md:text-sm font-medium text-muted-foreground">
                    Gender
                  </label>
                  <p className="text-base md:text-lg">{child.gender}</p>
                </div>
              </div>

              <div className="space-y-3 md:space-y-4">
                <div>
                  <label className="text-xs md:text-sm font-medium text-muted-foreground">
                    Date of Birth
                  </label>
                  <p className="text-base md:text-lg">
                    {new Date(child.dob).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="text-xs md:text-sm font-medium text-muted-foreground">
                    Caste
                  </label>
                  <p className="text-base md:text-lg">{child.student_cast}</p>
                </div>
                <div>
                  <label className="text-xs md:text-sm font-medium text-muted-foreground">
                    Category
                  </label>
                  <Badge variant="outline" className="text-xs md:text-sm">
                    {child.cast_group}
                  </Badge>
                </div>
                <div>
                  <label className="text-xs md:text-sm font-medium text-muted-foreground">
                    Admission Date
                  </label>
                  <p className="text-base md:text-lg">
                    {new Date(child.admission_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Academic Information */}
      <Card>
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <GraduationCap className="h-4 w-4 md:h-5 md:w-5" />
            Academic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <div className="grid grid-cols-3 gap-3 md:gap-6">
            <div className="text-center p-4 md:p-6 border rounded-lg">
              <div className="text-2xl md:text-3xl font-bold text-blue-600">{child.std}</div>
              <div className="text-xs md:text-sm text-muted-foreground">Standard</div>
            </div>
            <div className="text-center p-4 md:p-6 border rounded-lg">
              <div className="text-2xl md:text-3xl font-bold text-green-600">{child.div}</div>
              <div className="text-xs md:text-sm text-muted-foreground">Division</div>
            </div>
            <div className="text-center p-4 md:p-6 border rounded-lg">
              <div className="text-base md:text-lg font-bold text-purple-600">{child.course}</div>
              <div className="text-xs md:text-sm text-muted-foreground">Course</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <Phone className="h-4 w-4 md:h-5 md:w-5" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6 space-y-4 md:space-y-6">
          <div>
            <label className="text-xs md:text-sm font-medium text-muted-foreground flex items-center gap-2">
              <MapPin className="h-3 w-3 md:h-4 md:w-4" />
              Address
            </label>
            <p className="text-base md:text-lg mt-1">{child.address}</p>
          </div>

          <Separator className="my-2 md:my-4" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-3 md:space-y-4">
              <h4 className="font-semibold text-base md:text-lg">Father's Information</h4>
              <div>
                <label className="text-xs md:text-sm font-medium text-muted-foreground">Name</label>
                <p className="text-base md:text-lg">{child.father_name}</p>
              </div>
              <div>
                <label className="text-xs md:text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Phone className="h-3 w-3 md:h-4 md:w-4" />
                  Phone Number
                </label>
                <p className="text-base md:text-lg">{child.father_phone}</p>
              </div>
            </div>

            <div className="space-y-3 md:space-y-4">
              <h4 className="font-semibold text-base md:text-lg">Mother's Information</h4>
              <div>
                <label className="text-xs md:text-sm font-medium text-muted-foreground">Name</label>
                <p className="text-base md:text-lg">{child.mother_name}</p>
              </div>
              <div>
                <label className="text-xs md:text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Phone className="h-3 w-3 md:h-4 md:w-4" />
                  Phone Number
                </label>
                <p className="text-base md:text-lg">{child.mother_phone}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Student Email */}
      <Card>
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <Mail className="h-4 w-4 md:h-5 md:w-5" />
            Student Email
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-base md:text-lg">{child.email}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}