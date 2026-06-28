import { prisma } from '@/lib/prisma';
import { success, failure } from '@/lib/api-utils';
import { auth } from '@/auth';

export async function GET() {
  const session = await auth();

  if (!session) {
    return failure('Unauthorized', 401);
  }

  const salesTypes = await prisma.salesType.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return success(salesTypes);
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session) {
      return failure('Unauthorized', 401);
    }

    const body = await request.json();
    const { name, isDeleted } = body;

    if (!name || name.trim().length < 2) {
      return failure('Name must be at least 2 characters', 400);
    }

    const guidId = crypto.randomUUID();

    const salesType = await prisma.salesType.create({
      data: {
        guidId,
        name: name.trim(),
        isDeleted: isDeleted ?? true,
      },
    });

    return success(salesType);
  } catch (error) {
    console.error('Error creating sales type:', error);
    return failure('Failed to create sales type');
  }
}
