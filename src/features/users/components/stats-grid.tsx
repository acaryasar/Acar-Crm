import { prisma } from "@/lib/prisma";
import { KpiCard } from "./kpi-card";

export async function StatsGrid() {
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

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <KpiCard
        title="Customers"
        value={customers}
      />

      <KpiCard
        title="Open Tickets"
        value={openTickets}
      />

      <KpiCard
        title="Employees"
        value={employees}
      />

      <KpiCard
        title="Appointments"
        value={appointments}
      />
    </div>
  );
}