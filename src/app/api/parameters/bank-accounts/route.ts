import { prisma } from '@/lib/prisma';
import { success, failure } from '@/lib/api-utils';
import { auth } from '@/auth';

export async function GET() {
  const session = await auth();

  if (!session) {
    return failure('Unauthorized', 401);
  }

  const bankAccounts = await prisma.bankAccount.findMany({
    include: {
      bank: true,
      currency: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return success(bankAccounts);
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session) {
      return failure('Unauthorized', 401);
    }

    const body = await request.json();
    const { bankId, currencyId, currencyCode, iban, swiftNumber, isDeleted } = body;

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

    const bankAccount = await prisma.bankAccount.create({
      data: {
        bankId,
        currencyId,
        currencyCode: currencyCode || 'TRY',
        iban: iban.trim().toUpperCase(),
        swiftNumber: swiftNumber.trim().toUpperCase(),
        isDeleted: isDeleted ?? false,
        createdBy: session.user?.id,
      },
    });

    return success(bankAccount);
  } catch (error) {
    console.error('Error creating bank account:', error);
    return failure('Failed to create bank account');
  }
}
