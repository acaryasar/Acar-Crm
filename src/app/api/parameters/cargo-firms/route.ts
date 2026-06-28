import { success, failure } from '@/lib/api-utils';
import { auth } from '@/auth';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const CARGO_FIRMS_FILE = join(process.cwd(), 'prisma', 'cargo-firms.json');

export async function GET() {
  const session = await auth();

  if (!session) {
    return failure('Unauthorized', 401);
  }

  try {
    const data = readFileSync(CARGO_FIRMS_FILE, 'utf-8');
    const cargoFirms = JSON.parse(data);
    return success(cargoFirms);
  } catch (error) {
    console.error('Error reading cargo firms:', error);
    return failure('Failed to read cargo firms');
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session) {
      return failure('Unauthorized', 401);
    }

    const body = await request.json();
    const { name, email, phoneNumber, address, isActive } = body;

    if (!name || name.trim().length < 2) {
      return failure('Name must be at least 2 characters', 400);
    }

    if (!email || !email.includes('@')) {
      return failure('Valid email is required', 400);
    }

    if (!phoneNumber || phoneNumber.trim().length < 5) {
      return failure('Phone number must be at least 5 characters', 400);
    }

    const data = readFileSync(CARGO_FIRMS_FILE, 'utf-8');
    const cargoFirms = JSON.parse(data);

    const maxId = cargoFirms.reduce((max: number, firm: any) => Math.max(max, firm.id), 0);
    const newId = maxId + 1;

    const newCargoFirm = {
      id: newId,
      name: name.trim(),
      email: email.trim(),
      phoneNumber: phoneNumber.trim(),
      address: address?.trim() || '',
      isActive: isActive ?? true,
    };

    cargoFirms.push(newCargoFirm);

    writeFileSync(CARGO_FIRMS_FILE, JSON.stringify(cargoFirms, null, 2), 'utf-8');

    return success(newCargoFirm);
  } catch (error) {
    console.error('Error creating cargo firm:', error);
    return failure('Failed to create cargo firm');
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();

    if (!session) {
      return failure('Unauthorized', 401);
    }

    const body = await request.json();
    const { id, name, email, phoneNumber, address, isActive } = body;

    if (!id) {
      return failure('Cargo firm ID is required', 400);
    }

    if (!name || name.trim().length < 2) {
      return failure('Name must be at least 2 characters', 400);
    }

    if (!email || !email.includes('@')) {
      return failure('Valid email is required', 400);
    }

    const data = readFileSync(CARGO_FIRMS_FILE, 'utf-8');
    const cargoFirms = JSON.parse(data);

    const index = cargoFirms.findIndex((firm: any) => firm.id === id);
    if (index === -1) {
      return failure('Cargo firm not found', 404);
    }

    cargoFirms[index] = {
      ...cargoFirms[index],
      name: name.trim(),
      email: email.trim(),
      phoneNumber: phoneNumber?.trim() || cargoFirms[index].phoneNumber,
      address: address?.trim() || cargoFirms[index].address,
      isActive: isActive ?? cargoFirms[index].isActive,
    };

    writeFileSync(CARGO_FIRMS_FILE, JSON.stringify(cargoFirms, null, 2), 'utf-8');

    return success(cargoFirms[index]);
  } catch (error) {
    console.error('Error updating cargo firm:', error);
    return failure('Failed to update cargo firm');
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
      return failure('Cargo firm ID is required', 400);
    }

    const data = readFileSync(CARGO_FIRMS_FILE, 'utf-8');
    const cargoFirms = JSON.parse(data);

    const index = cargoFirms.findIndex((firm: any) => firm.id === id);
    if (index === -1) {
      return failure('Cargo firm not found', 404);
    }

    cargoFirms.splice(index, 1);

    writeFileSync(CARGO_FIRMS_FILE, JSON.stringify(cargoFirms, null, 2), 'utf-8');

    return success({ message: 'Cargo firm deleted successfully' });
  } catch (error) {
    console.error('Error deleting cargo firm:', error);
    return failure('Failed to delete cargo firm');
  }
}
