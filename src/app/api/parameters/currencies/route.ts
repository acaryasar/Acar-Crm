import { prisma } from '@/lib/prisma';
import { success, failure } from '@/lib/api-utils';
import { auth } from '@/auth';

export async function GET() {
  const session = await auth();

  if (!session) {
    return failure('Unauthorized', 401);
  }

  const currencies = await prisma.currency.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return success(currencies);
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session) {
      return failure('Unauthorized', 401);
    }

    const body = await request.json();
    const { code, name, isDeleted } = body;

    if (!code || code.trim().length < 2) {
      return failure('Code must be at least 2 characters', 400);
    }

    if (!name || name.trim().length < 2) {
      return failure('Name must be at least 2 characters', 400);
    }

    const currency = await prisma.currency.create({
      data: {
        code: code.toUpperCase().trim(),
        name: name.trim(),
        symbol: code.toUpperCase().trim(), // Default to code
        isDeleted: isDeleted ?? false,
        createdBy: session.user?.id,
      },
    });

    return success(currency);
  } catch (error) {
    console.error('Error creating currency:', error);
    return failure('Failed to create currency');
  }
}
