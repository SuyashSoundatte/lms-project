import { PageLayout } from "@/layouts/PageLayout";
import { StudentRegistrationForm } from "@/components/forms/StudentRegisterForm"

export default function StudentRegistrationPage() {
  return (
    <PageLayout
      title="Student Registration"
      description="Enroll new students and manage student information in the system"
      breadcrumbs={[{ label: "Student Registration" }]}
    >
      <StudentRegistrationForm />
    </PageLayout>
  )
}
