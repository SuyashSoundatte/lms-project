import { PageLayout } from "@/layouts/PageLayout"
import { ChildProfile } from "@/components/parent/ChildProfile"

export default function ChildProfilePage() {
  return (
    <PageLayout
      title="Child Profile"
      description="Complete information about your child"
      breadcrumbs={[{ label: "Child Profile" }]}
    >
      <ChildProfile />
    </PageLayout>
  )
}
