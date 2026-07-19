"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { Eye, Edit } from "lucide-react";
import { useEntityDelete } from "@/hooks/use-entity-delete";
import { useEntityToggleStatus } from "@/hooks/use-entity-toggle-status";
import { EntityActions } from "@/components/shared/entity/entity-actions";
import { ViewButton } from "@/components/shared/entity/view-button";
import { deleteCustomer } from "@/features/customers/actions/delete-customer";
import { toggleEntityStatus } from "@/features/shared/actions/toggle-status";

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  street: string | null;
  city: string | null;
  postalCode: string | null;
  is_active: boolean;
  deletedAt: Date | null;
  _count?: {
    tickets: number;
  };
  taxOffice?: string | null;
  taxNumber?: string | null;
  responsiblePerson?: string | null;
  responsiblePersonName?: string | null;
  customerGroup?: string | null;
  sector?: string | null;
}

export function CustomerTable({ customers }: { customers: Customer[] }) {
  const t = useTranslations("customers");
  const { data: session } = useSession();
  const { handleDelete, deleteId, confirmDelete, cancelDelete } = useEntityDelete(deleteCustomer);
  const { handleToggleStatus } = useEntityToggleStatus((id) => toggleEntityStatus({ entityType: "CUSTOMER", entityId: id, revalidatePath: "/customers" }));
  const userRole = session?.user?.role;

  if (!customers.length) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-16 text-center">
        <div className="text-slate-400 text-4xl mb-3">👤</div>
        <p className="text-slate-500 font-medium">{t("noCustomersFound")}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-slate-50 z-10">
            <tr className="border-b border-slate-100">
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-10">
                <input type="checkbox" className="rounded border-slate-300" />
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Müşteri
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Müşteri Grubu
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Şehir
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Sorumlu
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Sektör
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Durum
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {customers.map((customer) => {
              const statusText = customer?.deletedAt ? "Silinmiş" : customer?.is_active ? "Aktif" : "Pasif";
              const badgeColor = customer?.deletedAt
                ? "bg-red-50 text-red-700 border border-red-200"
                : customer?.is_active
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-slate-50 text-slate-600 border border-slate-200";

              return (
                <tr key={customer.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-4">
                    <input type="checkbox" className="rounded border-slate-300" />
                  </td>

                  <td className="px-4 py-4">
                    <div>
                      <div className="font-medium text-slate-800">
                        {customer.firstName} {customer.lastName}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        ID: {customer.id.slice(0, 10)}
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <span className="text-sm text-slate-600">{customer.customerGroup || "—"}</span>
                  </td>

                  <td className="px-4 py-4">
                    <span className="text-sm text-slate-600">{customer.city || "—"}</span>
                  </td>

                  <td className="px-4 py-4">
                    <span className="text-sm text-slate-600">{customer.responsiblePersonName || customer.responsiblePerson || "—"}</span>
                  </td>

                  <td className="px-4 py-4">
                    <span className="text-sm text-slate-600">{customer.sector || "—"}</span>
                  </td>

                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${badgeColor}`}>
                      {statusText}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <ViewButton href={`/customers?mode=view&id=${customer.id}`} />
                      <EntityActions
                        entityType="CUSTOMER"
                        entityId={customer.id}
                        isActive={!customer.deletedAt && customer.is_active}
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
