import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = session.user.role;
    const userCompanyId = session.user.companyId;

    let users;

    if (userRole === "ADMIN") {
      // Admin can see all users
      users = await prisma.user.findMany({
        where: {
          deletedAt: null,
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
          companyId: true,
          company: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          firstName: "asc",
        },
      });
    } else {
      // Supervisor can only see users in their company
      users = await prisma.user.findMany({
        where: {
          deletedAt: null,
          companyId: userCompanyId,
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
          companyId: true,
          company: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          firstName: "asc",
        },
      });
    }

    return NextResponse.json({ data: users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
