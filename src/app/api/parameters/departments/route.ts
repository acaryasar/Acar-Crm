import { prisma } from '@/lib/prisma';
import { success, failure } from '@/lib/api-utils';
import { auth } from '@/auth';

export async function GET() {
  const session = await auth();

  if (!session) {
    return failure('Unauthorized', 401);
  }

  const departments = await prisma.department.findMany({
    orderBy: {
      departmentName: 'asc',
    },
  });

  return success(departments);
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session) {
      return failure('Unauthorized', 401);
    }

    const body = await request.json();
    const { departmentName, departmentUpper, isDeleted } = body;

    if (!departmentName || departmentName.trim().length < 2) {
      return failure('Department name must be at least 2 characters', 400);
    }

    if (!departmentUpper || departmentUpper.trim().length < 2) {
      return failure('Department upper must be at least 2 characters', 400);
    }

    const department = await prisma.department.create({
      data: {
        departmentName: departmentName.trim(),
        departmentUpper: departmentUpper.trim().toUpperCase(),
        isDeleted: isDeleted ?? false,
      },
    });

    return success(department);
  } catch (error) {
    console.error('Error creating department:', error);
    return failure('Failed to create department');
  }
}
