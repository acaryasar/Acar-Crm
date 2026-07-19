"use client";

import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ShoppingCart, UserRound, Eye, Edit, Trash2 } from "lucide-react";
import { EntityActions } from "@/components/shared/entity/entity-actions";
import { ViewButton } from "@/components/shared/entity/view-button";
import { useEntityDelete } from "@/hooks/use-entity-delete";
import { useEntityToggleStatus } from "@/hooks/use-entity-toggle-status";
import { toggleEntityStatus } from "@/features/shared/actions/toggle-status";

interface Props {
  orders: any[];
}

export function OrderTable({ orders }: Props) {
  const t = useTranslations("orders");
  const { data: session } = useSession();
  const { handleDelete, deleteId, confirmDelete, cancelDelete } = useEntityDelete(() => Promise.resolve());
  const { handleToggleStatus } = useEntityToggleStatus((id) => toggleEntityStatus({ entityType: "ORDER", entityId: id, revalidatePath: "/orders" }));
  const userRole = session?.user?.role;

  const statusColors: Record<string, string> = {
    DRAFT: 'bg-slate-100 text-slate-600',
    PENDING: 'bg-amber-100 text-amber-700',
    CONFIRMED: 'bg-blue-100 text-blue-700',
    PROCESSING: 'bg-indigo-100 text-indigo-700',
    SHIPPED: 'bg-purple-100 text-purple-700',
    DELIVERED: 'bg-emerald-100 text-emerald-700',
    COMPLETED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700',
  };

  const paymentStatusColors: Record<string, string> = {
    UNPAID: 'bg-slate-100 text-slate-600',
    PARTIAL: 'bg-amber-100 text-amber-700',
    PAID: 'bg-emerald-100 text-emerald-700',
    REFUNDED: 'bg-red-100 text-red-700',
  };

  return (
    <div className="rounded-xl bg-white shadow-sm border border-slate-100 overflow-hidden">
      <table className="w-full">
        <thead className="bg-slate-50 border-b border-slate-100">
          <tr>
            <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 py-3">
              {t("orderNumber")}
            </th>
            <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 py-3">
              {t("customer")}
            </th>
            <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 py-3">
              {t("orderDate")}
            </th>
            <th className="text-right text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 py-3">
              {t("itemCount")}
            </th>
            <th className="text-right text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 py-3">
              {t("total")}
            </th>
            <th className="text-center text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 py-3">
              {t("status")}
            </th>
            <th className="text-center text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 py-3">
              {t("paymentStatus")}
            </th>
            <th className="text-right text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 py-3">
              {t("actions")}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {orders.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-4 py-12 text-center text-slate-400">
                {t("noOrdersFound")}
              </td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <span className="text-sm font-medium text-slate-700">{order.orderNumber}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <UserRound size={14} className="text-slate-400" />
                    <span className="text-sm text-slate-700">
                      {order.customer.firstName} {order.customer.lastName}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-slate-600">
                    {new Date(order.orderDate).toLocaleDateString('tr-TR')}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="text-sm text-slate-600">{order.orderItems.length}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="text-sm font-medium text-slate-700">
                    {parseFloat(order.totalAmount).toFixed(2)} ₺
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    statusColors[order.status] || 'bg-slate-100 text-slate-600'
                  }`}>
                    {t(`statuses.${order.status}`) || order.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    paymentStatusColors[order.paymentStatus] || 'bg-slate-100 text-slate-600'
                  }`}>
                    {t(`paymentStatuses.${order.paymentStatus}`) || order.paymentStatus}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <ViewButton href={`/orders?mode=view&id=${order.id}`} />
                    <EntityActions
                      entityType="ORDER"
                      entityId={order.id}
                      isActive={order.status !== "CANCELLED"}
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
