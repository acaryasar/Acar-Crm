import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { logActivity } from "@/lib/entity/activity-log";

export async function GET() {
  const session = await auth();

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const whereClause: any = {};

  if (session.user.role === "ADMIN") {
    // Admin sees all appointments
  } else if (session.user.role === "SUPERVISOR" as any) {
    // Supervisor sees appointments from their company
    whereClause.companyId = session.user.companyId;
  } else {
    // Manager/Employee see only their assigned appointments
    whereClause.employeeId = session.user.id;
  }

  const appointments = await prisma.appointment.findMany({
    where: whereClause,
    include: {
      customer: true,
      employee: true,
    },
    orderBy: { startAt: "asc" },
  });

  return NextResponse.json(appointments);
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const appointment = await prisma.appointment.create({
    data: {
      companyId: session.user!.companyId,
      customerId: body.customerId,
      employeeId: body.employeeId,
      title: body.title,
      description: body.description,
      startAt: new Date(body.startAt),
      endAt: new Date(body.endAt),
      status: body.status ?? "PLANNED",
    },
  });

  await logActivity({ action: "APPOINTMENT_CREATED", entityType: "APPOINTMENT", entityId: appointment.id });

  return NextResponse.json(appointment);
}
