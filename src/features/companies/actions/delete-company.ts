"use server";

import { softDelete } from "@/features/shared/entity/soft-delete";

export async function deleteCompany(companyId: string)
{
  await softDelete({ entityType: "COMPANY", entityId: companyId });

  return { success: true, };
}