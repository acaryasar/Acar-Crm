"use server";

import { prisma } from "@/lib/prisma";
import {
  TicketCategory,
  TicketPriority,
  TicketSource,
  TicketStatus,
} from "@prisma/client";
import { revalidatePath } from "next/cache";

interface UpdateTicketInput {
  ticketId: string;
  title: string;
  description?: string;
  category?: TicketCategory;
  priority?: TicketPriority;
  status?: TicketStatus;
  source?: TicketSource;
}

export async function updateTicket(data: UpdateTicketInput) {
  await prisma.ticket.update({
    where: { id: data.ticketId },
    data: {
      title: data.title,
      description: data.description,
      status: data.status,
      category: data.category,
      priority: data.priority,
      source: data.source,
    },
  });

  revalidatePath("/tickets");
}
