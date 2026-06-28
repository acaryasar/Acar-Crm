"use server";

import { prisma } from "@/lib/prisma";

import { EntityType } from "@/lib/entity/entity-types";

export async function toggleEntityStatus(
  entityType: EntityType,
  entityId: string
) {
  switch (entityType) {

    case "CUSTOMER": {

      const customer =
        await prisma.customer.findUnique({
          where: {
            id: entityId,
          },
          select: {
            is_active: true,
          },
        });

      return prisma.customer.update({
        where: {
          id: entityId,
        },
        data: {
          is_active:
            !customer?.is_active,
        },
      });
    }

    case "USER": {

      const user =
        await prisma.user.findUnique({
          where: {
            id: entityId,
          },
          select: {
            is_active: true,
          },
        });

      return prisma.user.update({
        where: {
          id: entityId,
        },
        data: {
          is_active:
            !user?.is_active,
        },
      });
    }
  }
}