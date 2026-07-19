import { cookies } from "next/headers";
import { LOCALE_STORAGE_KEY, isLocale, defaultLocale, messages } from "@/i18n/config";
import { MonthlyCalendar } from "@/features/dashboard/components/monthly-calendar";
import { requireRole, isAdmin, isAdminOrSupervisor } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { Users, UserRound, Ticket, Calendar, Home } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import { createPageMetadata, routes } from "@/config/routes";
import { AdminKPICards } from "@/features/dashboard/components/admin-kpi-cards";
import { SalesTrendChart } from "@/features/dashboard/components/sales-trend-chart";
import { MonthlySalesChart } from "@/features/dashboard/components/monthly-sales-chart";
import { SalesFunnel } from "@/features/dashboard/components/sales-funnel";
import { TargetAchievement } from "@/features/dashboard/components/target-achievement";
import { SalesPerformanceTable } from "@/features/dashboard/components/sales-performance-table";
import { BestSellingProducts } from "@/features/dashboard/components/best-selling-products";
import { MostProfitableCustomers } from "@/features/dashboard/components/most-profitable-customers";
import { RegionalSalesDistribution } from "@/features/dashboard/components/regional-sales-distribution";
import { CollectionPerformance } from "@/features/dashboard/components/collection-performance";
import { OrderStatusChart } from "@/features/dashboard/components/order-status-chart";
import { ActivitiesReminders } from "@/features/dashboard/components/activities-reminders";
import { EmployeeKPICards } from "@/features/dashboard/components/employee-kpi-cards";
import { EmployeeSalesChart } from "@/features/dashboard/components/employee-sales-chart";
import { EmployeeTargetAchievement } from "@/features/dashboard/components/employee-target-achievement";
import { EmployeeRecentTickets } from "@/features/dashboard/components/employee-recent-tickets";
import { EmployeeTasks } from "@/features/dashboard/components/employee-tasks";

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

  const isAdminOrSupervisorUser = isAdminOrSupervisor(session);

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

      {isAdminOrSupervisorUser ? (
        <>
          {/* Admin/Supervisor Dashboard */}
          <AdminKPICards />

          {/* Middle Section - Charts and Funnel */}
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <SalesTrendChart />
            </div>
            <div>
              <TargetAchievement />
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <MonthlySalesChart />
            <SalesFunnel />
          </div>

          {/* Tables Section */}
          <div className="grid gap-4 lg:grid-cols-2">
            <SalesPerformanceTable />
            <BestSellingProducts />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <MostProfitableCustomers />
            <RegionalSalesDistribution />
          </div>

          {/* Charts and Activities Section */}
          <div className="grid gap-4 lg:grid-cols-3">
            <CollectionPerformance />
            <OrderStatusChart />
            <ActivitiesReminders />
          </div>
        </>
      ) : (
        <>
          {/* Manager/Employee Dashboard - New Design */}
          <EmployeeKPICards />

          {/* Middle Section - Charts and Target */}
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <EmployeeSalesChart />
            </div>
            <div>
              <EmployeeTargetAchievement />
            </div>
          </div>

          {/* Bottom Section - Tickets, Tasks, Calendar */}
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <EmployeeRecentTickets />
            </div>
            <div className="lg:col-span-1">
              <EmployeeTasks />
            </div>
            <div className="lg:col-span-1">
              <MonthlyCalendar />
            </div>
          </div>
        </>
      )}

    </div>
  );
}
