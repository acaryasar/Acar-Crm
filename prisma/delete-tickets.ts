import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";

// Same libSQL adapter as src/lib/prisma.ts (this script runs standalone,
// so it cannot import that module) — see it for details.
const adapter = new PrismaLibSQL({
  url: process.env.TURSO_DATABASE_URL || "file:./prisma/dev.db", // relative to project root (where `tsx prisma/delete-tickets.ts` runs from)
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Deleting all tickets...");
  
  await prisma.ticket.deleteMany({});
  
  console.log("All tickets deleted successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
