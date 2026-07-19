import { prisma } from "@/lib/prisma";
import { fetchEmails } from "@/lib/mail/fetch-emails";
import { auth } from "@/auth";

export async function POST() {
  const emails = await fetchEmails();

  const session = await auth();

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  for (const email of emails) {
    if (
      !email.messageId
    ) {
      continue;
    }

    const exists =
      await prisma.emailInbox.findUnique({
        where: {
          messageId:
            email.messageId,
        },
      });

    if (exists) {
      continue;
    }

    await prisma.emailInbox.create({
      data: {
        messageId: email.messageId,
        fromEmail: email.from?.value?.[0]?.address ?? "",
        fromName:  email.from?.value?.[0]?.name ?? "",
        subject:   email.subject ?? "",
        body:      email.text ?? "",
      },
    });
  }

  return Response.json({
    success: true,
  });
}