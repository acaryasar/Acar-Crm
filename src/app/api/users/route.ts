import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { logActivity } from "@/lib/entity/activity-log";
import { auth } from "@/auth";


export async function GET() {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const whereClause: any = {};

  if (session.user.role === "ADMIN") {
    // Admin sees all users
  } else if (session.user.role === "SUPERVISOR" as any) {
    // Supervisor sees users from their company
    whereClause.companyId = session.user.companyId;
  } else {
    // Manager/Employee see only themselves
    whereClause.id = session.user.id;
  }

  const users = await prisma.user.findMany({
    where: whereClause,
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(users);
}

export async function POST(
  request: Request
) {
  const body = await request.json();

  const password = await bcrypt.hash(
    body.password,
    10
  );

  const user = await prisma.user.create({
    data: {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      password,
      role: body.role,
      companyId: body.companyId,
    },
  });

  await logActivity({ action: "USER_CREATED", entityType: "USER", entityId: user.id });


  return NextResponse.json(user);
}