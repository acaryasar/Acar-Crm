import { prisma } from "@/lib/prisma";

export async function getCustomers() {
  return prisma.customer.findMany({
    where: {deletedAt: null},
    orderBy: { createdAt: "desc",
    },
  });
}