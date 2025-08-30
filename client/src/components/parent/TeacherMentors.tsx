// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Phone, Mail, User, GraduationCap, Users, MessageCircle } from "lucide-react"
// import type { ClassTeacher, Mentor } from "@/lib/types/parent"

// // Mock data
// const mockClassTeacher: ClassTeacher = {
//   teacher_id: 1,
//   name: "Mrs. Sarah Wilson",
//   email: "sarah.wilson@school.com",
//   phone: "9876543220",
//   subject_specialization: "Mathematics",
//   experience_years: 8,
// }

// const mockMentor: Mentor = {
//   mentor_id: 1,
//   name: "Mr. Michael Brown",
//   email: "michael.brown@school.com",
//   phone: "9876543221",
//   specialization: "Academic Counseling",
//   mentor_group: "Science Group A",
// }

// // Mock subject teachers
// const mockSubjectTeachers = [
//   {
//     teacher_id: 2,
//     name: "Dr. Emily Davis",
//     email: "emily.davis@school.com",
//     phone: "9876543222",
//     subject: "Science",
//     experience_years: 12,
//   },
//   {
//     teacher_id: 3,
//     name: "Mr. Robert Johnson",
//     email: "robert.johnson@school.com",
//     phone: "9876543223",
//     subject: "English",
//     experience_years: 6,
//   },
//   {
//     teacher_id: 4,
//     name: "Ms. Lisa Anderson",
//     email: "lisa.anderson@school.com",
//     phone: "9876543224",
//     subject: "Social Studies",
//     experience_years: 10,
//   },
// ]

// export function TeachersMentors() {
//   const classTeacher = mockClassTeacher
//   const mentor = mockMentor
//   const subjectTeachers = mockSubjectTeachers

//   const getInitials = (name: string) => {
//     return name
//       .split(" ")
//       .map((n) => n[0])
//       .join("")
//       .toUpperCase()
//       .slice(0, 2)
//   }

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold tracking-tight">Teachers & Mentors</h1>
//         <p className="text-muted-foreground">Contact information for your child's teachers and mentors</p>
//       </div>

//       {/* Class Teacher */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <GraduationCap className="h-5 w-5" />
//             Class Teacher
//           </CardTitle>
//           <CardDescription>Primary class teacher responsible for overall academic progress</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="flex flex-col md:flex-row gap-6">
//             <div className="flex items-center space-x-4">
//               <Avatar className="h-16 w-16">
//                 <AvatarImage src={classTeacher.profile_photo || "/placeholder.svg"} />
//                 <AvatarFallback className="text-lg">{getInitials(classTeacher.name)}</AvatarFallback>
//               </Avatar>
//               <div>
//                 <h3 className="text-xl font-semibold">{classTeacher.name}</h3>
//                 <p className="text-muted-foreground">{classTeacher.subject_specialization} Specialist</p>
//                 <Badge variant="outline">{classTeacher.experience_years} years experience</Badge>
//               </div>
//             </div>

//             <div className="flex-1 space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="flex items-center gap-2">
//                   <Mail className="h-4 w-4 text-muted-foreground" />
//                   <span className="text-sm">{classTeacher.email}</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Phone className="h-4 w-4 text-muted-foreground" />
//                   <span className="text-sm">{classTeacher.phone}</span>
//                 </div>
//               </div>

//               <div className="flex gap-2">
//                 <Button size="sm">
//                   <MessageCircle className="mr-2 h-4 w-4" />
//                   Send Message
//                 </Button>
//                 <Button variant="outline" size="sm">
//                   <Phone className="mr-2 h-4 w-4" />
//                   Call
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Mentor */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Users className="h-5 w-5" />
//             Academic Mentor
//           </CardTitle>
//           <CardDescription>Personal mentor for guidance and counseling</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="flex flex-col md:flex-row gap-6">
//             <div className="flex items-center space-x-4">
//               <Avatar className="h-16 w-16">
//                 <AvatarImage src={mentor.profile_photo || "/placeholder.svg"} />
//                 <AvatarFallback className="text-lg">{getInitials(mentor.name)}</AvatarFallback>
//               </Avatar>
//               <div>
//                 <h3 className="text-xl font-semibold">{mentor.name}</h3>
//                 <p className="text-muted-foreground">{mentor.specialization}</p>
//                 <Badge variant="secondary">{mentor.mentor_group}</Badge>
//               </div>
//             </div>

//             <div className="flex-1 space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="flex items-center gap-2">
//                   <Mail className="h-4 w-4 text-muted-foreground" />
//                   <span className="text-sm">{mentor.email}</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Phone className="h-4 w-4 text-muted-foreground" />
//                   <span className="text-sm">{mentor.phone}</span>
//                 </div>
//               </div>

//               <div className="flex gap-2">
//                 <Button size="sm">
//                   <MessageCircle className="mr-2 h-4 w-4" />
//                   Send Message
//                 </Button>
//                 <Button variant="outline" size="sm">
//                   <Phone className="mr-2 h-4 w-4" />
//                   Call
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Subject Teachers */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <User className="h-5 w-5" />
//             Subject Teachers
//           </CardTitle>
//           <CardDescription>Teachers for individual subjects</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="grid gap-4 md:grid-cols-2">
//             {subjectTeachers.map((teacher) => (
//               <div key={teacher.teacher_id} className="flex items-center justify-between p-4 border rounded-lg">
//                 <div className="flex items-center space-x-3">
//                   <Avatar className="h-12 w-12">
//                     <AvatarFallback>{getInitials(teacher.name)}</AvatarFallback>
//                   </Avatar>
//                   <div>
//                     <h4 className="font-semibold">{teacher.name}</h4>
//                     <p className="text-sm text-muted-foreground">{teacher.subject}</p>
//                     <Badge variant="outline" className="text-xs">
//                       {teacher.experience_years} years exp.
//                     </Badge>
//                   </div>
//                 </div>
//                 <div className="flex flex-col gap-1">
//                   <Button variant="outline" size="sm">
//                     <MessageCircle className="h-4 w-4" />
//                   </Button>
//                   <Button variant="outline" size="sm">
//                     <Phone className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </CardContent>
//       </Card>

//       {/* Contact Guidelines */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Contact Guidelines</CardTitle>
//           <CardDescription>Best practices for communicating with teachers and mentors</CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="grid gap-4 md:grid-cols-2">
//             <div>
//               <h4 className="font-semibold mb-2">Office Hours</h4>
//               <ul className="text-sm text-muted-foreground space-y-1">
//                 <li>• Monday - Friday: 9:00 AM - 4:00 PM</li>
//                 <li>• Saturday: 9:00 AM - 12:00 PM</li>
//                 <li>• Sunday: Closed</li>
//               </ul>
//             </div>
//             <div>
//               <h4 className="font-semibold mb-2">Response Time</h4>
//               <ul className="text-sm text-muted-foreground space-y-1">
//                 <li>• Email: Within 24 hours</li>
//                 <li>• Phone calls: Same day</li>
//                 <li>• Urgent matters: Immediate</li>
//               </ul>
//             </div>
//           </div>
//           <div className="p-4 bg-blue-50 rounded-lg">
//             <p className="text-sm text-blue-800">
//               <strong>Note:</strong> For urgent academic or behavioral concerns, please contact the class teacher
//               directly. For personal counseling needs, reach out to the assigned mentor.
//             </p>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

export function TeachersMentors() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold tracking-tight">Teachers & Mentors</h1>
      <p className="text-muted-foreground">
        Contact information for your child's teachers and mentors
      </p>
      <p className="mt-4">
        Teachers and mentors will be displayed here soon ...
      </p>
    </div>
  );
}
