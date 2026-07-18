import { getSession } from "@/lib/auth-guard";
import { LogoutButton } from "./logout-button";
import { LanguageSwitcher } from "./language-switcher";
import { NotificationBell } from "./notification-bell";
import { Search } from "lucide-react";
import { cookies } from "next/headers";
import { LOCALE_STORAGE_KEY, isLocale, defaultLocale, messages } from "@/i18n/config";

export async function Topbar() {
  const session = await getSession();
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get(LOCALE_STORAGE_KEY);
  const cookieLocale = localeCookie?.value;
  const userLocale = session?.user?.locale;
  const locale: keyof typeof messages =
    cookieLocale && isLocale(cookieLocale) ? cookieLocale :
    userLocale && isLocale(userLocale) ? userLocale :
    defaultLocale;
  const t = (key: string) => messages[locale].topbar[key as keyof typeof messages[typeof locale]["topbar"]];
  const tRole = (key: string) => messages[locale].roles[key as keyof typeof messages[typeof locale]["roles"]];

  const userName = session?.user?.name ?? "User";
  const initials = userName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
  const roleName = session?.user?.role ? tRole(session.user.role) : "Employee";

  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 gap-4">

      {/* Search */}
      <div className="relative w-72">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          placeholder={t("search")}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition"
        />
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3 ml-auto">
        <LanguageSwitcher />
        <NotificationBell />

        {/* Divider */}
        <div className="h-6 w-px bg-slate-200" />

        {/* User info */}
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-xs font-semibold">
            {initials}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-slate-800 leading-tight">{userName}</p>
            <p className="text-xs text-slate-400 leading-tight">{roleName}</p>
          </div>
        </div>

        <LogoutButton label={t("logout")} />
      </div>
    </header>
  );
}