import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      notificationId: string;
    }>;
  }
) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { notificationId } = await params;

  const notification = await prisma.notification.findUnique({
    where: { id: notificationId },
    select: { id: true, userId: true },
  });

  if (!notification) {
    return NextResponse.json({ error: "Notification not found" }, { status: 404 });
  }

  const isPrivileged = session.user.role === "ADMIN" || session.user.role === "SUPERVISOR";

  // A notification with no userId is a broadcast notification; otherwise it
  // may only be marked read by its owner (or an admin/supervisor).
  if (notification.userId && notification.userId !== session.user.id && !isPrivileged) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.notification.update({
    where: { id: notificationId },
    data: {
      isRead: true,
    },
  });

  return NextResponse.json({
    success: true,
  });
}
