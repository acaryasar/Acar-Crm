"use server";

import { softDelete } from "@/features/shared/entity/soft-delete";

export async function deleteAppointment(appointmentId: string)
{
  await softDelete({ entityType: "APPOINTMENT", entityId: appointmentId });

  return { success: true, };
}