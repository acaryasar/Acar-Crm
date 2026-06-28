import { z } from "zod";

export const ExtractedTicketSchema =
  z.object({
    title: z.string(),
    description: z.string(),
    priority: z.enum([
      "LOW",
      "MEDIUM",
      "HIGH",
      "URGENT",
    ]),
    appointment: z.string().optional(),
  });

export type ExtractedTicket =
  z.infer<
    typeof ExtractedTicketSchema
  >;