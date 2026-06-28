import { prisma } from "@/lib/prisma";

export async function getAppointments(
  companyId: string
) {
  return prisma.appointment.findMany({
    where: {
      companyId,
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