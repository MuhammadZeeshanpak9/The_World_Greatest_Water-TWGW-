"use client";

import { useRouter } from "next/navigation";
import { GraduationCap } from "lucide-react";
import DataTable, { type Column } from "@/components/admin/DataTable";
import { useAdminTable } from "@/lib/hooks/useAdminTable";

type AdminCourse = {
  id: string;
  slug: string;
  title: string;
  enrollmentCount: number;
  lessonCount: number;
};

export default function AdminCoursesPage() {
  const router = useRouter();
  const { rows, loading, error, refetch } = useAdminTable<AdminCourse>(
    "/api/admin/courses",
    "courses",
    "",
  );

  const columns: Column<AdminCourse>[] = [
    { header: "Title", accessor: (r) => r.title },
    { header: "Lessons", accessor: (r) => r.lessonCount },
    { header: "Enrollments", accessor: (r) => r.enrollmentCount },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-cormorant text-4xl text-white">Courses</h1>
      </div>

      <DataTable<AdminCourse>
        columns={columns}
        rows={rows}
        rowKey={(r) => r.id}
        loading={loading}
        error={error}
        onRetry={refetch}
        emptyIcon={GraduationCap}
        emptyMessage="No courses found."
        onRowClick={(r) => router.push(`/admin/courses/${r.slug}`)}
        page={1}
        totalPages={1}
        onPageChange={() => {}}
      />
    </div>
  );
}
