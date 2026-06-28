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
    const { bankId, currencyId, iban, swiftNumber, isDeleted } = body;

    if (!bankId) {
      return failure('Bank is required', 400);
    }

    if (!currencyId) {
      return failure('Currency is required', 400);
    }

    if (!iban || iban.trim().length < 5) {
      return failure('IBAN must be at least 5 characters', 400);
    }

    if (!swiftNumber || swiftNumber.trim().length < 5) {
      return failure('Swift number must be at least 5 characters', 400);
    }

    const bankAccount = await prisma.bankAccount.update({
      where: { id },
      data: {
        bankId,
        currencyId,
        iban: iban.trim().toUpperCase(),
        swiftNumber: swiftNumber.trim().toUpperCase(),
        isDeleted,
        updatedBy: session.user?.id,
      },
    });

    return success(bankAccount);
  } catch (error) {
    console.error('Error updating bank account:', error);
    return failure('Failed to update bank account');
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

    await prisma.bankAccount.delete({
      where: { id },
    });

    return success({ success: true });
  } catch (error) {
    console.error('Error deleting bank account:', error);
    return failure('Failed to delete bank account');
  }
}
