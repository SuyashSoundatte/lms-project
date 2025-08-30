import { PageLayout } from "@/layouts/PageLayout"
import { AttendanceView } from "@/components/parent/AttendanceView"

export default function AttendancePage() {
  return (
    <PageLayout
      title="Attendance Record"
      description="View your child's daily attendance history"
      breadcrumbs={[{ label: "Attendance" }]}
    >
      <AttendanceView />
    </PageLayout>
  )
}
