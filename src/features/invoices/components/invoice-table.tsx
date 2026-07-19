"use client";

import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Receipt, UserRound, Eye, Edit, Mail, DollarSign } from "lucide-react";
import { useEntityDelete } from "@/hooks/use-entity-delete";
import { useEntityToggleStatus } from "@/hooks/use-entity-toggle-status";
import { EntityActions } from "@/components/shared/entity/entity-actions";
import { ViewButton } from "@/components/shared/entity/view-button";
import { deleteInvoice } from "@/features/invoices/actions/delete-invoice";
import { toggleEntityStatus } from "@/features/shared/actions/toggle-status";

interface Props {
  invoices: any[];
}

export function InvoiceTable({ invoices }: Props) {
  const t = useTranslations("invoices");
  const { data: session } = useSession();
  const { handleDelete, deleteId, confirmDelete, cancelDelete } = useEntityDelete(deleteInvoice);
  const { handleToggleStatus } = useEntityToggleStatus((id) => toggleEntityStatus({ entityType: "INVOICE", entityId: id, revalidatePath: "/invoices" }));
  const userRole = session?.user?.role;

  const statusColors: Record<string, string> = {
    DRAFT: 'bg-slate-100 text-slate-600',
    SENT: 'bg-blue-100 text-blue-700',
    PARTIAL: 'bg-amber-100 text-amber-700',
    PAID: 'bg-emerald-100 text-emerald-700',
    OVERDUE: 'bg-red-100 text-red-700',
    CANCELLED: 'bg-slate-200 text-slate-500',
  };

  return (
    <div className="rounded-xl bg-white shadow-sm border border-slate-100 overflow-hidden">
      <table className="w-full">
        <thead className="bg-slate-50 border-b border-slate-100">
          <tr>
            <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 py-3">
              {t("invoiceNumber")}
            </th>
            <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 py-3">
              {t("customer")}
            </th>
            <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 py-3">
              {t("invoiceDate")}
            </th>
            <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 py-3">
              {t("dueDate")}
            </th>
            <th className="text-right text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 py-3">
              {t("total")}
            </th>
            <th className="text-right text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 py-3">
              {t("paidAmount")}
            </th>
            <th className="text-center text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 py-3">
              {t("status")}
            </th>
            <th className="text-center text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 py-3">
              {t("emailSent")}
            </th>
            <th className="text-right text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 py-3">
              {t("actions")}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {invoices.length === 0 ? (
            <tr>
              <td colSpan={9} className="px-4 py-12 text-center text-slate-400">
                {t("noInvoicesFound")}
              </td>
            </tr>
          ) : (
            invoices.map((invoice) => (
              <tr key={invoice.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <span className="text-sm font-medium text-slate-700">{invoice.invoiceNumber}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <UserRound size={14} className="text-slate-400" />
                    <span className="text-sm text-slate-700">
                      {invoice.customer.firstName} {invoice.customer.lastName}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-slate-600">
                    {new Date(invoice.invoiceDate).toLocaleDateString('tr-TR')}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-slate-600">
                    {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString('tr-TR') : '-'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="text-sm font-medium text-slate-700">
                    {parseFloat(invoice.totalAmount).toFixed(2)} ₺
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="text-sm text-slate-600">
                    {parseFloat(invoice.paidAmount).toFixed(2)} ₺
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    statusColors[invoice.status] || 'bg-slate-100 text-slate-600'
                  }`}>
                    {t(`statuses.${invoice.status}`) || invoice.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  {invoice.emailSent ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                      <Mail size={10} />
                      {t("sent")}
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-slate-400 bg-slate-50">
                      {t("notSent")}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <ViewButton href={`/invoices?mode=view&id=${invoice.id}`} />
                    <EntityActions
                      entityType="INVOICE"
                      entityId={invoice.id}
                      isActive={invoice.status !== "CANCELLED"}
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
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
