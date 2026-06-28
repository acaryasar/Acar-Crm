import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { LOCALE_STORAGE_KEY, isLocale, defaultLocale, messages } from "@/i18n/config";
import { ListFilter, Search } from "lucide-react";
import { requireRole } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";

export default async function ActivityLogsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const session = await requireRole(["ADMIN", "SUPERVISOR"]);
  const params = await searchParams;

  const cookieStore = await cookies();
  const localeCookie = cookieStore.get(LOCALE_STORAGE_KEY);
  const locale = localeCookie && isLocale(localeCookie.value) ? localeCookie.value : defaultLocale;
  const t = (key: string) => messages[locale].activityLogs[key as keyof typeof messages[typeof locale]["activityLogs"]] as string;

  // Build where clause based on role
  const whereClause: any = {};
  const searchQuery = params.search || "";

  if ((session.user as any).role === "ADMIN") {
    // Admin sees all activity logs
  } else if ((session.user as any).role === "SUPERVISOR") {
    // Supervisor sees logs from their company
    whereClause.companyId = (session.user as any).companyId;
  }

  // Add search filter if provided
  if (searchQuery) {
    whereClause.OR = [
      { action: { contains: searchQuery, mode: "insensitive" } },
      { entityType: { contains: searchQuery, mode: "insensitive" } },
    ];
  }

  // Fetch logs directly from Prisma
  const logs = await prisma.activityLog.findMany({
    where: whereClause,
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      company: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const entityNames: Record<string, string> = {
    CUSTOMER: t("entities.customer"),
    USER: t("entities.user"),
    TICKET: t("entities.ticket"),
    COMPANY: t("entities.company"),
    APPOINTMENT: t("entities.appointment"),
    QUOTE: t("entities.quote"),
    INVOICE: t("entities.invoice"),
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <ListFilter size={20} className="text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{t("title")}</h1>
            <p className="text-sm text-slate-500">{logs.length} {t("title").toLowerCase()}</p>
          </div>
        </div>

        <form className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            name="search"
            placeholder={t("searchPlaceholder")}
            defaultValue={searchQuery}
            className="pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-64"
          />
          <button type="submit" className="sr-only">
            {t("search")}
          </button>
        </form>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {logs.length === 0 ? (
            <div className="p-16 text-center">
              <div className="text-slate-400 text-4xl mb-3">📋</div>
              <p className="text-slate-500 font-medium">{t("noLogsFound")}</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {t("action")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {t("entityType")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {t("user")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {t("company")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {t("timestamp")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log: any) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-medium text-slate-800">{log.action}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                        {entityNames[log.entityType] || log.entityType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {log.user ? (
                        <span>
                          {log.user.firstName} {log.user.lastName}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {log.company ? (
                        <span>{log.company.name}</span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
