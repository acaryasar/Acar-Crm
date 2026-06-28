"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-guard";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateCompany(companyId: string, formData: FormData) {
  await requireRole(["ADMIN"]);

  const name = formData.get("name") as string;

  if (!name) {
    throw new Error("Name is required");
  }

  await prisma.company.update({
    where: { id: companyId },
    data: {
      name,
    },
  });

  revalidatePath("/dashboard/companies");
  revalidatePath(`/dashboard/companies/${companyId}`);
  redirect("/dashboard/companies");
}
