import { prisma } from "@/lib/prisma";

export async function getTicket(
  id: string
) {
  return prisma.ticket.findUnique({
    where: {
      id,
    },

    include: {
      customer: true,
      company: true,
      assignedUser: true,
      appointments: {
        where: {
          status: "PLANNED",
        },
        orderBy: {
          startAt: "asc",
        },
      },
    },
  });
}