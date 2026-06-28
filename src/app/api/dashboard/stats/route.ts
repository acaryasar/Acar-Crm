import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
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