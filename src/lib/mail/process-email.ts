import { prisma } from "@/lib/prisma";

import { matchCustomer } from "@/features/customers/actions/match-customer";
import { analyzeEmail } from "@/features/ai/actions/analyze-email";
import { createNotification } from "@/lib/notification";
import { logActivity } from "@/lib/entity/activity-log";
import { AIOrchestrator } from "@/features/ai/core/ai-orchestrator";
import { IncomingMessage } from "@/features/ai/channels/types";

export async function processEmail(
  emailId: string
) {
  const email =
    await prisma.emailInbox.findUnique({
      where: {
        id: emailId,
      },
    });

  if (!email) {
    throw new Error("Email not found");
  }

  const ai = await analyzeEmail(
    email.subject,
    email.body
  );

  let customer =
    await matchCustomer(email.fromEmail);

  // CUSTOMER BULUNAMADI

  if (!customer) {
    customer =
      await prisma.customer.create({
        data: {
          companyId: email.companyId,
          email: email.fromEmail,
          firstName: email.fromName ?? "Unknown",
          lastName: "",
        },
      });
  }

  // TICKET OLUŞTUR

  const ticket =
    await prisma.ticket.create({
      data: {
        companyId: email.companyId,
        customerId: customer.id,
        title: ai.title,
        description: email.body,
        category: ai.category,
        priority: ai.priority,
        status: "NEW",
        source: "EMAIL",
      },
    });

    await createNotification({ companyId: email.companyId, title: "Email Converted To Ticket", message: ticket.title,
                               type: "SUCCESS",  entityType: "EMAIL", entityId: email.id,});
    await logActivity({action: "EMAIL_CONVERTED_TO_TICKET", entityType: "TICKET", entityId: ticket.id,});

  // AI Orchestrator ile email'i işle
  try {
    const incomingMessage: IncomingMessage = {
      id: email.messageId,
      channelType: 'EMAIL' as any,
      from: email.fromEmail,
      content: email.body,
      timestamp: email.createdAt,
      metadata: {
        emailMessageId: email.messageId,
        subject: email.subject,
        fromName: email.fromName
      }
    };

    const orchestrator = new AIOrchestrator();
    await orchestrator.processMessage(incomingMessage, email.companyId);
  } catch (error) {
    console.error('Error processing email with AI orchestrator:', error);
    // Hata olsa bile ticket oluşturuldu, devam et
  }

  await prisma.emailInbox.update({
    where: {
      id: email.id,
    },

    data: {
      processed: true,
      ticketId: ticket.id,
    },
  });

  return ticket;
}