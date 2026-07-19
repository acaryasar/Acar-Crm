import { cookies } from "next/headers";
import { LOCALE_STORAGE_KEY, isLocale, defaultLocale, messages } from "@/i18n/config";
import { MonthlyCalendar } from "@/features/dashboard/components/monthly-calendar";
import { requireRole, isAdmin, isAdminOrSupervisor } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { Users, UserRound, Ticket, Calendar, Home } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import { createPageMetadata, routes } from "@/config/routes";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get(LOCALE_STORAGE_KEY);
  const locale = localeCookie && isLocale(localeCookie.value) ? localeCookie.value : defaultLocale;
  const title = messages[locale].dashboard.title;
  
  return createPageMetadata("dashboard", title);
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get(LOCALE_STORAGE_KEY);
  const locale = localeCookie && isLocale(localeCookie.value) ? localeCookie.value : defaultLocale;
  const t = (key: string) => messages[locale].dashboard[key as keyof typeof messages[typeof locale]["dashboard"]];
    
  const session = await requireRole(["ADMIN", "SUPERVISOR", "MANAGER", "EMPLOYEE"]);  
  
  const userName = session?.user?.name?.split(" ")[0] ?? "there";
  
  // Admin: sees all data in the system (no filter)
  // Supervisor: sees all data in the system
  // Manager/Employee: sees only their own data
  const assignedUserFilter = isAdminOrSupervisor(session) ? {} : { assignedUserId: session.user.id };
  const employeeFilter = isAdminOrSupervisor(session) ? {} : { employeeId: session.user.id };
  const userFilter = isAdminOrSupervisor(session) ? {} : { id: session.user.id };

  const [customerCount, ticketCount, userCount, appointmentCount, recentTickets] =
    await Promise.all([
      prisma.customer.count({ where: { deletedAt: null } }),
      prisma.ticket.count({ where: { ...assignedUserFilter, deletedAt: null } }),
      prisma.user.count({ where: { ...userFilter,  deletedAt: null } }),
      prisma.appointment.count({ where: { ...employeeFilter, deletedAt: null } }),
      prisma.ticket.findMany({
        where: { ...assignedUserFilter, deletedAt: null },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { 
          customer: { select: { firstName: true, lastName: true } },
          assignedUser: { select: { firstName: true, lastName: true } }
        },
      }),
    ]);

  const kpis = [
    { label: t("customers"),    value: customerCount,    icon: UserRound, color: "text-indigo-600 bg-indigo-50",   href: routes.customers, roles: ["ADMIN", "SUPERVISOR"]},
    { label: t("tickets"),      value: ticketCount,      icon: Ticket,    color: "text-orange-600 bg-orange-50",   href: routes.tickets },
    { label: t("users"),        value: userCount,        icon: Users,     color: "text-slate-600  bg-slate-100",   href: routes.users, roles: ["ADMIN", "SUPERVISOR"]},
    { label: t("appointments"), value: appointmentCount, icon: Calendar,  color: "text-emerald-600 bg-emerald-50", href: routes.appointments },
  ];

  return (
    <div className="space-y-4">

      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
          <Home size={20} className="text-slate-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{t("title")}</h1>
          <p className="text-sm text-slate-500">{t("welcome")}, {userName} 👋</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4" >
        {kpis.map(({ label, value, icon: Icon, color, href }) => (
          <Link key={label} href={href} className="rounded-xl bg-white px-5 py-4 shadow-sm border border-slate-100 flex items-center gap-4 hover:border-slate-300 transition-colors group">
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
              <Icon size={18} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
              <p className="text-2xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{value}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">

        <MonthlyCalendar />

        {/* Recent Tickets */}
        <div className="rounded-xl bg-white p-5 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-slate-700">{t("recentTickets")}</p>
            <Link href={routes.tickets} className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
              {t("viewAll")}
            </Link>
          </div>
          {recentTickets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Ticket size={32} className="text-slate-300 mb-2" />
              <p className="text-sm text-slate-400">{t("noTicketsYet")}</p>
            </div>
          ) : (
            <div className="space-y-0.5">
              {recentTickets.map((ticket: any) => {
                const statusColors: Record<string, string> = {
                  NEW: "bg-slate-100 text-slate-600",
                  ASSIGNED: "bg-blue-100 text-blue-700",
                  IN_PROGRESS: "bg-amber-100 text-amber-700",
                  APPOINTMENT_CONFIRMED: "bg-green-100 text-green-700",
                  APPOINTMENT_CANCELLED: "bg-red-100 text-red-700",
                  COMPLETED: "bg-emerald-100 text-emerald-700",
                  CANCELLED: "bg-red-100 text-red-700"
                };

                const priorityColors: Record<string, string> = {
                  LOW: "text-slate-400",
                  MEDIUM: "text-amber-500",
                  HIGH: "text-orange-500",
                  URGENT: "text-red-500"
                };

                const tTickets = messages[locale].tickets as any;
                const statusLabel = tTickets.statuses?.[ticket.status] || ticket.status;
                const priorityLabel = tTickets.priorities?.[ticket.priority] || ticket.priority;

                return (
                  <Link
                    key={ticket.id}
                    href={`/tickets?mode=view&id=${ticket.id}`}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group border border-transparent hover:border-slate-100"
                  >
                    <div className="h-2 w-2 rounded-full shrink-0" style={{
                      backgroundColor: ticket.priority === 'URGENT' ? '#ef4444' : 
                                     ticket.priority === 'HIGH' ? '#f97316' : 
                                     ticket.priority === 'MEDIUM' ? '#f59e0b' : '#94a3b8'
                    }} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium text-slate-700 truncate group-hover:text-indigo-600 transition-colors">
                          {ticket.title}
                        </p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${statusColors[ticket.status] || statusColors.NEW}`}>
                          {statusLabel}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        {ticket.customer && (
                          <span className="flex items-center gap-1">
                            <UserRound size={12} />
                            {ticket.customer.firstName} {ticket.customer.lastName}
                          </span>
                        )}
                        {ticket.assignedUser && (
                          <span className="flex items-center gap-1">
                            <Users size={12} />
                            {ticket.assignedUser.firstName} {ticket.assignedUser.lastName}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
