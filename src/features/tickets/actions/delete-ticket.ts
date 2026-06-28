"use server";

import { softDelete } from "@/features/shared/entity/soft-delete";

export async function deleteTicket(ticketId: string)
{
  await softDelete({ entityType: "TICKET", entityId: ticketId });

  return {success: true,};
}