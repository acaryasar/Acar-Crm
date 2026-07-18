import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { CustomerSearch } from "@/features/customers/components/customer-search";
import { CustomerTable } from "@/features/customers/components/customer-table";
import { CustomerForm } from "@/features/customers/components/customer-form";
import { CustomerStatsCards } from "@/features/customers/components/customer-stats-cards";
import { requireRole, isAdmin, isAdminOrSupervisor } from "@/lib/auth-guard";
import { cookies } from "next/headers";
import { LOCALE_STORAGE_KEY, isLocale, defaultLocale, messages } from "@/i18n/config";
import { UserRound, Plus, ArrowLeft, Edit, Eye, Save, Download, Upload } from "lucide-react";

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    page?: string;
    mode?: "create" | "edit" | "view";
    id?: string;
  }>;
}) {
  const session = await requireRole(["ADMIN", "SUPERVISOR", "MANAGER", "EMPLOYEE"]);
  const companyId = session.user.companyId;
  const deletedAt = null;
  const params = await searchParams;
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get(LOCALE_STORAGE_KEY);
  const locale = localeCookie && isLocale(localeCookie.value) ? localeCookie.value : defaultLocale;
  const t = (key: string) => messages[locale].customers[key as keyof typeof messages[typeof locale]["customers"]];

  const mode = params.mode || "list";
  const customerId = params.id;

  let customer = null;
  if ((mode === "edit" || mode === "view") && customerId) {
    customer = await prisma.customer.findUnique({
      where: { id: customerId },
    });
  }

  // Form modunda ise tabloyu gösterme
  if (mode !== "list") {
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between mb-6 shrink-0">
          <div className="flex items-center gap-3">
            <Link 
              href="/dashboard/customers" 
              className="inline-flex items-center justify-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
            <div className="h-10 w-10 rounded-xl bg-indigo-100 flex items-center justify-center">
              <UserRound size={20} className="text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                {mode === "create" ? t("newCustomer") : mode === "edit" ? t("editCustomer") : t("viewCustomer")}
              </h1>
              <p className="text-sm text-slate-500">
                {mode === "create" ? t("createCustomerDesc") : `${customer?.firstName} ${customer?.lastName}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {mode === "view" && customer && (
              <Link 
                href={`/dashboard/customers?mode=edit&id=${customer.id}`}
                className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors shadow-sm"
              >
                <Edit size={16} />
                {t("edit")}
              </Link>
            )}
            {mode !== "view" && (
              <button 
                form="customer-form"
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
          <CustomerForm mode={mode} customer={customer || undefined} />
        </div>
      </div>
    );
  }

  // List modunda
  const companyFilter = isAdmin(session) ? {} : { companyId };
  const deleteFilter = isAdminOrSupervisor(session) ? {} : { deletedAt };

  const customers =
    await prisma.customer.findMany({
      where: {
        ...deleteFilter,
        ...companyFilter,     
        ...(params.search
          ? {
              OR: [
                {
                  firstName: {
                    contains: params.search,
                    mode: "insensitive",
                  },
                },
                {
                  lastName: {
                    contains: params.search,
                    mode: "insensitive",
                  },
                },
              ],
            }
          : {}),
      },

      include: {
        _count: {
          select: {
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
      {/* Header */}
      <div className="mb-6 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-100 flex items-center justify-center">
              <UserRound size={20} className="text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">{t("title")}</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium px-4 py-2.5 rounded-xl transition-colors shadow-sm">
              <Download size={16} />
              {t("export")}
            </button>
            <button className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium px-4 py-2.5 rounded-xl transition-colors shadow-sm">
              <Upload size={16} />
              {t("import")}
            </button>
            <Link href="/dashboard/customers?mode=create" className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors shadow-sm">
              <Plus size={16} />
              {t("newCustomer")}
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <CustomerStatsCards />

      {/* Table */}
      <div className="flex-1 min-h-0 mt-6">
        <CustomerTable customers={customers} />
      </div>
    </div>
  );
}