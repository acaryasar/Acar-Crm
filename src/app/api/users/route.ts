import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { logActivity } from "@/lib/entity/activity-log";
import { auth } from "@/auth";
import { safeUserSelect } from "@/lib/user-select";

export async function GET() {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const whereClause: any = {};

  if (session.user.role === "ADMIN") {
    // Admin sees all users
  } else if (session.user.role === "SUPERVISOR" as any) {
    // Supervisor sees all users
  } else {
    // Manager/Employee see only themselves
    whereClause.id = session.user.id;
  }

  const users = await prisma.user.findMany({
    where: whereClause,
    select: safeUserSelect,
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(users);
}

export async function POST(
  request: Request
) {
  // Creating a user or reassigning a role/password is an admin-only action:
  // without this check anyone (even signed-out) could create or take over
  // an ADMIN account. See docs/guvenlik-inceleme-raporu-2026-09-10.md #1.1.
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();

  // Handle update action
  if (body.action === "update" && body.id) {
    const updateData: any = {
      firstName: body.firstName,
      lastName: body.lastName,
      role: body.primaryRole || body.role,
    };

    // Only update password if provided
    if (body.password) {
      updateData.password = await bcrypt.hash(body.password, 10);
    }

    // Update optional fields if provided
    if (body.phone !== undefined) updateData.phone = body.phone;
    if (body.nationalId !== undefined) updateData.nationalId = body.nationalId;
    if (body.dateOfBirth) updateData.dateOfBirth = new Date(body.dateOfBirth);
    if (body.gender !== undefined) updateData.gender = body.gender;
    if (body.profilePicture !== undefined) updateData.profilePicture = body.profilePicture;
    if (body.username !== undefined) updateData.username = body.username;
    if (body.changePasswordOnFirstLogin !== undefined) updateData.changePasswordOnFirstLogin = body.changePasswordOnFirstLogin;
    if (body.accountStatus !== undefined) updateData.accountStatus = body.accountStatus;
    if (body.accountEndDate) updateData.accountEndDate = new Date(body.accountEndDate);
    if (body.department !== undefined) updateData.department = body.department;
    if (body.position !== undefined) updateData.position = body.position;
    if (body.workplace !== undefined) updateData.workplace = body.workplace;
    if (body.manager !== undefined) updateData.manager = body.manager;
    if (body.startDate) updateData.startDate = new Date(body.startDate);
    if (body.description !== undefined) updateData.description = body.description;

    const user = await prisma.user.update({
      where: { id: body.id },
      data: updateData,
      select: safeUserSelect,
    });

    await logActivity({ action: "USER_UPDATED", entityType: "USER", entityId: user.id });

    return NextResponse.json(user);
  }

  // Handle create action
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
      role: body.primaryRole || body.role || "EMPLOYEE",
      // Optional fields
      phone: body.phone,
      nationalId: body.nationalId,
      dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : null,
      gender: body.gender,
      profilePicture: body.profilePicture,
      username: body.username,
      changePasswordOnFirstLogin: body.changePasswordOnFirstLogin || false,
      accountStatus: body.accountStatus !== undefined ? body.accountStatus : true,
      accountEndDate: body.accountEndDate ? new Date(body.accountEndDate) : null,
      department: body.department,
      position: body.position,
      workplace: body.workplace,
      manager: body.manager,
      startDate: body.startDate ? new Date(body.startDate) : null,
      description: body.description,
    },
    select: safeUserSelect,
  });

  await logActivity({ action: "USER_CREATED", entityType: "USER", entityId: user.id });

  return NextResponse.json(user);
}
