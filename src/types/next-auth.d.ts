import { UserRole } from "@prisma/client";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name?: string | null;
    role: UserRole;
    locale?: string;
    /** True for the read-only demo accounts created for the login page's "view as" buttons. */
    isDemo?: boolean;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      role: UserRole;
      locale?: string;
      isDemo?: boolean;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
    locale?: string;
    isDemo?: boolean;
  }
}
