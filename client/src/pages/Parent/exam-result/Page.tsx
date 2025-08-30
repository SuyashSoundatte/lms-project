import { PageLayout } from "@/layouts/PageLayout"
import { ExamResults } from "@/components/parent/ExamResult"
export default function ExamResultsPage() {
  return (
    <PageLayout
      title="Exam Results"
      description="View all exam results and academic performance"
      breadcrumbs={[{ label: "Exam Results" }]}
    >
      <ExamResults />
    </PageLayout>
  )
}
