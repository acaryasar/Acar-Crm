import { prisma } from '@/lib/prisma';
import { success, failure } from '@/lib/api-utils';
import { auth } from '@/auth';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session) {
      return failure('Unauthorized', 401);
    }

    const { id } = await params;
    const body = await request.json();
    const { departmentName, departmentUpper, isDeleted } = body;

    if (!departmentName || departmentName.trim().length < 2) {
      return failure('Department name must be at least 2 characters', 400);
    }

    if (!departmentUpper || departmentUpper.trim().length < 2) {
      return failure('Department upper must be at least 2 characters', 400);
    }

    const department = await prisma.department.update({
      where: { id },
      data: {
        departmentName: departmentName.trim(),
        departmentUpper: departmentUpper.trim().toUpperCase(),
        isDeleted,
      },
    });

    return success(department);
  } catch (error) {
    console.error('Error updating department:', error);
    return failure('Failed to update department');
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session) {
      return failure('Unauthorized', 401);
    }

    const { id } = await params;

    await prisma.department.delete({
      where: { id },
    });

    return success({ success: true });
  } catch (error) {
    console.error('Error deleting department:', error);
    return failure('Failed to delete department');
  }
}
