import { PageLayout } from "@/layouts/PageLayout";
import { TeacherAllocation } from "@/components/allocation/TeacherAllocation"

export default function TeacherAllocationPage() {
  return (
    <PageLayout
      title="Teacher Allocation"
      description="Assign teachers to subjects and manage teaching schedules"
      breadcrumbs={[{ label: "Teacher Allocation" }]}
    >
      <TeacherAllocation />
    </PageLayout>
  )
}
