import { prisma } from '@/lib/prisma';
import { success, failure } from '@/lib/api-utils';
import { auth } from '@/auth';

export async function GET() {
  const session = await auth();

  if (!session) {
    return failure('Unauthorized', 401);
  }

  const cargoFirms = await prisma.cargoFirm.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return success(cargoFirms);
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session) {
      return failure('Unauthorized', 401);
    }

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

    const cargoFirm = await prisma.cargoFirm.create({
      data: {
        name: name.trim(),
        email: email.trim(),
        phoneNumber: phoneNumber.trim(),
        address: address?.trim() || '',
        isDeleted: isDeleted ?? false,
        createdBy: session.user?.id,
      },
    });

    return success(cargoFirm);
  } catch (error) {
    console.error('Error creating cargo firm:', error);
    return failure('Failed to create cargo firm');
  }
}
