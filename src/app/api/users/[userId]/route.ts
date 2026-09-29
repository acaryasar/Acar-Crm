import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { logActivity } from "@/lib/entity/activity-log";
import { auth } from "@/auth";
import bcrypt from "bcryptjs";
import { safeUserSelect } from "@/lib/user-select";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId } = await params;
  const isSelf = session.user.id === userId;
  const isAdmin = session.user.role === "ADMIN";

  // Only admins may edit someone else's account. See
  // docs/guvenlik-inceleme-raporu-2026-09-10.md #1.2 for why this matters:
  // without it, any signed-in user could take over any other account.
  if (!isSelf && !isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();

  const updateData: any = {
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
  };

  // Role changes (privilege escalation) are admin-only, even for a user
  // editing their own account.
  if (body.role !== undefined) {
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Only an administrator can change a user's role" },
        { status: 403 }
      );
    }
    updateData.role = body.role;
  }

  if (body.password) {
    updateData.password = await bcrypt.hash(body.password, 10);
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: safeUserSelect,
  });

  await logActivity({
    action: "USER_UPDATED",
    entityType: "USER",
    entityId: userId,
    metadata: { changes: { ...body, password: body.password ? "[redacted]" : undefined } },
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
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

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
