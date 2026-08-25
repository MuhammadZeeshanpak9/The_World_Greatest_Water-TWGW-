import AdminCourseLessonsManager from "@/components/admin/AdminCourseLessonsManager";

type Params = { params: Promise<{ slug: string }> };

export default async function AdminCourseLessonsPage({ params }: Params) {
  const { slug } = await params;
  return <AdminCourseLessonsManager slug={slug} />;
}
