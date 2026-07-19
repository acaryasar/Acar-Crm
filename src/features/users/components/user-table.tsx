"use client";

import { useTranslations } from "next-intl";
import { EntityActions } from "@/components/shared/entity/entity-actions";
import { deleteUser } from "@/features/users/actions/delete-user";
import { ViewButton } from "@/components/shared/entity/view-button";
import { useEntityDelete } from "@/hooks/use-entity-delete";
import { toggleEntityStatus } from "@/features/shared/actions/toggle-status";
import { useEntityToggleStatus } from "@/hooks/use-entity-toggle-status";
import { useSession } from "next-auth/react";

type UserRole = "ADMIN" | "SUPERVISOR" | "MANAGER" | "EMPLOYEE";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  is_active: boolean;
  deletedAt: Date | null;
  createdAt: Date;
}

type Props = {
  users: User[];
};

const roleColors: Record<string, string> = {
  ADMIN:      "bg-violet-100 text-violet-700",
  MANAGER:    "bg-blue-100 text-blue-700",
  SUPERVISOR: "bg-emerald-100 text-emerald-700",
  EMPLOYEE:   "bg-slate-100 text-slate-600",
};

export function UserTable({ users }: Props) {
  const t = useTranslations("users");
  const { data: session } = useSession();
  const { handleDelete, deleteId, confirmDelete, cancelDelete } = useEntityDelete(deleteUser);
  const { handleToggleStatus } = useEntityToggleStatus((id) => toggleEntityStatus({ entityType: "USER", entityId: id, revalidatePath: "/users" }));
  const userRole = session?.user?.role;

  if (!users.length) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 text-center">
        <div className="text-slate-400 text-4xl mb-3">👥</div>
        <p className="text-slate-500 font-medium">{t("noUsersFound")}</p>
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
                {t("role")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {t("created")}
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
          {users.map((user) => {
            const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
            const roleColor = roleColors[user.role] ?? "bg-slate-100 text-slate-600";

            const statusText = user?.deletedAt ? t("deleted") : user?.is_active ? t("active") : t("passive");

            const badgeColor = user?.deletedAt
              ? "bg-red-50 text-red-700 border-red-200"
              : user?.is_active
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-slate-50 text-slate-600 border-slate-200";

            return (
              <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-white text-sm font-semibold shrink-0">
                      {initials}
                    </div>
                    <span className="font-medium text-slate-800">
                      {user.firstName} {user.lastName}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4 text-sm text-slate-600">
                  {user.email}
                </td>

                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${roleColor}`}>
                    {user.role}
                  </span>
                </td>

                <td className="px-6 py-4 text-sm text-slate-500">
                  {user.createdAt.toLocaleDateString()}
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
                    <ViewButton href={`/users?mode=view&id=${user.id}`} />
                    <EntityActions
                      entityType="USER"
                      entityId={user.id}
                      isActive={user.is_active}
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
