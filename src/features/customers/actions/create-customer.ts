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

  if (!session) {
    throw new Error("Unauthorized");
  }

  try {
    const customer = await prisma.customer.create({
      data: {
        firstName: String(formData.get("firstName")),
        lastName:  String(formData.get("lastName")),
        email:      toStr(formData.get("email")),
        phone:      toStr(formData.get("phone")),
        street:     toStr(formData.get("street")),
        city:       toStr(formData.get("city")),
        postalCode: toStr(formData.get("postalCode")),
        notes:      toStr(formData.get("notes")),
        taxOffice:  toStr(formData.get("taxOffice")),
        taxNumber:  toStr(formData.get("taxNumber")),
        responsiblePerson: toStr(formData.get("responsiblePerson")),
        customerGroup: toStr(formData.get("customerGroup")),
        sector:     toStr(formData.get("sector")),
      },
    } as any);

    await prisma.activityLog.create({
      data: {
        action: "CUSTOMER_CREATED",
        entityType: "CUSTOMER",
        entityId: customer.id,
        metadata: {
          customerName: `${customer.firstName} ${customer.lastName}`,
        },
      },
    });

    revalidatePath("/customers");
    redirect(`/customers?mode=view&id=${customer.id}`);
  } catch (error) {
    console.error("Error creating customer:", error);
    throw new Error("Failed to create customer. Please try again.");
  }
}

export async function updateCustomer(formData: FormData) {
  const session = await auth();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const id = String(formData.get("id"));

  if (!id) {
    throw new Error("Customer ID is required");
  }

  try {
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
        taxOffice:  toStr(formData.get("taxOffice")),
        taxNumber:  toStr(formData.get("taxNumber")),
        responsiblePerson: toStr(formData.get("responsiblePerson")),
        customerGroup: toStr(formData.get("customerGroup")),
        sector:     toStr(formData.get("sector")),
      },
    } as any);

    revalidatePath("/customers");
  } catch (error) {
    console.error("Error updating customer:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to update customer: ${error.message}`);
    }
    throw new Error("Failed to update customer. Please try again.");
  }

  redirect(`/customers?mode=view&id=${id}`);
}
