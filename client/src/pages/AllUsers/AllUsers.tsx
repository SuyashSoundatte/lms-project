import { PageLayout } from "@/layouts/PageLayout"
import { AllUsersTable } from "@/components/user-management/AllUsersTable"

export default function AllUsersPage() {
  return (
    <PageLayout
      title="All Users"
      description="Manage all staff members and their information"
      breadcrumbs={[{ label: "All Users" }]}
    >
      <AllUsersTable />
    </PageLayout>
  )
}
