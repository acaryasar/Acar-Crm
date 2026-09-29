import { prisma } from "@/lib/prisma";
import { processEmail } from "@/lib/mail/process-email";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function POST() {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "SUPERVISOR") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const emails =
    await prisma.emailInbox.findMany({
      where: {
        processed: false,
      },
    });

  for (const email of emails) {
    await processEmail(email.id);
  }

  return NextResponse.json({
    success: true,
  });
}
