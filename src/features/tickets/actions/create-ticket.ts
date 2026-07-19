import { prisma } from "@/lib/prisma";
import {
  TicketCategory,
  TicketPriority,
  TicketSource,
  TicketStatus,
} from "@prisma/client";

export async function createTicket(data: {
  customerId: string;
  title: string;
  description?: string;
  category?: TicketCategory;
  priority?: TicketPriority;
  status?: TicketStatus;
  source?: TicketSource;
}) {
  return prisma.ticket.create({
    data: {
      customerId:  data.customerId,
      title:       data.title,
      description: data.description,
      category:    data.category ?? TicketCategory.OTHER,
      priority:    data.priority ?? TicketPriority.MEDIUM,
      status:      data.status ??   TicketStatus.NEW,
      source:      data.source ??   TicketSource.WEB_CHAT,
    },
  });  
}