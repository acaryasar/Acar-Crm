"use server";

import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/entity/activity-log";
import { EntityType } from "@/lib/entity/entity-types";

interface Props {
  entityType: EntityType;
  entityId: string;
}
export async function softDelete({entityType, entityId,}: Props) 
{
  switch (entityType) {
    case "CUSTOMER":
      await prisma.customer.update({
        where: { id: entityId },
        data: {
          deletedAt: new Date(),
          is_active: false,
        },
      });
      break;

    case "USER":
      await prisma.user.update({
        where: { id: entityId },
        data: {
          deletedAt: new Date(),
          is_active: false,
        },
      });
      break;

    case "TICKET":
      await prisma.ticket.update({
        where: { id: entityId },
        data: {
          deletedAt: new Date(),
          is_active: false,
        },
      });
      break;

    case "APPOINTMENT":
      await prisma.appointment.update({
        where: { id: entityId },
        data: {
          deletedAt: new Date(),
          is_active: false,
        },
      });
      break;
  }

  await logActivity({action: "DELETE", entityType, entityId,});

  return { success: true, };
}