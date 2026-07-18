"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function deleteCommissionRule(id: string) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await prisma.commissionRule.update({
    where: { id },
    data: {
      deletedAt: new Date(),
      isDeleted: true,
      deletedBy: session.user.id,
    },
  });

  revalidatePath("/dashboard/commission-rules");
}
