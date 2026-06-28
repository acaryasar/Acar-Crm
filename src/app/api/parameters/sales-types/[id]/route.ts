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
    const { name, isDeleted } = body;

    if (!name || name.trim().length < 2) {
      return failure('Name must be at least 2 characters', 400);
    }

    const salesType = await prisma.salesType.update({
      where: { id },
      data: {
        name: name.trim(),
        isDeleted,
      },
    });

    return success(salesType);
  } catch (error) {
    console.error('Error updating sales type:', error);
    return failure('Failed to update sales type');
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

    await prisma.salesType.delete({
      where: { id },
    });

    return success({ success: true });
  } catch (error) {
    console.error('Error deleting sales type:', error);
    return failure('Failed to delete sales type');
  }
}
