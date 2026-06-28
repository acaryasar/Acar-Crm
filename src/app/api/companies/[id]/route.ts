import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { logActivity } from "@/lib/entity/activity-log";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  const company = await prisma.company.update({
    where: { id },
    data: {
      name: body.name,
      aiConfig: body.aiConfig,
      is_active: body.is_active,
    },
  });

  await logActivity({ 
    action: "COMPANY_UPDATED", 
    entityType: "COMPANY", 
    entityId: id,
    metadata: { changes: body }
  });

  return NextResponse.json(company);
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  await prisma.company.update({
    where: { id },
    data: {
      deletedAt: new Date(),
      is_active: false,
    },
  });

  await logActivity({ action: "COMPANY_DELETED", entityType: "COMPANY", entityId: id });

  return NextResponse.json({ success: true });
}
