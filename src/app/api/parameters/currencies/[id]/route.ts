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
    const { code, name, isDeleted } = body;

    if (!code || code.trim().length < 2) {
      return failure('Code must be at least 2 characters', 400);
    }

    if (!name || name.trim().length < 2) {
      return failure('Name must be at least 2 characters', 400);
    }

    const currency = await prisma.currency.update({
      where: { id },
      data: {
        code: code.toUpperCase().trim(),
        name: name.trim(),
        isDeleted,
        updatedBy: session.user?.id,
      },
    });

    return success(currency);
  } catch (error) {
    console.error('Error updating currency:', error);
    return failure('Failed to update currency');
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

    await prisma.currency.delete({
      where: { id },
    });

    return success({ success: true });
  } catch (error) {
    console.error('Error deleting currency:', error);
    return failure('Failed to delete currency');
  }
}
