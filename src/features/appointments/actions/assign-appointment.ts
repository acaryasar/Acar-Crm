"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function assignEmployee(
  appointmentId: string,
  employeeId: string
) {
  await prisma.appointment.update({
    where: {
      id: appointmentId,
    },

    data: { employeeId,
    },
  });

  revalidatePath("/appointments");
}