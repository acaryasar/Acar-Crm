import { prisma } from '@/lib/prisma';
import { EmployeeList } from '@/features/parameters/employees/components/employee-list';
import { EmployeeForm } from '@/features/parameters/employees/components/employee-form';
import { requireRole } from '@/lib/auth-guard';

export default async function EmployeesPage({
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
  const employeeId = params.id;

  let employee = null;
  if ((mode === 'edit' || mode === 'view') && employeeId) {
    employee = await prisma.employee.findUnique({
      where: { id: employeeId },
      include: {
        department: true,
      },
    });
  }

  const employees = await prisma.employee.findMany({
    include: {
      department: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const departments = await prisma.department.findMany({
    where: { isDeleted: false },
    orderBy: { name: 'asc' },
  });

  if (mode !== 'list') {
    return (
      <EmployeeForm 
        mode={mode} 
        employee={employee as any || undefined} 
        departments={departments as any}
      />
    );
  }

  return <EmployeeList employees={employees as any} />;
}
