import { PageLayout } from "@/layouts/PageLayout";
import { AllStudentsTable } from "@/components/user-management/AllStudentsTable";

export default function AllStudentsPage() {
  return (
    <PageLayout
      title="All Student"
      description="Manage all registered students and their information"
      breadcrumbs={[{ label: "All Students" }]}
    >
      <AllStudentsTable />
    </PageLayout>
  );
}
