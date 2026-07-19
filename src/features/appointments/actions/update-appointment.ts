"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface UpdateAppointmentInput {
  appointmentId: string;

  title: string;
  description?: string;

  startAt: Date;
  endAt: Date;
}

export async function updateAppointment(
  data: UpdateAppointmentInput
) {
  await prisma.appointment.update({
    where: {
      id: data.appointmentId,
    },

    data: {
      title: data.title,
      description: data.description,
      startAt: data.startAt,
      endAt: data.endAt,
    },
  });

  revalidatePath("/appointments");
}