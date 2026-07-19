import { prisma } from "@/lib/prisma";

export async function getUser(
  userId: string
) {
  return prisma.customer.findUnique({
    where: {
      id: userId,
    }
  });
}