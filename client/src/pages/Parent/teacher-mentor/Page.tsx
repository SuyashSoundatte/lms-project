import { TeachersMentors } from "@/components/parent/TeacherMentors";
import { PageLayout } from "@/layouts/PageLayout";

export default function TeachersMentorsPage() {
  return (
    <PageLayout
      title="Teachers & Mentors"
      description="Contact information for your child's teachers and mentors"
      breadcrumbs={[{ label: "Teachers & Mentors" }]}
    >
      <TeachersMentors />
    </PageLayout>
  );
}
