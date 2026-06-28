import { success, failure } from '@/lib/api-utils';
import { auth } from '@/auth';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const DEPARTMENTS_FILE = join(process.cwd(), 'prisma', 'departments.json');

export async function GET() {
  const session = await auth();

  if (!session) {
    return failure('Unauthorized', 401);
  }

  try {
    const data = readFileSync(DEPARTMENTS_FILE, 'utf-8');
    const departments = JSON.parse(data);
    return success(departments);
  } catch (error) {
    console.error('Error reading departments:', error);
    return failure('Failed to read departments');
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session) {
      return failure('Unauthorized', 401);
    }

    const body = await request.json();
    const { name, isActive } = body;

    if (!name || name.trim().length < 2) {
      return failure('Department name must be at least 2 characters', 400);
    }

    const data = readFileSync(DEPARTMENTS_FILE, 'utf-8');
    const departments = JSON.parse(data);

    const maxId = departments.reduce((max: number, dept: any) => Math.max(max, dept.id), 0);
    const newId = maxId + 1;

    const newDepartment = {
      id: newId,
      name: name.trim(),
      isActive: isActive ?? true,
    };

    departments.push(newDepartment);

    writeFileSync(DEPARTMENTS_FILE, JSON.stringify(departments, null, 2), 'utf-8');

    return success(newDepartment);
  } catch (error) {
    console.error('Error creating department:', error);
    return failure('Failed to create department');
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();

    if (!session) {
      return failure('Unauthorized', 401);
    }

    const body = await request.json();
    const { id, name, isActive } = body;

    if (!id) {
      return failure('Department ID is required', 400);
    }

    if (!name || name.trim().length < 2) {
      return failure('Department name must be at least 2 characters', 400);
    }

    const data = readFileSync(DEPARTMENTS_FILE, 'utf-8');
    const departments = JSON.parse(data);

    const index = departments.findIndex((dept: any) => dept.id === id);
    if (index === -1) {
      return failure('Department not found', 404);
    }

    departments[index] = {
      ...departments[index],
      name: name.trim(),
      isActive: isActive ?? departments[index].isActive,
    };

    writeFileSync(DEPARTMENTS_FILE, JSON.stringify(departments, null, 2), 'utf-8');

    return success(departments[index]);
  } catch (error) {
    console.error('Error updating department:', error);
    return failure('Failed to update department');
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth();

    if (!session) {
      return failure('Unauthorized', 401);
    }

    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '');

    if (!id) {
      return failure('Department ID is required', 400);
    }

    const data = readFileSync(DEPARTMENTS_FILE, 'utf-8');
    const departments = JSON.parse(data);

    const index = departments.findIndex((dept: any) => dept.id === id);
    if (index === -1) {
      return failure('Department not found', 404);
    }

    departments.splice(index, 1);

    writeFileSync(DEPARTMENTS_FILE, JSON.stringify(departments, null, 2), 'utf-8');

    return success({ message: 'Department deleted successfully' });
  } catch (error) {
    console.error('Error deleting department:', error);
    return failure('Failed to delete department');
  }
}
