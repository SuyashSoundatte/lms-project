
import { AttendanceMarkingPage } from "@/components/attendance/AttendaceMarking"
import { PageLayout } from "@/layouts/PageLayout"

export default function MarkAttendancePage() {
  return <PageLayout
    title="All Students"
    description="Manage all registered students and their information"
    breadcrumbs={[{ label: "All Students" }]}
  >
    <AttendanceMarkingPage />
  </PageLayout>
}



