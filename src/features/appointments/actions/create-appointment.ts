"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface CreateAppointmentInput {
  customerId: string;
  employeeId?: string;

  title: string;
  description?: string;

  startAt: Date;
  endAt: Date;
}

export async function createAppointment(
  data: CreateAppointmentInput
) {
  await prisma.appointment.create({
    data,
  });

  revalidatePath("/appointments");
}