import { prisma } from "@/lib/prisma";

export async function matchCustomer(
  email: string
) {
  return prisma.customer.findFirst({
    where: {
      email,
    },
  });
}