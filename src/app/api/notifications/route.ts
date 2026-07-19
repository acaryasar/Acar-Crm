import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { success, failure } from "@/lib/api-utils";

export async function GET() {
  const session = await auth();

  if (!session) {
    return failure("Unauthorized", 401);
  }

  const whereClause: any = {};

  if (session.user.role === "ADMIN") {
    // Admin sees all notifications
  } else if (session.user.role === "SUPERVISOR" as any) {
    // Supervisor sees all notifications
  } else {
    // Manager/Employee see only their own notifications
    whereClause.userId = session.user.id;
  }

  const notifications = await prisma.notification.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return success(notifications);
}
