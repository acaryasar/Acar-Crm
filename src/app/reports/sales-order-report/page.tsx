import { requireRole } from "@/lib/auth-guard";
import { cookies } from "next/headers";
import { LOCALE_STORAGE_KEY, isLocale, defaultLocale, messages } from "@/i18n/config";
import { FileText, Calendar } from "lucide-react";
import { SummaryCards } from "@/features/reports/sales-order-report/components/summary-cards";
import { SalesCharts } from "@/features/reports/sales-order-report/components/sales-charts";
import { SalesOrderDetailsTable } from "@/features/reports/sales-order-report/components/sales-order-details-table";
import { DateRangeFilter } from "@/features/reports/sales-order-report/components/date-range-filter";

export default async function SalesOrderReportPage({
  searchParams,
}: {
  searchParams: Promise<{
    startDate?: string;
    endDate?: string;
  }>;
}) {
  const session = await requireRole(["ADMIN", "SUPERVISOR"]);
  const params = await searchParams;
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get(LOCALE_STORAGE_KEY);
  const locale = localeCookie && isLocale(localeCookie.value) ? localeCookie.value : defaultLocale;
  const t = (key: string) => messages[locale].salesOrderReport?.[key as keyof typeof messages[typeof locale]["salesOrderReport"]] || key;

  const startDate = params.startDate || "2024-05-01";
  const endDate = params.endDate || "2024-05-31";

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-100 flex items-center justify-center">
            <FileText size={20} className="text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{String(t("title"))}</h1>
            <p className="text-sm text-slate-500">Raporlar &gt; {String(t("title"))}</p>
          </div>
        </div>

        <DateRangeFilter initialStartDate={startDate} initialEndDate={endDate} />
      </div>

      <div className="flex-1 min-h-0 overflow-auto space-y-6">
        <SummaryCards startDate={startDate} endDate={endDate} />
        
        <SalesCharts startDate={startDate} endDate={endDate} />
        
        <SalesOrderDetailsTable startDate={startDate} endDate={endDate} />
      </div>
    </div>
  );
}
