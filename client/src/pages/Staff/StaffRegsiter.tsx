import { PageLayout } from "@/layouts/PageLayout";
import { StaffRegistrationForm } from "@/components/forms/StaffRegisterForm"

export default function StaffRegistrationPage() {
  return (
    <PageLayout
      title="Staff Registration"
      description="Register new staff members and manage their profiles in the system"
      breadcrumbs={[{ label: "Staff Registration" }]}
    >
      <StaffRegistrationForm />
    </PageLayout>
  )
}
