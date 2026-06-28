import { prisma } from '@/lib/prisma';
import { success, failure } from '@/lib/api-utils';
import { auth } from '@/auth';

export async function GET() {
  const session = await auth();

  if (!session) {
    return failure('Unauthorized', 401);
  }

  const customerTypes = await prisma.customerType.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return success(customerTypes);
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session) {
      return failure('Unauthorized', 401);
    }

    const body = await request.json();
    const { typeName, isDeleted } = body;

    if (!typeName || typeName.trim().length < 2) {
      return failure('Type name must be at least 2 characters', 400);
    }

    const customerType = await prisma.customerType.create({
      data: {
        typeName: typeName.trim(),
        isDeleted: isDeleted ?? false,
        createdBy: session.user?.id,
      },
    });

    return success(customerType);
  } catch (error) {
    console.error('Error creating customer type:', error);
    return failure('Failed to create customer type');
  }
}
