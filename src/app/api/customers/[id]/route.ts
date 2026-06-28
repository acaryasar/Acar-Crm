import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { logActivity } from "@/lib/entity/activity-log";
import { NextResponse } from "next/server";
import { UpdateCustomerSchema } from "@/features/customers/validations/customer.schema";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const data = UpdateCustomerSchema.parse(body);

  const customer = await prisma.customer.update({
    where: { id },
    data,
  });

  await logActivity({ 
    action: "CUSTOMER_UPDATED", 
    entityType: "CUSTOMER", 
    entityId: id,
    metadata: { changes: data }
  });

  return NextResponse.json(customer);
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  await prisma.customer.update({
    where: {
      id,
    },
    data: {
      deletedAt: new Date(),
      is_active: false,
    },
  });

  await logActivity({ action: "CUSTOMER_DELETED", entityType: "CUSTOMER", entityId: id });

  return NextResponse.json({
    success: true,
  });
}
