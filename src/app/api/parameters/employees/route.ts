import { prisma } from '@/lib/prisma';
import { success, failure } from '@/lib/api-utils';
import { auth } from '@/auth';

export async function GET() {
  const session = await auth();

  if (!session) {
    return failure('Unauthorized', 401);
  }

  const employees = await prisma.employee.findMany({
    include: {
      department: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return success(employees);
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session) {
      return failure('Unauthorized', 401);
    }

    const body = await request.json();
    const { name, email, phoneNumber, address, departmentId, isDeleted } = body;

    if (!name || name.trim().length < 2) {
      return failure('Name must be at least 2 characters', 400);
    }

    if (!email || !email.includes('@')) {
      return failure('Valid email is required', 400);
    }

    if (!phoneNumber || phoneNumber.trim().length < 5) {
      return failure('Phone number must be at least 5 characters', 400);
    }

    if (!departmentId) {
      return failure('Department is required', 400);
    }

    const employee = await prisma.employee.create({
      data: {
        name: name.trim(),
        email: email.trim(),
        phoneNumber: phoneNumber.trim(),
        address: address?.trim() || null,
        departmentId,
        isDeleted: isDeleted ?? false,
        createdBy: session.user?.id,
      },
    });

    return success(employee);
  } catch (error) {
    console.error('Error creating employee:', error);
    return failure('Failed to create employee');
  }
}
