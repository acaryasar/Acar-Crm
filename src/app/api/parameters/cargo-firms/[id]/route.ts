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
    const { name, email, phoneNumber, address, isDeleted } = body;

    if (!name || name.trim().length < 2) {
      return failure('Name must be at least 2 characters', 400);
    }

    if (!email || !email.includes('@')) {
      return failure('Valid email is required', 400);
    }

    if (!phoneNumber || phoneNumber.trim().length < 5) {
      return failure('Phone number must be at least 5 characters', 400);
    }

    const cargoFirm = await prisma.cargoFirm.update({
      where: { id },
      data: {
        name: name.trim(),
        email: email.trim(),
        phoneNumber: phoneNumber.trim(),
        address: address?.trim() || '',
        isDeleted,
        updatedBy: session.user?.id,
      },
    });

    return success(cargoFirm);
  } catch (error) {
    console.error('Error updating cargo firm:', error);
    return failure('Failed to update cargo firm');
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

    await prisma.cargoFirm.delete({
      where: { id },
    });

    return success({ success: true });
  } catch (error) {
    console.error('Error deleting cargo firm:', error);
    return failure('Failed to delete cargo firm');
  }
}
