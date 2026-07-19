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
    // Supervisor sees all users
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
  });

  await logActivity({ action: "USER_CREATED", entityType: "USER", entityId: user.id });

  return NextResponse.json(user);
}