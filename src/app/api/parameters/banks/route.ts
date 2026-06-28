import { prisma } from '@/lib/prisma';
import { success, failure } from '@/lib/api-utils';
import { auth } from '@/auth';

export async function GET() {
  const session = await auth();

  if (!session) {
    return failure('Unauthorized', 401);
  }

  const banks = await prisma.bank.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return success(banks);
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session) {
      return failure('Unauthorized', 401);
    }

    const body = await request.json();
    const { name, address, email, phoneNumber, isDeleted } = body;

    if (!name || name.trim().length < 2) {
      return failure('Name must be at least 2 characters', 400);
    }

    if (!email || !email.includes('@')) {
      return failure('Valid email is required', 400);
    }

    if (!phoneNumber || phoneNumber.trim().length < 5) {
      return failure('Phone number must be at least 5 characters', 400);
    }

    const bank = await prisma.bank.create({
      data: {
        name: name.trim(),
        address: address?.trim() || '',
        email: email.trim(),
        phoneNumber: phoneNumber.trim(),
        isDeleted: isDeleted ?? false,
        createdBy: session.user?.id,
      },
    });

    return success(bank);
  } catch (error) {
    console.error('Error creating bank:', error);
    return failure('Failed to create bank');
  }
}
