import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rules = await prisma.commissionRule.findMany({
      where: {
        deletedAt: null,
        isActive: true,
      },
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        commissionType: true,
        commissionRate: true,
        calculationPeriod: true,
      },
    });

    return NextResponse.json({ data: rules });
  } catch (error) {
    console.error("Error fetching commission rules:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
