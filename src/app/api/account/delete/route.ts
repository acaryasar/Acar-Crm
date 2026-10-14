import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { createDeleteAccountHandler } from "@/lib/account/delete-account-handler";
import { deleteOwnAccount } from "@/lib/account/delete-own-account";

// POST /api/account/delete — a signed-in user deletes (anonymises) their own account after
// re-entering their password. Demo accounts are already blocked by middleware.ts.
export const POST = createDeleteAccountHandler({
  getUserId: async () => (await auth())?.user?.id ?? null,
  allow: (userId, request) =>
    checkRateLimit(`account-delete:${userId}:${getClientIp(request)}`, 5, 15 * 60 * 1000).allowed,
  remove: (userId, password) => deleteOwnAccount(prisma, userId, password),
});
