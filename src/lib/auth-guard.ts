import { cache } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const getSession = cache(auth);

export async function requireRole(roles: string[]) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const role = (session.user as any).role;

  if (!roles.includes(role)) {
    redirect("/dashboard");
  }

  return session;
}

// Rol kontrol yardımcı fonksiyonları
export function isAdmin(session: any): boolean {
  return session?.user?.role === "ADMIN";
}

export function isSupervisor(session: any): boolean {
  return session?.user?.role === "SUPERVISOR";
}

export function isManager(session: any): boolean {
  return session?.user?.role === "MANAGER";
}

export function isEmployee(session: any): boolean {
  return session?.user?.role === "EMPLOYEE";
}

// Admin veya Supervisor kontrolü
export function isAdminOrSupervisor(session: any): boolean {
  return isAdmin(session) || isSupervisor(session);
}

// Kullanıcının sadece kendi verilerine erişim kontrolü
export function canAccessOwnDataOnly(session: any): boolean {
  return !isAdmin(session) && !isSupervisor(session);
}