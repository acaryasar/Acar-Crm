import { prisma } from '@/lib/prisma';
import { DepartmentList } from '@/features/parameters/departments/components/department-list';
import { DepartmentForm } from '@/features/parameters/departments/components/department-form';
import { requireRole } from '@/lib/auth-guard';

export default async function DepartmentsPage({
  searchParams,
}: {
  searchParams: Promise<{
    mode?: 'create' | 'edit' | 'view';
    id?: string;
  }>;
}) {
  const session = await requireRole(['ADMIN', 'SUPERVISOR', 'MANAGER']);
  const params = await searchParams;
  const mode = params.mode || 'list';
  const departmentId = params.id;

  let department = null;
  if ((mode === 'edit' || mode === 'view') && departmentId) {
    department = await prisma.department.findUnique({
      where: { id: departmentId },
    });
  }

  const departments = await prisma.department.findMany({
    orderBy: {
      departmentName: 'asc',
    },
  });

  if (mode !== 'list') {
    return <DepartmentForm mode={mode} department={department || undefined} />;
  }

  return <DepartmentList departments={departments} />;
}
