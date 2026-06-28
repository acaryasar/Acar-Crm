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
    const { typeName, isDeleted } = body;

    if (!typeName || typeName.trim().length < 2) {
      return failure('Type name must be at least 2 characters', 400);
    }

    const customerType = await prisma.customerType.update({
      where: { id },
      data: {
        typeName: typeName.trim(),
        isDeleted,
        updatedBy: session.user?.id,
      },
    });

    return success(customerType);
  } catch (error) {
    console.error('Error updating customer type:', error);
    return failure('Failed to update customer type');
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

    await prisma.customerType.delete({
      where: { id },
    });

    return success({ success: true });
  } catch (error) {
    console.error('Error deleting customer type:', error);
    return failure('Failed to delete customer type');
  }
}
