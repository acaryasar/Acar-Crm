import { z } from "zod";

export const appointmentSchema = z.object({
  customerId:   z.string(),
  assignedUserId:   z.string().optional(),  
  title: z.string().min(3),  
  description: z.string().optional(),
  
  startAt: z.coerce.date(),
  endAt: z.coerce.date(),
});

export type AppointmentInput =
  z.infer<typeof appointmentSchema>;
  
/**startAt: z.string(),
    endAt: z.string(), */