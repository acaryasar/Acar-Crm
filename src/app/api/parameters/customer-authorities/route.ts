import { prisma } from '@/lib/prisma';
import { success, failure } from '@/lib/api-utils';
import { auth } from '@/auth';

export async function GET() {
  const session = await auth();

  if (!session) {
    return failure('Unauthorized', 401);
  }

  const customerAuthorities = await prisma.customerAuthority.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return success(customerAuthorities);
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session) {
      return failure('Unauthorized', 401);
    }

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

    const customerAuthority = await prisma.customerAuthority.create({
      data: {
        name: name.trim(),
        email: email.trim(),
        title: title?.trim() || '',
        gsm: gsm.trim(),
        phone: phone?.trim() || '',
        isDeleted: isDeleted ?? false,
        createdBy: session.user?.id,
      },
    });

    return success(customerAuthority);
  } catch (error) {
    console.error('Error creating customer authority:', error);
    return failure('Failed to create customer authority');
  }
}
