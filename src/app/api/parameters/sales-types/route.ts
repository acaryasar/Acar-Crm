import { success, failure } from '@/lib/api-utils';
import { auth } from '@/auth';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const SALES_TYPES_FILE = join(process.cwd(), 'prisma', 'sale-types.json');

export async function GET() {
  const session = await auth();

  if (!session) {
    return failure('Unauthorized', 401);
  }

  try {
    const data = readFileSync(SALES_TYPES_FILE, 'utf-8');
    const salesTypes = JSON.parse(data);
    return success(salesTypes);
  } catch (error) {
    console.error('Error reading sales types:', error);
    return failure('Failed to read sales types');
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
      return failure('Sales type name must be at least 2 characters', 400);
    }

    const data = readFileSync(SALES_TYPES_FILE, 'utf-8');
    const salesTypes = JSON.parse(data);

    const maxId = salesTypes.reduce((max: number, type: any) => Math.max(max, type.id), 0);
    const newId = maxId + 1;

    const newSalesType = {
      id: newId,
      name: name.trim(),
      isActive: isActive ?? true,
    };

    salesTypes.push(newSalesType);

    writeFileSync(SALES_TYPES_FILE, JSON.stringify(salesTypes, null, 2), 'utf-8');

    return success(newSalesType);
  } catch (error) {
    console.error('Error creating sales type:', error);
    return failure('Failed to create sales type');
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
      return failure('Sales type ID is required', 400);
    }

    if (!name || name.trim().length < 2) {
      return failure('Sales type name must be at least 2 characters', 400);
    }

    const data = readFileSync(SALES_TYPES_FILE, 'utf-8');
    const salesTypes = JSON.parse(data);

    const index = salesTypes.findIndex((type: any) => type.id === id);
    if (index === -1) {
      return failure('Sales type not found', 404);
    }

    salesTypes[index] = {
      ...salesTypes[index],
      name: name.trim(),
      isActive: isActive ?? salesTypes[index].isActive,
    };

    writeFileSync(SALES_TYPES_FILE, JSON.stringify(salesTypes, null, 2), 'utf-8');

    return success(salesTypes[index]);
  } catch (error) {
    console.error('Error updating sales type:', error);
    return failure('Failed to update sales type');
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
      return failure('Sales type ID is required', 400);
    }

    const data = readFileSync(SALES_TYPES_FILE, 'utf-8');
    const salesTypes = JSON.parse(data);

    const index = salesTypes.findIndex((type: any) => type.id === id);
    if (index === -1) {
      return failure('Sales type not found', 404);
    }

    salesTypes.splice(index, 1);

    writeFileSync(SALES_TYPES_FILE, JSON.stringify(salesTypes, null, 2), 'utf-8');

    return success({ message: 'Sales type deleted successfully' });
  } catch (error) {
    console.error('Error deleting sales type:', error);
    return failure('Failed to delete sales type');
  }
}
