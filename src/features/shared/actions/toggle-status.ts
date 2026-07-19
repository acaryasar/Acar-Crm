"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { logActivity } from "@/lib/entity/activity-log";
import { EntityType } from "@/lib/entity/entity-types";

interface Props {
  entityType: EntityType;
  entityId: string;
  revalidatePath?: string;
}

export async function toggleEntityStatus({
  entityType,
  entityId,
  revalidatePath: pathToRevalidate,
}: Props) {
  const session = await auth();

  if (!session) {
    throw new Error("Unauthorized");
  }

  let entity: any;
  let newStatus: boolean;

  switch (entityType) {
    case "CUSTOMER":
      entity = await prisma.customer.findUnique({
        where: { id: entityId },
      });
      if (!entity) throw new Error("Customer not found");
      newStatus = !entity.is_active;
      await prisma.customer.update({
        where: { id: entityId },
        data: { is_active: newStatus },
      });
      break;

    case "USER":
      entity = await prisma.user.findUnique({
        where: { id: entityId },
      });
      if (!entity) throw new Error("User not found");
      newStatus = !entity.is_active;
      await prisma.user.update({
        where: { id: entityId },
        data: { is_active: newStatus },
      });
      break;

    case "TICKET":
      entity = await prisma.ticket.findUnique({
        where: { id: entityId },
      });
      if (!entity) throw new Error("Ticket not found");
      newStatus = !entity.is_active;
      await prisma.ticket.update({
        where: { id: entityId },
        data: { is_active: newStatus },
      });
      break;

    case "APPOINTMENT":
      entity = await prisma.appointment.findUnique({
        where: { id: entityId },
      });
      if (!entity) throw new Error("Appointment not found");
      newStatus = !entity.is_active;
      await prisma.appointment.update({
        where: { id: entityId },
        data: { is_active: newStatus },
      });
      break;

    default:
      throw new Error(`Unsupported entity type: ${entityType}`);
  }

  await logActivity({
    action: newStatus ? "ACTIVATE" : "DEACTIVATE",
    entityType,
    entityId,
    metadata: { previousStatus: entity.is_active, newStatus },
  });

  if (pathToRevalidate) {
    revalidatePath(pathToRevalidate);
  }

  return { success: true };
}
