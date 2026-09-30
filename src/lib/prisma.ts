import { PrismaClient } from "@prisma/client";

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
const databaseUrl = process.env.TURSO_DATABASE_URL || LOCAL_DB_URL;
const isLocalFile = databaseUrl.startsWith("file:");

// @prisma/adapter-libsql ships two builds: the default one (used below only
// for the local "file:" fallback) pulls in @libsql/client's Node build,
// which in turn imports the native `libsql` addon for local sqlite file
// access. That's fine in plain Node (`next dev`/`next start`), but Cloudflare
// confirmed this is required to be avoided for the Workers build — the
// Workers-specific "/web" build must be used there instead (see
// https://developers.cloudflare.com/workers/databases/third-party-integrations/turso/).
// We pick the build with a dynamic import (never both statically) so the
// Node-only build's native-addon import is only ever evaluated when we're
// actually about to use it — never inside the Cloudflare bundle, where
// databaseUrl is always the Turso https/libsql URL, never "file:".
const { PrismaLibSQL } = isLocalFile
  ? await import("@prisma/adapter-libsql")
  : await import("@prisma/adapter-libsql/web");

const adapter = isLocalFile
  ? new PrismaLibSQL({ url: databaseUrl })
  : new PrismaLibSQL({ url: databaseUrl, authToken: process.env.TURSO_AUTH_TOKEN });

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
