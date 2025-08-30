import { PageLayout } from "@/layouts/PageLayout"
import { MentorAllocation } from "@/components/allocation/MentorAllocation"

export default function MentorAllocationPage() {
  return (
    <PageLayout
      title="Mentor Allocation"
      description="Assign mentors to students and manage mentorship programs"
      breadcrumbs={[{ label: "Mentor Allocation" }]}
    >
      <MentorAllocation />
    </PageLayout>
  )
}
