import { prisma } from "@/lib/prisma";
import { processEmail } from "@/lib/mail/process-email";

export async function POST() {
  const emails =
    await prisma.emailInbox.findMany({
      where: {
        processed: false,
      },
    });

  for (const email of emails) {
    await processEmail(email.id);    
  }  

  return Response.json({
    success: true,
  });
}