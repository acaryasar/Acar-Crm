import { prisma } from "@/lib/prisma";

export async function getAppointment(
  appointmentId: string
) {
  return prisma.appointment.findUnique({
    where: {
      id: appointmentId,
    },

    include: {
      customer: true,
      employee: true,
    },
  });
}