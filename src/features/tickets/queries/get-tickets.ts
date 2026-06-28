import { prisma } from "@/lib/prisma";

export async function getTickets() {
  return prisma.ticket.findMany({
    include: {
      customer: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });
}