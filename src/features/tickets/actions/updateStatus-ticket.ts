"use server";

import { prisma } from "@/lib/prisma";
import { TicketStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function updateStatusTicket(ticketId: string, status: TicketStatus) {
  await prisma.ticket.update({
    where: { id: ticketId },
    data: { status },
  });

  revalidatePath("/dashboard/tickets");
}
