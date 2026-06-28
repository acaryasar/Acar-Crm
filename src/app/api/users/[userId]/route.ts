import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { logActivity } from "@/lib/entity/activity-log";
import { auth } from "@/auth";
import bcrypt from "bcrypt";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId } = await params;
  const body = await req.json();

  const updateData: any = {
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    role: body.role,
  };

  if (body.password) {
    updateData.password = await bcrypt.hash(body.password, 10);
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: updateData,
  });

  await logActivity({ 
    action: "USER_UPDATED", 
    entityType: "USER", 
    entityId: userId,
    metadata: { changes: body }
  });

  return NextResponse.json(user);
}

export async function DELETE(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ userId: string }>;
  }
) {
  const { userId } = await params;

  await prisma.user.update({
    where: { id: userId },
    data: {
      deletedAt: new Date(),
      is_active: false,
    },
  });

  await logActivity({ action: "USER_DELETED", entityType: "USER", entityId: userId });

  return NextResponse.json({
    success: true,
  });
}