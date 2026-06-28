import { success, failure } from '@/lib/api-utils';
import { auth } from '@/auth';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const CUSTOMER_TYPES_FILE = join(process.cwd(), 'prisma', 'customer-types.json');

export async function GET() {
  const session = await auth();

  if (!session) {
    return failure('Unauthorized', 401);
  }

  try {
    const data = readFileSync(CUSTOMER_TYPES_FILE, 'utf-8');
    const customerTypes = JSON.parse(data);
    return success(customerTypes);
  } catch (error) {
    console.error('Error reading customer types:', error);
    return failure('Failed to read customer types');
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
      return failure('Customer type name must be at least 2 characters', 400);
    }

    const data = readFileSync(CUSTOMER_TYPES_FILE, 'utf-8');
    const customerTypes = JSON.parse(data);

    const maxId = customerTypes.reduce((max: number, type: any) => Math.max(max, type.id), 0);
    const newId = maxId + 1;

    const newCustomerType = {
      id: newId,
      name: name.trim(),
      isActive: isActive ?? true,
    };

    customerTypes.push(newCustomerType);

    writeFileSync(CUSTOMER_TYPES_FILE, JSON.stringify(customerTypes, null, 2), 'utf-8');

    return success(newCustomerType);
  } catch (error) {
    console.error('Error creating customer type:', error);
    return failure('Failed to create customer type');
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
      return failure('Customer type ID is required', 400);
    }

    if (!name || name.trim().length < 2) {
      return failure('Customer type name must be at least 2 characters', 400);
    }

    const data = readFileSync(CUSTOMER_TYPES_FILE, 'utf-8');
    const customerTypes = JSON.parse(data);

    const index = customerTypes.findIndex((type: any) => type.id === id);
    if (index === -1) {
      return failure('Customer type not found', 404);
    }

    customerTypes[index] = {
      ...customerTypes[index],
      name: name.trim(),
      isActive: isActive ?? customerTypes[index].isActive,
    };

    writeFileSync(CUSTOMER_TYPES_FILE, JSON.stringify(customerTypes, null, 2), 'utf-8');

    return success(customerTypes[index]);
  } catch (error) {
    console.error('Error updating customer type:', error);
    return failure('Failed to update customer type');
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
      return failure('Customer type ID is required', 400);
    }

    const data = readFileSync(CUSTOMER_TYPES_FILE, 'utf-8');
    const customerTypes = JSON.parse(data);

    const index = customerTypes.findIndex((type: any) => type.id === id);
    if (index === -1) {
      return failure('Customer type not found', 404);
    }

    customerTypes.splice(index, 1);

    writeFileSync(CUSTOMER_TYPES_FILE, JSON.stringify(customerTypes, null, 2), 'utf-8');

    return success({ message: 'Customer type deleted successfully' });
  } catch (error) {
    console.error('Error deleting customer type:', error);
    return failure('Failed to delete customer type');
  }
}
