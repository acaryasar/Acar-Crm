import { prisma } from "@/lib/prisma";

export async function createNotification({
  userId,
  title,
  message,
  type = "INFO",
  entityType,
  entityId,
}: {
  userId?: string;

  title: string;
  message?: string;

  type?:
    | "INFO"
    | "SUCCESS"
    | "WARNING"
    | "ERROR";

  entityType?: string;
  entityId?: string;
}) {
  return prisma.notification.create({
    data: {
      userId,
      title,
      message,
      type,
      entityType,
      entityId,
    },
  });
}