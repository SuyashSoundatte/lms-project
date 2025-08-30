import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { Users, GraduationCap, UserCheck, BookOpen, ClipboardList, Calendar, UserPlus } from "lucide-react"
import { Link } from "react-router-dom"
import { useAuthContext } from "@/context/AuthContext"


// SuperAdmin cards
const superAdminCards = [
  {
    title: "Staff Registration",
    description: "Register new staff members and manage their profiles",
    icon: UserPlus,
    href: "/admin/staff-registration",
    color: "bg-blue-500",
  },
  {
    title: "Student Registration",
    description: "Enroll new students and manage student information",
    icon: GraduationCap,
    href: "/admin/student-registration",
    color: "bg-green-500",
  },
  {
    title: "Student Allocation",
    description: "Assign students to classes and manage class rosters",
    icon: Users,
    href: "/admin/student-allocation",
    color: "bg-purple-500",
  },
  {
    title: "Teacher Allocation",
    description: "Assign teachers to subjects and manage teaching schedules",
    icon: UserCheck,
    href: "/admin/teacher-allocation",
    color: "bg-orange-500",
  },
  {
    title: "Class Teacher Allocation",
    description: "Assign class teachers and manage classroom responsibilities",
    icon: BookOpen,
    href: "/admin/class-teacher-allocation",
    color: "bg-red-500",
  },
  {
    title: "Mentor Allocation",
    description: "Assign mentors to students and manage mentorship programs",
    icon: ClipboardList,
    href: "/admin/mentor-allocation",
    color: "bg-teal-500",
  },
  {
    title: "Attendance System",
    description: "Track and manage student and staff attendance",
    icon: Calendar,
    href: "/admin/attendance-system",
    color: "bg-indigo-500",
  },
]

// ClassTeacher cards
const classTeacherCards = [
  {
    title: "Attendance System",
    description: "Track and manage student attendance",
    icon: Calendar,
    href: "/admin/attendance-system",
    color: "bg-indigo-500",
  },
  {
    title: "Mark Attendance",
    description: "Record daily attendance for your class",
    icon: UserCheck,
    href: "/admin/mark-attendance",
    color: "bg-orange-500",
  },
]

// Teacher cards
const teacherCards = [
  {
    title: "My Classes",
    description: "View your assigned classes and subjects",
    icon: BookOpen,
    href: "/admin/my-classes",
    color: "bg-red-500",
  },
  {
    title: "Attendance",
    description: "View attendance records for your classes",
    icon: Calendar,
    href: "/admin/attendance-system",
    color: "bg-indigo-500",
  },
]

const StudnentCount = localStorage.getItem("StudentCount") ?? "N/A";
const SuperAdminCount = localStorage.getItem("SuperAdminCount") ?? "N/A";
const ClassTeacherCount = localStorage.getItem("ClassTeacherCount") ?? "N/A";
const TeacherCount = localStorage.getItem("TeacherCount") ?? "N/A";
const MentorCount = localStorage.getItem("MentorCount") ?? "N/A";

const stats = [
  { label: "Total Students", value: StudnentCount },
  { label: "Total Admins", value: SuperAdminCount },
  { label: "Total Class Teachers", value: ClassTeacherCount },
  { label: "Total Class Mentors", value: MentorCount },
  { label: "Total Teachers", value: TeacherCount },
];
export function DashboardOverview() {
  const { user } = useAuthContext() // Get current user info

  // Determine which cards to show based on role
  const getCardsForRole = () => {
    if (!user) return []

    if (user.role === 'SuperAdmin') {
      return superAdminCards
    } else if (user.role === 'ClassTeacher') {
      return classTeacherCards
    } else if (user.role === 'Teacher') {
      return teacherCards
    }
    return [] // Default for other roles
  }

  // Customize welcome message based on role
  const getWelcomeMessage = () => {
    if (!user) return {
      title: "LMS Dashboard",
      description: "Welcome to the Learning Management System"
    }

    switch (user.role) {
      case 'SuperAdmin':
        return {
          title: "LMS Admin Dashboard",
          description: "Welcome to the Learning Management System administration panel. Manage all aspects of your educational institution from here."
        }
      case 'ClassTeacher':
        return {
          title: "Class Teacher Dashboard",
          description: "Welcome to your class management dashboard. Here you can manage your class attendance and activities."
        }
      case 'Teacher':
        return {
          title: "Teacher Dashboard",
          description: "Welcome to your teaching dashboard. Access your classes and teaching materials here."
        }
      default:
        return {
          title: "LMS Dashboard",
          description: "Welcome to the Learning Management System"
        }
    }
  }

  const welcomeMessage = getWelcomeMessage()
  const cardsToShow = getCardsForRole()

  return (
    <div className="flex flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex-1 space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{welcomeMessage.title}</h1>
          <p className="text-muted-foreground">
            {welcomeMessage.description}
          </p>
        </div>

        {/* Stats Overview - Only show for SuperAdmin */}
        {user?.role === 'SuperAdmin' && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.label}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  {/* <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">{stat.change}</span> from last month
                  </p> */}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-semibold tracking-tight mb-4">Quick Actions</h2>
          {cardsToShow.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {cardsToShow.map((card) => (
                <Card key={card.title} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${card.color} text-white`}>
                        <card.icon className="size-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{card.title}</CardTitle>
                      </div>
                    </div>
                    <CardDescription className="text-sm">{card.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild className="w-full">
                      <Link to={card.href}>Access {card.title}</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No quick actions available for your role.</p>
          )}
        </div>
      </div>
    </div>
  )
}