import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [
    customers,
    openTickets,
    employees,
    appointments,
  ] = await Promise.all([
    prisma.customer.count(),
    prisma.ticket.count({
      where: {
        status: "NEW",
      },
    }),
    prisma.user.count(),
    prisma.appointment.count(),
  ]);

  return NextResponse.json({
    customers,
    openTickets,
    employees,
    appointments,
  });
}
