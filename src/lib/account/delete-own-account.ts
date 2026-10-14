import bcrypt from "bcryptjs";
import { randomBytes } from "node:crypto";
import type { PrismaClient } from "@prisma/client";

export type DeleteOwnAccountResult =
  | { ok: true }
  | { ok: false; status: 400 | 403 | 404 | 409; error: string };

/**
 * Self-service account deletion for CRM users.
 *
 * The user row is anonymised, not removed: tickets, appointments and audit logs point at it and
 * belong to the company's records. Every field that identifies the person is wiped and the account
 * is disabled, so the kept records no longer identify them. The client is passed in so the logic
 * can be tested against a real database without the app's global Prisma instance.
 */
export async function deleteOwnAccount(
  db: PrismaClient,
  userId: string,
  password: string,
): Promise<DeleteOwnAccountResult> {
  const user = await db.user.findFirst({ where: { id: userId, deletedAt: null } });
  if (!user) return { ok: false, status: 404, error: "Hesap bulunamadı." };

  if (user.isDemo) return { ok: false, status: 403, error: "Demo hesaplar silinemez." };

  if (!(await bcrypt.compare(password, user.password))) {
    return { ok: false, status: 400, error: "Şifre hatalı." };
  }

  if (user.role === "ADMIN") {
    const otherAdmins = await db.user.count({
      where: { role: "ADMIN", deletedAt: null, isDemo: false, id: { not: userId } },
    });
    if (otherAdmins === 0) {
      return {
        ok: false,
        status: 409,
        error: "Son yönetici hesabı silinemez. Önce başka bir kullanıcıyı yönetici yapın.",
      };
    }
  }

  const unusablePassword = await bcrypt.hash(randomBytes(32).toString("hex"), 10);

  await db.$transaction([
    db.notification.deleteMany({ where: { userId } }),
    db.user.update({
      where: { id: userId },
      data: {
        email: `silinmis-${userId}@deleted.invalid`,
        password: unusablePassword,
        firstName: "Silinmiş",
        lastName: "Kullanıcı",
        phone: null,
        nationalId: null,
        dateOfBirth: null,
        gender: null,
        profilePicture: null,
        username: null,
        department: null,
        position: null,
        workplace: null,
        manager: null,
        description: null,
        accountStatus: false,
        is_active: false,
        deletedAt: new Date(),
      },
    }),
  ]);

  return { ok: true };
}
