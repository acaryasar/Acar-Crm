import { z } from "zod";

export const CreateTicketSchema =
  z.object({
    customerId:     z.string(),
    title:          z.string().min(3),
    description:    z.string().optional(),
    category:       z.string(),
    priority:       z.string(),
    assignedUserId: z.string().optional(),
  });