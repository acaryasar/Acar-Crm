import { prisma } from "@/lib/prisma";

export async function createNotification({
  companyId,
  userId,
  title,
  message,
  type = "INFO",
  entityType,
  entityId,
}: {
  companyId: string;

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
      companyId,
      userId,
      title,
      message,
      type,
      entityType,
      entityId,
    },
  });
}