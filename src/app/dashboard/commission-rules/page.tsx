import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { CommissionRulesSearch } from "@/features/commission-rules/components/commission-rules-search";
import { CommissionRulesTable } from "@/features/commission-rules/components/commission-rules-table";
import { CommissionRulesForm } from "@/features/commission-rules/components/commission-rules-form";
import { requireRole } from "@/lib/auth-guard";
import { cookies } from "next/headers";
import { LOCALE_STORAGE_KEY, isLocale, defaultLocale, messages } from "@/i18n/config";
import { DollarSign, Plus, ArrowLeft, Edit, Save } from "lucide-react";

export default async function CommissionRulesPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    page?: string;
    mode?: "create" | "edit" | "view";
    id?: string;
  }>;
}) {
  await requireRole(["ADMIN", "SUPERVISOR", "MANAGER"]);

  const params = await searchParams;
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get(LOCALE_STORAGE_KEY);
  const locale = localeCookie && isLocale(localeCookie.value) ? localeCookie.value : defaultLocale;
  const t = (key: string) => messages[locale].commission[key as keyof typeof messages[typeof locale]["commission"]];

  const mode = params.mode || "list";
  const ruleId = params.id;

  let rule = null;
  if ((mode === "edit" || mode === "view") && ruleId) {
    rule = await prisma.commissionRule.findUnique({
      where: { id: ruleId },
      include: {
        tiers: {
          orderBy: { order: "asc" },
        },
      },
    });
  }

  if (mode !== "list") {
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between mb-6 shrink-0">
          <div className="flex items-center gap-3">
            <Link 
              href="/dashboard/commission-rules" 
              className="inline-flex items-center justify-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
            <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
              <DollarSign size={20} className="text-slate-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                {mode === "create" ? t("newRule") : mode === "edit" ? t("editRule") : t("viewRule")}
              </h1>
              <p className="text-sm text-slate-500">
                {mode === "create" ? t("rulesDescription") : rule?.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {mode === "view" && rule && (
              <Link 
                href={`/dashboard/commission-rules?mode=edit&id=${rule.id}`}
                className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors shadow-sm"
              >
                <Edit size={16} />
                {t("editRule")}
              </Link>
            )}
            {mode !== "view" && (
              <button 
                form="commission-rule-form"
                type="submit"
                className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors shadow-sm min-w-[140px]"
              >
                <Save size={16} />
                {t("save")}
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-auto">
          <CommissionRulesForm mode={mode} rule={rule || undefined} />
        </div>
      </div>
    );
  }

  const rules = await prisma.commissionRule.findMany({
    where: { deletedAt: null,
      ...(params.search
        ? {
            name: {
              contains: params.search,
              mode: "insensitive",
            },
          }
        : {})},
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
            <DollarSign size={20} className="text-slate-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{t("rulesTitle")}</h1>
            <p className="text-sm text-slate-500">{rules.length} {t("rulesTitle").toLowerCase()}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <CommissionRulesSearch />
          <Link
            href="/dashboard/commission-rules?mode=create"
            className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors shadow-sm min-w-[140px]"
          >
            <Plus size={16} />
            {t("newRule")}
          </Link>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <CommissionRulesTable rules={rules} />
      </div>
    </div>
  );
}
