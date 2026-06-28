import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { LOCALE_STORAGE_KEY, isLocale, defaultLocale, messages } from "@/i18n/config";
import { Ticket, Plus, ArrowLeft, Edit, Save } from "lucide-react";
import { requireRole, isAdminOrSupervisor, isAdmin } from "@/lib/auth-guard";
import { TicketCard } from "@/features/tickets/components/ticket-card";
import { TicketSearch } from "@/features/tickets/components/ticket-search";
import { TicketForm } from "@/features/tickets/components/ticket-form";

export default async function TicketsPage({
  searchParams,
}: {
  searchParams: Promise<{ 
    search?: string; 
    customerId?: string;
    mode?: "create" | "edit" | "view";
    id?: string;
  }>;
}) {
  
  const session = await requireRole(["ADMIN", "SUPERVISOR", "MANAGER", "EMPLOYEE"]);
  const companyId = session.user.companyId;
  const assignedUserId = session.user.id;
  const params = await searchParams;
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get(LOCALE_STORAGE_KEY);
  const locale = localeCookie && isLocale(localeCookie.value) ? localeCookie.value : defaultLocale;
  const t = (key: string) => messages[locale].tickets[key as keyof typeof messages[typeof locale]["tickets"]] as string;

  const mode = params.mode || "list";
  const ticketId = params.id;
  const deletedAt = null;

  let ticket = null;
  let appointments = [];

  if ((mode === "edit" || mode === "view") && ticketId) {
    ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: { 
        customer: true,
        assignedUser: true,
      },
    });

    // Fetch appointments separately since there's no direct relation
    if (ticket) {
      appointments = await prisma.appointment.findMany({
        where: {
          customerId: ticket.customerId,
          employeeId: ticket.assignedUserId || undefined,
          status: "PLANNED",
          title: {
            startsWith: "Ticket:",
          },
        },
        orderBy: {
          startAt: "asc",
        },
      });
    }
  }

  const companyFilter = isAdmin(session) ? {} : { companyId };
  const deleteFilter = isAdminOrSupervisor(session) ? {} : { deletedAt };

  const customers = await prisma.customer.findMany({
    where: { ...deleteFilter,
            ...companyFilter,     },
    select: { id: true, firstName: true, lastName: true },
  });

  const customerOptions = customers.map((c: { id: string; firstName: string; lastName: string }) => ({
    id: c.id,
    name: `${c.firstName} ${c.lastName}`,
  }));

  if (mode !== "list") {
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between mb-6 shrink-0">
          <div className="flex items-center gap-3">
            <Link 
              href="/dashboard/tickets" 
              className="inline-flex items-center justify-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
            
            <div className="h-10 w-10 rounded-xl bg-orange-100 flex items-center justify-center">
              <Ticket size={20} className="text-orange-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                {mode === "create" ? t("newTicket") : mode === "edit" ? t("editTicket") : t("viewTicket")}
              </h1>
              <p className="text-sm text-slate-500">
                {mode === "create" ? t("createTicketDesc") : ticket?.title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {mode === "view" && ticket && (
              <Link 
                href={`/dashboard/tickets?mode=edit&id=${ticket.id}`}
                className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors shadow-sm"
              >
                <Edit size={16} />
                {t("edit")}
              </Link>
            )}
            {mode !== "view" && (
              <button 
                form="ticket-form"
                type="submit"
                className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors shadow-sm min-w-[140px]"
              >
                <Save size={16} />
                {mode === "create" ? t("save") : t("save")}
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-auto">
          <TicketForm 
            mode={mode} 
            customers={customerOptions} 
            ticket={ticket ? {
              id: ticket.id,
              customerId: ticket.customerId,
              title: ticket.title,
              description: ticket.description || "",
              priority: ticket.priority,
              status: ticket.status,
              assignedUser: ticket.assignedUser ? {
                id: ticket.assignedUser.id,
                firstName: ticket.assignedUser.firstName,
                lastName: ticket.assignedUser.lastName,
                email: ticket.assignedUser.email,
              } : null,
              appointments: appointments,
            } : undefined}
            companyId={companyId}
          />
        </div>
      </div>
    );
  }

  // Admin tüm ticket'leri görebilir, diğer roller sadece kendi ticket'sini
  //const companyFilter = isAdmin(session) ? {} : { companyId };
  const userFilter = isAdminOrSupervisor(session) ? {} : { assignedUserId };

  const tickets = await prisma.ticket.findMany({
    where: { deletedAt: null,
      ...companyFilter, 
      ...userFilter,   
      ...(params.search
        ? {
            OR: [
              { title: { contains: params.search, mode: "insensitive" } },
              { description: { contains: params.search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: {
      customer: true,
      assignedUser: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-orange-100 flex items-center justify-center">
            <Ticket size={20} className="text-orange-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{t("title")}</h1>
            <p className="text-sm text-slate-500">{tickets.length} {t("title").toLowerCase()}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <TicketSearch />
          <Link
            href="/dashboard/tickets?mode=create"
            className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors shadow-sm min-w-[140px]"
          >
            <Plus size={16} />
            {t("new")}
          </Link>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="grid gap-3">
          {tickets.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 text-center">
              <div className="text-slate-400 text-4xl mb-3">🎫</div>
              <p className="text-slate-500 font-medium">{t("noTicketsFound")}</p>
            </div>
          ) : (
            tickets.map((ticket: any) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
