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
    const { name, email, title, gsm, phone, isDeleted } = body;

    if (!name || name.trim().length < 2) {
      return failure('Name must be at least 2 characters', 400);
    }

    if (!email || !email.includes('@')) {
      return failure('Valid email is required', 400);
    }

    if (!gsm || gsm.trim().length < 5) {
      return failure('GSM must be at least 5 characters', 400);
    }

    const customerAuthority = await prisma.customerAuthority.update({
      where: { id },
      data: {
        name: name.trim(),
        email: email.trim(),
        title: title?.trim() || '',
        gsm: gsm.trim(),
        phone: phone?.trim() || '',
        isDeleted,
        updatedBy: session.user?.id,
      },
    });

    return success(customerAuthority);
  } catch (error) {
    console.error('Error updating customer authority:', error);
    return failure('Failed to update customer authority');
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

    await prisma.customerAuthority.delete({
      where: { id },
    });

    return success({ success: true });
  } catch (error) {
    console.error('Error deleting customer authority:', error);
    return failure('Failed to delete customer authority');
  }
}
