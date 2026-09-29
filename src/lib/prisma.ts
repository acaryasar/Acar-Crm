import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

// One driver (libSQL) for both environments:
//  - locally, with no TURSO_* env vars set, it just opens the sqlite file
//    on disk exactly like Prisma's built-in connector did before.
//  - in production, set TURSO_DATABASE_URL + TURSO_AUTH_TOKEN (see
//    docs/deploy-cloudflare-turso.md) and it talks to Turso over the network
//    instead — no code change needed, only environment variables.
//
// NOTE: this path is relative to the process's cwd (the project root when
// running `next dev`/`next start`), NOT to this file or to schema.prisma —
// that's why it says "./prisma/dev.db" and not "./dev.db".
const LOCAL_DB_URL = "file:./prisma/dev.db";

const adapter = new PrismaLibSQL({
  url: process.env.TURSO_DATABASE_URL || LOCAL_DB_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
