import { PageLayout } from "@/layouts/PageLayout"
import { ParentDashboard } from "@/components/parent/ParentDashboard"

export default function ParentDashboardPage() {
  return (
    <PageLayout
      title="Parent Dashboard"
      description="Overview of your child's academic progress and school information"
      breadcrumbs={[{ label: "Dashboard" }]}
    >
      <ParentDashboard />
    </PageLayout>
  )
}
