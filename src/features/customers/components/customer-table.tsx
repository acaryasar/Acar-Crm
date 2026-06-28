"use client";



import Link from "next/link";

import { useTranslations } from "next-intl";

import { MapPin, Mail, Phone, Ticket, } from "lucide-react";

import { EntityActions } from "@/components/shared/entity/entity-actions";

import { deleteCustomer } from "@/features/customers/actions/delete-customer";

import { ViewButton } from "@/components/shared/entity/view-button";

import { useEntityDelete } from "@/hooks/use-entity-delete";

import { toggleEntityStatus } from "@/features/shared/actions/toggle-status";

import { useEntityToggleStatus } from "@/hooks/use-entity-toggle-status";

import { useSession } from "next-auth/react";

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

  _count: {

    tickets: number;

  };

}



export function CustomerTable({ customers }: { customers: Customer[] }) {

  const t = useTranslations("customers");

  const { data: session } = useSession();

  const { handleDelete, deleteId, confirmDelete, cancelDelete } = useEntityDelete(deleteCustomer);

  const { handleToggleStatus } = useEntityToggleStatus((id) => toggleEntityStatus({ entityType: "CUSTOMER", entityId: id, revalidatePath: "/dashboard/customers" }));

  const userRole = session?.user?.role;



  if (!customers.length) {

    return (

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 text-center">

        <div className="text-slate-400 text-4xl mb-3">👤</div>

        <p className="text-slate-500 font-medium">{t("noCustomersFound")}</p>

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
                {t("email")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {t("phone")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {t("address")}
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

          {customers.map((customer) => {

            const initials = `${customer.firstName[0]}${customer.lastName[0]}`.toUpperCase();

            const address = customer.street && customer.city ? `${customer.street}, ${customer.postalCode ?? ""} ${customer.city}`.trim()

              : customer.city || customer.street || null;            



            const statusText = customer?.deletedAt ? t("deleted") : customer?.is_active ? t("active") : t("passive");



            const badgeColor = customer?.deletedAt

              ? "bg-red-50 text-red-700 border-red-200"        // Silinmiş

              : customer?.is_active

                ? "bg-emerald-50 text-emerald-700 border-emerald-200" // Aktif

                : "bg-slate-50 text-slate-600 border-slate-200";     // Pasif



            return (

              <tr key={customer.id} className="hover:bg-slate-50 transition-colors">

                <td className="px-6 py-4">

                  <div className="flex items-center gap-3">

                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-sm font-semibold shrink-0">

                      {initials}

                    </div>

                    <span className="font-medium text-slate-800">

                      {customer.firstName} {customer.lastName}

                    </span>

                  </div>

                </td>



                <td className="px-6 py-4">

                  {customer.email ? (

                    <div className="flex items-center gap-1.5 text-sm text-slate-600">

                      <Mail size={13} className="text-slate-400" />

                      {customer.email}

                    </div>

                  ) : (

                    <span className="text-slate-300">—</span>

                  )}

                </td>



                <td className="px-6 py-4">

                  {customer.phone ? (

                    <div className="flex items-center gap-1.5 text-sm text-slate-600">

                      <Phone size={13} className="text-slate-400" />

                      {customer.phone}

                    </div>

                  ) : (

                    <span className="text-slate-300">—</span>

                  )}

                </td>



                <td className="px-6 py-4">

                  {address ? (

                    <div className="flex items-center gap-1.5 text-sm text-slate-600">

                      <MapPin size={13} className="text-slate-400 shrink-0" />

                      <span className="truncate max-w-[200px]">{address}</span>

                    </div>

                  ) : (

                    <span className="text-slate-300">—</span>

                  )}

                </td>



                <td className="px-6 py-4 text-center">

                  <Link

                    href={`/dashboard/tickets?customerId=${customer.id}`}

                    className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors text-xs font-semibold px-2.5 py-1 rounded-full"

                  >

                    <Ticket size={11} />

                    {customer._count.tickets}

                  </Link>

                </td>



                <td className="px-6 py-4">

                  {statusText ? (

                    <div className={`flex items-center gap-1.5 text-sm text-slate-600 ${badgeColor}`}>

                      <MapPin size={13} className="text-slate-400 shrink-0" />

                      <span className="truncate max-w-[200px]">{statusText}</span>

                    </div>

                  ) : (

                    <span className="text-slate-300">—</span>

                  )}

                </td>



                <td className="px-6 py-4">



                  <div className="flex items-center justify-end gap-2">

                    <ViewButton href={`/dashboard/customers?mode=view&id=${customer.id}`} />

                    <EntityActions

                      entityType="CUSTOMER"

                      entityId={customer.id}

                      isActive={customer.is_active}

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

