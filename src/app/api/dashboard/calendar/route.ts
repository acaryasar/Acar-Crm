import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { isAdmin, isAdminOrSupervisor } from "@/lib/auth-guard";

export async function GET(request: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const year = parseInt(searchParams.get("year") || new Date().getFullYear().toString());
  const month = parseInt(searchParams.get("month") || (new Date().getMonth() + 1).toString());

  // Get the first and last day of the month
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);

  // Role-based filtering
  // Admin: sees all appointments in the system (no company filter)
  // Supervisor: sees only their company's appointments
  // Manager/Employee: sees only their own appointments
  const companyFilter = isAdmin(session) ? {} : { companyId: session.user.companyId };
  const employeeFilter = isAdminOrSupervisor(session) ? {} : { employeeId: session.user.id };

  // Get appointments for the user in this month
  const appointments = await prisma.appointment.findMany({
    where: {
      ...companyFilter,
      ...employeeFilter,
      startAt: {
        gte: firstDay,
        lte: lastDay,
      },
    },
    include: {
      customer: true,
    },
  });

  // Get tickets related to these appointments
  const appointmentIds = appointments.map((a: any) => a.id);
  const tickets = await prisma.ticket.findMany({
    where: {
      companyId: session.user.companyId,
      customerId: {
        in: appointments.map((a: any) => a.customerId),
      },
    },
  });

  // Build a map of dates with their status
  const dateStatusMap = new Map<string, { hasAppointment: boolean; hasIncompleteTicket: boolean }>();

  appointments.forEach((appointment: any) => {
    const dateKey = appointment.startAt.toISOString().split('T')[0];
    const existing = dateStatusMap.get(dateKey) || { hasAppointment: false, hasIncompleteTicket: false };
    dateStatusMap.set(dateKey, { hasAppointment: true, hasIncompleteTicket: existing.hasIncompleteTicket });
  });

  // Check for incomplete tickets on appointment days
  tickets.forEach((ticket: any) => {
    const appointment = appointments.find((a: any) => a.customerId === ticket.customerId);
    if (appointment) {
      const dateKey = appointment.startAt.toISOString().split('T')[0];
      const existing = dateStatusMap.get(dateKey) || { hasAppointment: false, hasIncompleteTicket: false };
      // Check if ticket is incomplete (not COMPLETED or CANCELLED)
      const isIncomplete = !["COMPLETED", "CANCELLED"].includes(ticket.status);
      dateStatusMap.set(dateKey, { hasAppointment: existing.hasAppointment, hasIncompleteTicket: isIncomplete });
    }
  });

  return NextResponse.json({
    year,
    month,
    dateStatus: Object.fromEntries(dateStatusMap),
  });
}
