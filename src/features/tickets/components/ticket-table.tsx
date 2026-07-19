"use client";

import { useTranslations } from "next-intl";
import { EntityActions } from "@/components/shared/entity/entity-actions";
import { deleteTicket } from "@/features/tickets/actions/delete-ticket";
import { ViewButton } from "@/components/shared/entity/view-button";
import { useEntityDelete } from "@/hooks/use-entity-delete";
import { toggleEntityStatus } from "@/features/shared/actions/toggle-status";
import { useEntityToggleStatus } from "@/hooks/use-entity-toggle-status";
import { useSession } from "next-auth/react";

interface Ticket {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  is_active: boolean;
  deletedAt: Date | null;
}

export function TicketTable({ tickets }: { tickets: Ticket[] }) {
  const t = useTranslations("tickets");
  const { data: session } = useSession();
  const { handleDelete, deleteId, confirmDelete, cancelDelete } = useEntityDelete(deleteTicket);
  const { handleToggleStatus } = useEntityToggleStatus((id) => toggleEntityStatus({ entityType: "TICKET", entityId: id, revalidatePath: "/tickets" }));
  const userRole = session?.user?.role;

  if (!tickets.length) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 text-center">
        <div className="text-slate-400 text-4xl mb-3">🎫</div>
        <p className="text-slate-500 font-medium">{t("noTicketsFound")}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-100">
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {t("name")}
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {t("email")}
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {t("phone")}
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
          {tickets.map((ticket) => {
            const statusText = ticket?.deletedAt ? t("deleted") : ticket?.is_active ? t("active") : t("passive");

            const badgeColor = ticket?.deletedAt
              ? "bg-red-50 text-red-700 border-red-200"
              : ticket?.is_active
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-slate-50 text-slate-600 border-slate-200";

            return (
              <tr key={ticket.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <span className="font-medium text-slate-800">
                    {ticket.firstName} {ticket.lastName}
                  </span>
                </td>

                <td className="px-6 py-4 text-sm text-slate-600">
                  {ticket.email || <span className="text-slate-300">—</span>}
                </td>

                <td className="px-6 py-4 text-sm text-slate-600">
                  {ticket.phone || <span className="text-slate-300">—</span>}
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
                    <ViewButton href={`/dashboard/tickets/${ticket.id}`} />
                    <EntityActions
                      entityType="TICKET"
                      entityId={ticket.id}
                      isActive={ticket.is_active}
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
  );
}