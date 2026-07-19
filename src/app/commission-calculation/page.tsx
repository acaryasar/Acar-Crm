import { requireRole } from "@/lib/auth-guard";
import { cookies } from "next/headers";
import { LOCALE_STORAGE_KEY, isLocale, defaultLocale, messages } from "@/i18n/config";
import { BarChart3 } from "lucide-react";
import { CommissionCalculationForm } from "@/features/commission-calculation/components/commission-calculation-form";

export default async function CommissionCalculationPage() {
  await requireRole(["ADMIN", "SUPERVISOR", "MANAGER"]);

  const cookieStore = await cookies();
  const localeCookie = cookieStore.get(LOCALE_STORAGE_KEY);
  const locale = localeCookie && isLocale(localeCookie.value) ? localeCookie.value : defaultLocale;
  const t = (key: string) => messages[locale].commission[key as keyof typeof messages[typeof locale]["commission"]];

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6 shrink-0">
        <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
          <BarChart3 size={20} className="text-slate-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{t("calculationTitle")}</h1>
          <p className="text-sm text-slate-500">{t("calculationDescription")}</p>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <CommissionCalculationForm />
      </div>
    </div>
  );
}
