"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-guard";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createCompany(formData: FormData) {
  await requireRole(["ADMIN"]);

  const name = formData.get("name") as string;

  if (!name) {
    throw new Error("Name is required");
  }

  const company = await prisma.company.create({
    data: {
      name,
      taxId: formData.get("taxId") as string | null,
      taxOffice: formData.get("taxOffice") as string | null,
      email: formData.get("email") as string | null,
      phone: formData.get("phone") as string | null,
      website: formData.get("website") as string | null,
      street: formData.get("street") as string | null,
      city: formData.get("city") as string | null,
      postalCode: formData.get("postalCode") as string | null,
      country: formData.get("country") as string | null,
      bankName: formData.get("bankName") as string | null,
      iban: formData.get("iban") as string | null,
    },
  });

  revalidatePath("/dashboard/companies");
  redirect(`/dashboard/companies?mode=view&id=${company.id}`);
}

export async function updateCompany(formData: FormData) {
  await requireRole(["ADMIN"]);

  const id = formData.get("id") as string;
  const name = formData.get("name") as string;

  if (!name) {
    throw new Error("Name is required");
  }

  await prisma.company.update({
    where: { id },
    data: {
      name,
      taxId: formData.get("taxId") as string | null,
      taxOffice: formData.get("taxOffice") as string | null,
      email: formData.get("email") as string | null,
      phone: formData.get("phone") as string | null,
      website: formData.get("website") as string | null,
      street: formData.get("street") as string | null,
      city: formData.get("city") as string | null,
      postalCode: formData.get("postalCode") as string | null,
      country: formData.get("country") as string | null,
      bankName: formData.get("bankName") as string | null,
      iban: formData.get("iban") as string | null,
    },
  });

  revalidatePath("/dashboard/companies");
  redirect(`/dashboard/companies?mode=view&id=${id}`);
}
