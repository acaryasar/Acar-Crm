import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { logActivity } from "@/lib/entity/activity-log";

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

  const ticket = await prisma.ticket.update({
    where: { id },
    data: body,
    include: { customer: true, assignedUser: true },
  });

  await logActivity({ 
    action: "TICKET_UPDATED", 
    entityType: "TICKET", 
    entityId: id,
    metadata: { changes: body }
  });

  return NextResponse.json(ticket);
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

  await prisma.ticket.update({
    where: { id },
    data: {
      deletedAt: new Date(),
      is_active: false,
    },
  });

  await logActivity({ action: "TICKET_DELETED", entityType: "TICKET", entityId: id });

  return NextResponse.json({ success: true });
}
