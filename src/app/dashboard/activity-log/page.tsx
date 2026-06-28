import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { cookies } from "next/headers";
import { LOCALE_STORAGE_KEY, isLocale, defaultLocale, messages } from "@/i18n/config";

export default async function ActivityLogPage({
  searchParams,
}: {
  searchParams: Promise<{ entityType?: string; entityId?: string }>;
}) {
  const { entityType, entityId } = await searchParams;

  if (!entityType || !entityId) {
    redirect("/dashboard");
  }

  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const cookieStore = await cookies();
  const localeCookie = cookieStore.get(LOCALE_STORAGE_KEY);
  const locale = localeCookie && isLocale(localeCookie.value) ? localeCookie.value : defaultLocale;
  const t = (key: string) => messages[locale].activityLog[key as keyof typeof messages[typeof locale]["activityLog"]] as string;

  const logs = await prisma.activityLog.findMany({
    where: {
      companyId: session.user.companyId as string,
      entityType,
      entityId,
    },
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
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

  const entityName = entityNames[entityType] || entityType;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          {t("title")} - {entityName}
        </h1>
        <p className="text-slate-600 mt-1">{t("description")}</p>
      </div>

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
                  {t("user")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {t("ipAddress")}
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
                    {log.user ? (
                      <span>
                        {log.user.firstName} {log.user.lastName} ({log.user.email})
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {log.ipAddress || <span className="text-slate-400">—</span>}
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
  );
}
