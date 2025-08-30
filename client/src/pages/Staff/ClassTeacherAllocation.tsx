import { PageLayout } from "@/layouts/PageLayout";
import { ClassTeacherAllocation } from "@/components/allocation/ClassTeacherAllocation";

export default function ClassTeacherAllocationPage() {
  return (
    <PageLayout
      title="Class Teacher Allocation"
      description="Assign class teachers and manage classroom responsibilities"
      breadcrumbs={[{ label: "Class Teacher Allocation" }]}
    >
      <ClassTeacherAllocation />
    </PageLayout>
  )
}
