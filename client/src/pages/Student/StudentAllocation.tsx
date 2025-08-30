import { PageLayout } from "@/layouts/PageLayout";
import { StudentAllocation } from "@/components/allocation/StudentAllocation";

export default function StudentAllocationPage() {
  return (
    <PageLayout
      title="Student Allocation"
      description="Assign students to classes and manage class rosters"
      breadcrumbs={[{ label: "Student Allocation" }]}
    >
      <StudentAllocation />
    </PageLayout>
  );
}
