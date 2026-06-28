"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const toStr = (val: FormDataEntryValue | null) => {
  const s = val ? String(val).trim() : "";
  return s === "" ? null : s;
};

export async function createCustomer(formData: FormData) {
  const session = await auth();

  if (!session?.user?.companyId) {
    throw new Error("Unauthorized");
  }

  const customer = await prisma.customer.create({
    data: {
      companyId: session.user.companyId,
      firstName: String(formData.get("firstName")),
      lastName:  String(formData.get("lastName")),
      email:      toStr(formData.get("email")),
      phone:      toStr(formData.get("phone")),
      street:     toStr(formData.get("street")),
      city:       toStr(formData.get("city")),
      postalCode: toStr(formData.get("postalCode")),
      notes:      toStr(formData.get("notes")),
    },
  });

  await prisma.activityLog.create({
    data: {
      companyId: (session.user as any).companyId,
      action: "CUSTOMER_CREATED",
      entityType: "CUSTOMER",
      entityId: customer.id,
      metadata: {
        customerName: `${customer.firstName} ${customer.lastName}`,
      },
    },
  });

  revalidatePath("/dashboard/customers");
  redirect(`/dashboard/customers?mode=view&id=${customer.id}`);
}

export async function updateCustomer(formData: FormData) {
  const session = await auth();

  if (!session?.user?.companyId) {
    throw new Error("Unauthorized");
  }

  const id = String(formData.get("id"));

  await prisma.customer.update({
    where: { id },
    data: {
      firstName: String(formData.get("firstName")),
      lastName:  String(formData.get("lastName")),
      email:      toStr(formData.get("email")),
      phone:      toStr(formData.get("phone")),
      street:     toStr(formData.get("street")),
      city:       toStr(formData.get("city")),
      postalCode: toStr(formData.get("postalCode")),
      notes:      toStr(formData.get("notes")),
    },
  });

  revalidatePath("/dashboard/customers");
  redirect(`/dashboard/customers?mode=view&id=${id}`);
}
