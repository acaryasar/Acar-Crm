import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { LOCALE_STORAGE_KEY, isLocale, defaultLocale, messages } from "@/i18n/config";
import { Mail, CheckCircle2, Clock } from "lucide-react";
import type { EmailInbox } from "@prisma/client";

export default async function InboxPage() {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get(LOCALE_STORAGE_KEY);
  const locale = localeCookie && isLocale(localeCookie.value) ? localeCookie.value : defaultLocale;
  const t = (key: string) => messages[locale].inbox[key as keyof typeof messages[typeof locale]["inbox"]];

  const emails = await prisma.emailInbox.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const unread = emails.filter((e: EmailInbox) => !e.processed).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
          <Mail size={20} className="text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{t("title")}</h1>
          <p className="text-sm text-slate-500">{unread} unprocessed</p>
        </div>
      </div>

      {emails.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 text-center">
          <div className="text-4xl mb-3">📭</div>
          <p className="text-slate-500 font-medium">No emails yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {t("subject")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {t("sender")}
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {t("processed")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {t("date")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {emails.map((email: EmailInbox) => (
                <tr key={email.id} className={`hover:bg-slate-50 transition-colors ${!email.processed ? "bg-blue-50/40" : ""}`}>
                  <td className="px-6 py-4">
                    <span className={`text-sm ${!email.processed ? "font-semibold text-slate-800" : "text-slate-600"}`}>
                      {email.subject || "(No subject)"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {email.fromEmail}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {email.processed ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                        <CheckCircle2 size={11} />
                        Done
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
                        <Clock size={11} />
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {email.createdAt.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
