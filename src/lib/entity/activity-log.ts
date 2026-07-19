import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function logActivity({
  action,
  entityType,
  entityId,
  metadata,
}: {
  action: string;
  entityType: string;
  entityId?: string;
  metadata?: any;
}) {
  const session = await auth();

  if (!session) {
    return;
  }

  // Check if user exists before creating activity log
  const user = await prisma.user.findUnique({
    where: { id: session.user.id as string },
  });

  if (!user) {
    return;
  }

  return prisma.activityLog.create({
    data: {
      userId: session.user.id as string,
      action,
      entityType,
      entityId,
      metadata: metadata as any,
    },
  });
}
