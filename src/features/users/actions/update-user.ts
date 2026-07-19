"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function updateUser(userId: string, formData: FormData) {
  const session = await auth();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const role = formData.get("role") as UserRole;

  await prisma.user.update({
    where: { id: userId },
    data: {
      firstName: String(formData.get("firstName")),
      lastName: String(formData.get("lastName")),
      role,
    },
  });

  revalidatePath("/users");
}
