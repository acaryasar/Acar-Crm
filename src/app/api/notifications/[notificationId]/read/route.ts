import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

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
  const { notificationId } = await params;

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