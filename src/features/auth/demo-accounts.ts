import { type UserRole } from "@prisma/client";

export interface DemoRoleInfo {
  role: UserRole;
  label: string;
  description: string;
}

/**
 * Display metadata only — no credentials here. This file is safe to import
 * from client components. Actual demo credentials live server-side only in
 * `actions/demo-login-action.ts` (kept in sync with `prisma/seed.ts`).
 */
export const DEMO_ROLES: DemoRoleInfo[] = [
  { role: "ADMIN", label: "Yönetici", description: "Tüm sistem yönetimi ve ayarlar" },
  { role: "SUPERVISOR", label: "Süpervizör", description: "Ekip ve performans görünümü" },
  { role: "MANAGER", label: "Müdür", description: "Departman ve süreç yönetimi" },
  { role: "EMPLOYEE", label: "Çalışan", description: "Görev ve müşteri takibi" },
];
