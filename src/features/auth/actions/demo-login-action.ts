"use server";

import { signIn } from "@/auth";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { type UserRole } from "@prisma/client";

// Keep these in sync with the `demoAccounts` list in prisma/seed.ts.
// This mapping never reaches the client bundle — only the bound server
// action function reference does.
const DEMO_CREDENTIALS: Record<UserRole, { email: string; password: string }> = {
  ADMIN: { email: "demo.admin@acar-crm.local", password: "Demo-Admin-2026!" },
  SUPERVISOR: { email: "demo.supervisor@acar-crm.local", password: "Demo-Supervisor-2026!" },
  MANAGER: { email: "demo.manager@acar-crm.local", password: "Demo-Manager-2026!" },
  EMPLOYEE: { email: "demo.employee@acar-crm.local", password: "Demo-Employee-2026!" },
};

export async function demoLoginAction(role: UserRole) {
  const credentials = DEMO_CREDENTIALS[role];

  if (!credentials) {
    redirect("/login");
  }

  try {
    await signIn("credentials", {
      email: credentials.email,
      password: credentials.password,
      redirect: false,
    });
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error("Demo login error:", error);
    redirect("/login?error=demo");
  }

  redirect("/dashboard");
}
