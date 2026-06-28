"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Building2, Users, UserRound, Ticket, Calendar } from "lucide-react";
import { EntityActions } from "@/components/shared/entity/entity-actions";
import { deleteCompany } from "@/features/companies/actions/delete-company";
import { ViewButton } from "@/components/shared/entity/view-button";
import { useEntityDelete } from "@/hooks/use-entity-delete";
import { toggleEntityStatus } from "@/features/shared/actions/toggle-status";
import { useEntityToggleStatus } from "@/hooks/use-entity-toggle-status";
import { useSession } from "next-auth/react";

interface Company {
  id: string;
  name: string;
  createdAt: Date;
  is_active: boolean;
  deletedAt: Date | null;
  _count: {
    users: number;
    customers: number;
    tickets: number;
  };
}

export function CompanyTable({ companies }: { companies: Company[] }) {
  const t = useTranslations("companies");
  const { data: session } = useSession();
  const { handleDelete, deleteId, confirmDelete, cancelDelete } = useEntityDelete(deleteCompany);
  const { handleToggleStatus } = useEntityToggleStatus((id) => toggleEntityStatus({ entityType: "COMPANY", entityId: id, revalidatePath: "/dashboard/companies" }));
  const userRole = session?.user?.role;

  if (!companies.length) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 text-center">
        <div className="text-slate-400 text-4xl mb-3">🏢</div>
        <p className="text-slate-500 font-medium">{t("noCompaniesFound")}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-slate-50 z-10">
            <tr className="border-b border-slate-100">
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {t("name")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {t("created")}
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {t("totalUsers")}
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {t("totalCustomers")}
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {t("totalTickets")}
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {t("isActive")}
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {t("actions")}
              </th>
            </tr>
          </thead>

        <tbody className="divide-y divide-slate-100">
          {companies.map((company) => {
            const initials = company.name.substring(0, 2).toUpperCase();

            const statusText = company?.deletedAt ? t("deleted") : company?.is_active ? t("active") : t("passive");

            const badgeColor = company?.deletedAt
              ? "bg-red-50 text-red-700 border-red-200"
              : company?.is_active
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-slate-50 text-slate-600 border-slate-200";

            return (
              <tr key={company.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-slate-500 to-slate-700 flex items-center justify-center text-white text-sm font-semibold shrink-0">
                      {initials}
                    </div>
                    <span className="font-medium text-slate-800">
                      {company.name}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-sm text-slate-600">
                    <Calendar size={13} className="text-slate-400" />
                    {new Date(company.createdAt).toLocaleDateString()}
                  </div>
                </td>

                <td className="px-6 py-4 text-center">
                  <Link
                    href={`/dashboard/users?companyId=${company.id}`}
                    className="inline-flex items-center gap-1 bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors text-xs font-semibold px-2.5 py-1 rounded-full"
                  >
                    <Users size={11} />
                    {company._count.users}
                  </Link>
                </td>

                <td className="px-6 py-4 text-center">
                  <Link
                    href={`/dashboard/customers?companyId=${company.id}`}
                    className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors text-xs font-semibold px-2.5 py-1 rounded-full"
                  >
                    <UserRound size={11} />
                    {company._count.customers}
                  </Link>
                </td>

                <td className="px-6 py-4 text-center">
                  <Link
                    href={`/dashboard/tickets?companyId=${company.id}`}
                    className="inline-flex items-center gap-1 bg-orange-50 text-orange-700 hover:bg-orange-100 transition-colors text-xs font-semibold px-2.5 py-1 rounded-full"
                  >
                    <Ticket size={11} />
                    {company._count.tickets}
                  </Link>
                </td>

                <td className="px-6 py-4">
                  {statusText ? (
                    <div className={`flex items-center gap-1.5 text-sm text-slate-600 ${badgeColor}`}>
                      <span className="truncate max-w-[200px]">{statusText}</span>
                    </div>
                  ) : (
                    <span className="text-slate-300">—</span>
                  )}
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <ViewButton href={`/dashboard/companies?mode=view&id=${company.id}`} />
                    <EntityActions
                      entityType="COMPANY"
                      entityId={company.id}
                      isActive={company.is_active}
                      onDelete={handleDelete}
                      onToggleStatus={handleToggleStatus}
                      deleteId={deleteId}
                      confirmDelete={confirmDelete}
                      cancelDelete={cancelDelete}
                      userRole={userRole}
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>
    </div>
  );
}
