import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { type UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET,
  // Cloudflare Workers isn't Vercel, so Auth.js won't auto-trust the
  // incoming Host header unless told to — without this, login fails with
  // an "UntrustedHost" error as soon as this runs somewhere other than
  // localhost. AUTH_URL (set in wrangler.jsonc vars) still pins the
  // canonical callback URL.
  trustHost: true,

  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials, request) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = String(credentials.email);

        // Basic brute-force throttle: max 10 attempts per 15 minutes per
        // IP+email pair. This is an in-memory, single-instance limiter —
        // see src/lib/rate-limit.ts for its limitations.
        const ip = getClientIp(request);
        const rate = checkRateLimit(`login:${ip}:${email.toLowerCase()}`, 10, 15 * 60 * 1000);

        if (!rate.allowed) {
          console.warn(`Login rate limit exceeded for ${email} from ${ip}`);
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          return null;
        }

        const isValid = await bcrypt.compare(
          String(credentials.password),
          user.password
        );

        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          role: user.role,
          locale: user.locale ?? undefined,
          isDemo: user.isDemo,
        };
      },
    }),
  ],

  session: { strategy: "jwt" },

  pages: { signIn: "/login" },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.locale = user.locale;
        token.isDemo = user.isDemo;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
        session.user.locale = token.locale as string | undefined;
        session.user.isDemo = token.isDemo as boolean | undefined;
      }

      return session;
    },

    async redirect({ url, baseUrl }) {
      // Logout sonrası doğru baseUrl'e yönlendir
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      try {
        if (new URL(url).origin === baseUrl) return url;
      } catch {
        // Malformed url — fall through to baseUrl.
      }
      return baseUrl;
    },
  },
});
