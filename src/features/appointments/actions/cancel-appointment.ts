"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function cancelAppointment(
  appointmentId: string
) {
  await prisma.appointment.update({
    where: {
      id: appointmentId,
    },

    data: {
      status: "CANCELLED",
    },
  });

  revalidatePath("/dashboard/appointments");
}