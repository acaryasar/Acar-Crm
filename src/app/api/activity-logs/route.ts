import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";

  const whereClause: any = {};

  if ((session.user as any).role === "ADMIN") {
    // Admin sees all activity logs
  } else if ((session.user as any).role === "SUPERVISOR") {
    // Supervisor sees all activity logs

  } else {
    // Other roles don't have access
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Add search filter if provided
  if (search) {
    whereClause.OR = [
      { action: { contains: search, mode: "insensitive" } },
      { entityType: { contains: search, mode: "insensitive" } },
    ];
  }

  const logs = await prisma.activityLog.findMany({
    where: whereClause,
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },      
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return NextResponse.json(logs);
}
