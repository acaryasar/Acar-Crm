import { prisma } from "@/lib/prisma";

export async function getCustomer(
  customerId: string
) {
  return prisma.customer.findUnique({ where: { id: customerId },
    include: { company: true, },
  });
}