import { prisma } from "@/lib/prisma";
import { UserTable } from "@/features/users/components/user-table"
import { UserForm } from "@/features/users/components/user-form"
import Link from "next/link";
import { UserSearch } from "@/features/users/components/user-search";
import { cookies } from "next/headers";
import { LOCALE_STORAGE_KEY, isLocale, defaultLocale, messages } from "@/i18n/config";
import { Users, Plus, ArrowLeft, Edit, Save } from "lucide-react";
import { requireRole, isAdminOrSupervisor, isAdmin } from "@/lib/auth-guard";


export default async function UsersPage({
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

  const params = await searchParams;
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get(LOCALE_STORAGE_KEY);
  const locale = localeCookie && isLocale(localeCookie.value) ? localeCookie.value : defaultLocale;
  const t = (key: string) => messages[locale].users[key as keyof typeof messages[typeof locale]["users"]];

  const mode = params.mode || "list";
  const userId = params.id;

  let user = null;
  if ((mode === "edit" || mode === "view") && userId) {
    user = await prisma.user.findUnique({
      where: { id: userId },
    });
  }

  if (mode !== "list") {
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between mb-6 shrink-0">
          <div className="flex items-center gap-3">
            <Link 
              href="/users" 
              className="inline-flex items-center justify-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>            
            <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
              <Users size={20} className="text-slate-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                {mode === "create" ? t("newUser") : mode === "edit" ? t("editUser") : t("viewUser")}
              </h1>
              <p className="text-sm text-slate-500">
                {mode === "create" ? t("createUserDesc") : `${user?.firstName} ${user?.lastName}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {mode === "view" && user && (
              <Link 
                href={`/users?mode=edit&id=${user.id}`}
                className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors shadow-sm"
              >
                <Edit size={16} />
                {t("edit")}
              </Link>
            )}
            {mode !== "view" && (
              <button 
                form="user-form"
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
          <UserForm 
            mode={mode} 
            user={user ? {
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              role: user.role,
            } : undefined}
          />
        </div>
      </div>
    );
  }

  // Admin tüm user'leri görebilir, diğer roller tüm user'leri görebilir
  const users = await prisma.user.findMany({
      where: { deletedAt: null,

        ...(params.search
          ? {
              OR: [
                { firstName: { contains: params.search } },
                { lastName:  { contains: params.search } },
                { email:     { contains: params.search } },
              ],
            }
          : {}),
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
            <Users size={20} className="text-slate-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{t("title")}</h1>
            <p className="text-sm text-slate-500">{users.length} {t("title").toLowerCase()}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <UserSearch />
          <Link
            href="/users?mode=create"
            className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors shadow-sm min-w-[140px]"
          >
            <Plus size={12} />
            {t("new")}
          </Link>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <UserTable users={users} />
      </div>
    </div>
  );
}