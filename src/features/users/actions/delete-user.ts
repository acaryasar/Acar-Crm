"use server";

import { softDelete } from "@/features/shared/entity/soft-delete";
import { requireRole } from "@/lib/auth-guard";

export async function deleteUser(userId: string)
{
  await requireRole(["ADMIN",]);

  await softDelete({ entityType: "USER", entityId: userId });

  return {success: true,};
}