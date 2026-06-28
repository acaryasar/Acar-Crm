import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(request: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const dateStr = searchParams.get("date");
  const view = searchParams.get("view") || "day";
  const userId = searchParams.get("userId");

  // Parse the date (format: YYYY-MM-DD)
  const targetDate = dateStr ? new Date(dateStr) : new Date();

  let startDate: Date;
  let endDate: Date;

  if (view === "week") {
    // Get the start of the week (Monday)
    const dayOfWeek = targetDate.getDay();
    const diff = targetDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    startDate = new Date(targetDate.setDate(diff));
    startDate.setHours(0, 0, 0, 0);
    endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);
    endDate.setHours(23, 59, 59, 999);
  } else if (view === "month") {
    // Get the start and end of the month
    startDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
    startDate.setHours(0, 0, 0, 0);
    endDate = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0);
    endDate.setHours(23, 59, 59, 999);
  } else {
    // Day view
    startDate =	new Date(targetDate);
    startDate.setHours(0, 0, 0, 0);
    endDate = new Date(targetDate);
    endDate.setHours(23, 59, 59, 999);
  }

  // Determine which users to fetch based on role or specific userId
  let whereClause: any = undefined;

  if (userId) {
    // If specific userId is provided, filter by that user
    whereClause = { id: userId };
  } else if (session.user.role === "ADMIN") {
    // Admin sees all users - no where clause
    whereClause = undefined;
  } else if (session.user.role === "SUPERVISOR" as any) {
    // Supervisor sees users from their company
    whereClause = { companyId: session.user.companyId };
  } else {
    // Other roles see only themselves
    whereClause = { id: session.user.id };
  }

  // Fetch users
  const users = await prisma.user.findMany({
    where: whereClause,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
    },
    orderBy: {
      firstName: "asc",
    },
  });

  // Fetch appointments for these users in the date range
  const userIds = users.map((u: any) => u.id);
  const appointmentsWhere: any = {
    employeeId: { in: userIds },
    startAt: {
      gte: startDate,
      lte: endDate,
    },
  };

  // Add companyId filter for non-admin roles
  if (session.user.role !== "ADMIN") {
    appointmentsWhere.companyId = session.user.companyId;
  }

  const appointments = await prisma.appointment.findMany({
    where: appointmentsWhere,
    include: {
      customer: true,
    },
    orderBy: {
      startAt: "asc",
    },
  });

  // Fetch tickets related to these appointments
  const appointmentIds = appointments.map((a: any) => a.id);
  const tickets = await prisma.ticket.findMany({
    where: {
      customerId: { in: appointments.map((a: any) => a.customerId) },
    },
    include: {
      assignedUser: true,
    },
  });

  // Group appointments by user
  const userAppointments = users.map((user: any) => {
    const userAppts = appointments.filter((a: any) => a.employeeId === user.id);
    return {
      ...user,
      appointments: userAppts.map((appointment: any) => {
        const relatedTickets = tickets.filter((t: any) => t.customerId === appointment.customerId);
        return {
          ...appointment,
          customer: appointment.customer,
          tickets: relatedTickets,
        };
      }),
    };
  });

  return NextResponse.json({
    date: targetDate.toISOString().split('T')[0],
    view,
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
    users: userAppointments,
  });
}
