import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { logActivity } from "@/lib/entity/activity-log";

export async function GET() {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const whereClause: any = {};

  if (session.user.role === "ADMIN") {
    // Admin sees all companies
  } else {
    // Other roles see only their company
    whereClause.id = session.user.companyId;
  }

  const companies = await prisma.company.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(companies);
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const company = await prisma.company.create({
    data: {
      name: body.name,
      aiConfig: body.aiConfig,
    },
  });

  await logActivity({ 
    action: "COMPANY_CREATED", 
    entityType: "COMPANY", 
    entityId: company.id,
    metadata: { name: body.name }
  });

  return NextResponse.json(company);
}
