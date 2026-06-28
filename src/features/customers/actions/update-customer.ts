"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface UpdateCustomerInput {
  customerId: string;
  firstName: string;
  lastName: string;
  email?: string | null;
  phone?: string | null;
  street?: string | null;
  city?: string | null;
  postalCode?: string | null;
  notes?: string | null;
}

export async function updateCustomer(data: UpdateCustomerInput) {
  await prisma.customer.update({
    where: { id: data.customerId },
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      street: data.street,
      city: data.city,
      postalCode: data.postalCode,
      notes: data.notes,
    },
  });

  revalidatePath("/dashboard/customers");
}
