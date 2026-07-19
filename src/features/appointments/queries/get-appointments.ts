import { prisma } from "@/lib/prisma";

export async function getAppointments(
) {
  return prisma.appointment.findMany({
    where: {
      status: {
        not: "CANCELLED",
      },
    },

    include: {
      customer: true,
      employee: true,
    },

    orderBy: {
      startAt: "asc",
    },
  });
}