import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  GraduationCap,
  Calendar,
  FileText,
  Phone,
  MapPin,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

type StudentData = {
  student_id: number;
  fname: string;
  mname: string;
  lname: string;
  address: string;
  admission_date: string;
  cast_group: string;
  course: string;
  div: string;
  dob: string;
  email: string;
  father_name: string;
  father_occu: string;
  father_phone: string;
  gender: string;
  mother_name: string;
  mother_occu: string;
  mother_phone: string;
  profile_photo: string;
  role: string;
  roll_no: string;
  std: string;
  student_cast: string;
} | null;

export function ParentDashboard() {
  const [studentData, setStudentData] = useState<StudentData>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentData = () => {
      try {
        const storedData = localStorage.getItem("student");
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setStudentData(parsedData);
        }
      } catch (error) {
        console.error("Error reading student data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
        <div className="bg-yellow-100 rounded-lg max-w-md w-full">
          <h2 className="text-xl font-bold mb-2">No Student Data Available</h2>
          <p className="text-muted-foreground mb-4">
            We couldn't find any student information. Please try logging in
            again.
          </p>
          <Button asChild>
            <Link to="/login">Login Again</Link>
          </Button>
        </div>
      </div>
    );
  }

  const quickAccessCards = [
    {
      title: "Results",
      description: "Check exam results and grades",
      icon: FileText,
      color: "bg-green-500",
      href: "/parent/exam-results",
    },
    {
      title: "Attendance",
      description: "View attendance records of student",
      icon: Calendar,
      color: "bg-purple-500",
      href: "/parent/attendance",
    },
    {
      title: "Teachers",
      description: "Contact teachers and mentors",
      icon: Users,
      color: "bg-orange-500",
      href: "/parent/teachers-mentors",
    },
  ];

  return (
    <div className="space-y-2">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Parent Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Welcome! Here's an overview of {studentData.fname}'s academic
          progress.
        </p>
      </div>

      {/* Quick Access Cards */}
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-4 w-max min-w-full">
          {quickAccessCards.map((card) => (
            <Card
              key={card.title}
              className="min-w-[200px] hover:shadow-md transition-shadow"
            >
              <CardHeader className="space-y-3">
                <div
                  className={`p-2 rounded-lg ${card.color} text-white w-fit`}
                >
                  <card.icon className="size-5" />
                </div>
                <div>
                  <CardTitle className="text-base">{card.title}</CardTitle>
                  <CardDescription className="text-xs">
                    {card.description}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <Button asChild size="sm" className="w-full">
                  <Link to={card.href}>View</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Student Overview */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-primary/5 p-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="h-5 w-5" />
            Student Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col items-center sm:flex-row gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={studentData.profile_photo || "/placeholder-user.jpg"}
                  alt={`${studentData.fname}'s profile`}
                />
                <AvatarFallback className="text-lg">
                  {studentData.fname[0]}
                  {studentData.lname[0]}
                </AvatarFallback>
              </Avatar>
              <div className="text-center sm:text-left space-y-1">
                <h3 className="text-xl font-semibold">
                  {studentData.fname} {studentData.mname} {studentData.lname}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {studentData.email}
                </p>
                <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2">
                  <Badge variant="secondary" className="text-xs">
                    Class {studentData.std}-{studentData.div}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    Roll No: {studentData.roll_no}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Course:</span>
                  <span>{studentData.course || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Admission:</span>
                  <span>{formatDate(studentData.admission_date)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Category:</span>
                  <span>{studentData.cast_group || "N/A"}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Father:</span>
                  <span>{studentData.father_phone || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Mother:</span>
                  <span>{studentData.mother_phone || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Address:</span>
                  <span className="line-clamp-1">
                    {studentData.address || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Parent Contact Info */}
      <Card>
        <CardHeader className="bg-primary/5 p-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-5 w-5" />
            Parent Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium">Father's Details</h4>
            <div className="text-sm">
              <p className="font-medium">{studentData.father_name || "N/A"}</p>
              <p className="text-muted-foreground">
                {studentData.father_occu || "Occupation not specified"}
              </p>
              <p className="flex items-center gap-2 mt-1">
                <Phone className="h-4 w-4" />
                {studentData.father_phone || "N/A"}
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Mother's Details</h4>
            <div className="text-sm">
              <p className="font-medium">{studentData.mother_name || "N/A"}</p>
              <p className="text-muted-foreground">
                {studentData.mother_occu || "Occupation not specified"}
              </p>
              <p className="flex items-center gap-2 mt-1">
                <Phone className="h-4 w-4" />
                {studentData.mother_phone || "N/A"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
