"use server";

import { prisma } from "@/lib/prisma";
import { softDelete } from "@/features/shared/entity/soft-delete";
import { requireRole } from "@/lib/auth-guard";

export async function deleteCustomer(customerId: string) 
{
  await requireRole(["ADMIN", "SUPERVISOR",]);

  await softDelete({ entityType: "CUSTOMER", entityId: customerId, });

  return { success: true, };
}