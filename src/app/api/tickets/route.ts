import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { logActivity } from "@/lib/entity/activity-log";
import { createNotification } from "@/lib/notification";

export async function GET() {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const whereClause: any = {};

  if (session.user.role === "ADMIN") {
    // Admin sees all tickets
  } else if (session.user.role === "SUPERVISOR" as any) {
    // Supervisor sees tickets from their company
    whereClause.companyId = session.user.companyId;
  } else {
    // Manager/Employee see only their assigned tickets
    whereClause.assignedUserId = session.user.id;
  }

  const tickets = await prisma.ticket.findMany({
    where: whereClause,
    include: {
      customer: true,
      assignedUser: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(tickets);
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const ticket = await prisma.ticket.create({
    data: {
      companyId: session.user.companyId,
      customerId: body.customerId,
      assignedUserId: body.assignedUserId,
      title: body.title,
      description: body.description,
      category: body.category,
      priority: body.priority,
      status: body.status ?? "NEW",
      source: body.source ?? "MANUAL",
    },
    include: { customer: true },
  });

  await logActivity({ action: "TICKET_CREATED", entityType: "TICKET", entityId: ticket.id });
  await createNotification({
    companyId: session.user.companyId,
    title: "New Ticket",
    message: ticket.title,
    type: "INFO",
    entityType: "TICKET",
    entityId: ticket.id,
  });

  return NextResponse.json(ticket);
}
