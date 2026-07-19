"use client";

import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { DollarSign, Eye, Edit } from "lucide-react";
import { ViewButton } from "@/components/shared/entity/view-button";
import { EntityActions } from "@/components/shared/entity/entity-actions";
import { deleteCommissionRule } from "@/features/commission-rules/actions/delete-commission-rule";
import { useEntityDelete } from "@/hooks/use-entity-delete";
import { toggleEntityStatus } from "@/features/shared/actions/toggle-status";
import { useEntityToggleStatus } from "@/hooks/use-entity-toggle-status";

interface Props {
  rules: any[];
}

export function CommissionRulesTable({ rules }: Props) {
  const t = useTranslations("commission");
  const { data: session } = useSession();
  const { handleDelete, deleteId, confirmDelete, cancelDelete } = useEntityDelete(deleteCommissionRule);
  const { handleToggleStatus } = useEntityToggleStatus((id) => toggleEntityStatus({ entityType: "COMMISSION_RULE", entityId: id, revalidatePath: "/commission-rules" }));
  const userRole = session?.user?.role;

  if (!rules.length) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 text-center">
        <div className="text-slate-400 text-4xl mb-3">📋</div>
        <p className="text-slate-500 font-medium">{t("rulesComingSoon")}</p>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    PERCENTAGE: 'bg-blue-100 text-blue-700',
    FIXED: 'bg-emerald-100 text-emerald-700',
    TIERED: 'bg-amber-100 text-amber-700',
  };

  return (
    <div className="rounded-xl bg-white shadow-sm border border-slate-100 overflow-hidden">
      <table className="w-full">
        <thead className="bg-slate-50 border-b border-slate-100">
          <tr>
            <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 py-3">
              {t("ruleName")}
            </th>
            <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 py-3">
              {t("commissionType")}
            </th>
            <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 py-3">
              {t("commissionRate")}
            </th>
            <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 py-3">
              {t("salesTarget")}
            </th>
            <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 py-3">
              {t("calculationPeriod")}
            </th>
            <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 py-3">
              {t("effectiveDate")}
            </th>
            <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 py-3">
              {t("expiryDate")}
            </th>
            <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 py-3">
              {t("status")}
            </th>
            <th className="text-right text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 py-3">
              İşlemler
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rules.map((rule) => (
            <tr key={rule.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center">
                    <DollarSign size={14} className="text-slate-600" />
                  </div>
                  <span className="font-medium text-slate-800">{rule.name}</span>
                </div>
              </td>
              <td className="px-4 py-3">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColors[rule.commissionType] || 'bg-slate-100 text-slate-600'}`}>
                  {t(rule.commissionType.toLowerCase())}
                </span>
              </td>
              <td className="px-4 py-3 text-slate-600">
                {rule.commissionRate}%
              </td>
              <td className="px-4 py-3 text-slate-600">
                {rule.salesTarget}
              </td>
              <td className="px-4 py-3 text-slate-600">
                {t(rule.calculationPeriod?.toLowerCase() || "monthly")}
              </td>
              <td className="px-4 py-3 text-slate-600">
                {new Date(rule.effectiveDate).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 text-slate-600">
                {rule.expiryDate ? new Date(rule.expiryDate).toLocaleDateString() : '—'}
              </td>
              <td className="px-4 py-3">
                {rule.isActive ? (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                    {t("active")}
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                    {t("inactive")}
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-2">
                  <ViewButton href={`/commission-rules?mode=view&id=${rule.id}`} />
                  <EntityActions
                    entityType="COMMISSION_RULE"
                    entityId={rule.id}
                    isActive={rule.isActive}
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
          ))}
        </tbody>
      </table>
    </div>
  );
}
