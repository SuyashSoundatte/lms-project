import { PageLayout } from "@/layouts/PageLayout";
import { AttendanceDashboard } from "@/components/attendance/AttendanceDashboard"

export default function AttendanceSystemPage() {
  return (
    <PageLayout
      title="Attendance System"
      description="Track and manage student and staff attendance records"
      breadcrumbs={[{ label: "Attendance System" }]}
    >
      <AttendanceDashboard />
    </PageLayout>
  )
}
