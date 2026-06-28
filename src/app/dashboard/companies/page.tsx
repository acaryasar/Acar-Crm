import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { CompanySearch } from "@/features/companies/components/company-search";
import { CompanyTable } from "@/features/companies/components/company-table";
import { CompanyForm } from "@/features/companies/components/company-form";
import { requireRole } from "@/lib/auth-guard";
import { cookies } from "next/headers";
import { LOCALE_STORAGE_KEY, isLocale, defaultLocale, messages } from "@/i18n/config";
import { Building2, Plus, ArrowLeft, Edit, Save } from "lucide-react";

export default async function CompaniesPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    page?: string;
    mode?: "create" | "edit" | "view";
    id?: string;
  }>;
}) {
  await requireRole(["ADMIN"]);

  const params = await searchParams;
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get(LOCALE_STORAGE_KEY);
  const locale = localeCookie && isLocale(localeCookie.value) ? localeCookie.value : defaultLocale;
  const t = (key: string) => messages[locale].companies[key as keyof typeof messages[typeof locale]["companies"]];

  const mode = params.mode || "list";
  const companyId = params.id;

  let company = null;
  if ((mode === "edit" || mode === "view") && companyId) {
    company = await prisma.company.findUnique({
      where: { id: companyId },
    });
  }

  if (mode !== "list") {
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between mb-6 shrink-0">
          <div className="flex items-center gap-3">
            <Link 
              href="/dashboard/companies" 
              className="inline-flex items-center justify-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
            <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
              <Building2 size={20} className="text-slate-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                {mode === "create" ? t("newCompany") : mode === "edit" ? t("editCompany") : t("viewCompany")}
              </h1>
              <p className="text-sm text-slate-500">
                {mode === "create" ? t("createCompanyDesc") : company?.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {mode === "view" && company && (
              <Link 
                href={`/dashboard/companies?mode=edit&id=${company.id}`}
                className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors shadow-sm"
              >
                <Edit size={16} />
                {t("edit")}
              </Link>
            )}
            {mode !== "view" && (
              <button 
                form="company-form"
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
          <CompanyForm mode={mode} company={company || undefined} />
        </div>
      </div>
    );
  }

  const companies = await prisma.company.findMany({
    where: { deletedAt: null,
      ...(params.search
        ? {
            name: {
              contains: params.search,
              mode: "insensitive",
            },
          }
        : {}),
    },
    include: {
      _count: {
        select: {
          users: true,
          customers: true,
          tickets: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
            <Building2 size={20} className="text-slate-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{t("title")}</h1>
            <p className="text-sm text-slate-500">{companies.length} {t("title").toLowerCase()}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <CompanySearch />
          <Link
            href="/dashboard/companies?mode=create"
            className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors shadow-sm min-w-[140px]"
          >
            <Plus size={16} />
            {t("new")}
          </Link>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <CompanyTable companies={companies} />
      </div>
    </div>
  );
}
