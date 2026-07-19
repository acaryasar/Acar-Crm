import { prisma } from "@/lib/prisma";

interface CustomerNotificationData {
  customerId: string;
  ticketTitle: string;
  assignedUserName: string;
  appointmentDate: Date;
  ticketId: string;
}

/**
 * Send notification to customer about ticket assignment
 * This function sends notifications through available channels (email, WhatsApp, etc.)
 */
export async function sendCustomerAssignmentNotification(
  data: CustomerNotificationData
) {
  const { customerId, ticketTitle, assignedUserName, appointmentDate, ticketId } = data;

  // Get customer details
  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
  });

  if (!customer) {
    console.error("Customer not found for notification");
    return;
  }

  // Get ticket details to determine the source channel
  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
  });

  if (!ticket) {
    console.error("Ticket not found for notification");
    return;
  }

  // Prepare notification message
  const message = `
    Sayın ${customer.firstName} ${customer.lastName},
    
    Talebiniz "${ticketTitle}" için atama yapılmıştır.
    
    Atanan Personel: ${assignedUserName}
    Randevu Tarihi: ${appointmentDate.toLocaleString('tr-TR')}
    
    Talep ID: ${ticketId.slice(0, 8)}
    
    Herhangi bir sorunuz için bize ulaşabilirsiniz.
  `.trim();

  // Send notification based on available channels and ticket source
  try {
    // If ticket came from WhatsApp, try to send WhatsApp message
    if (ticket.source === "WHATSAPP" && customer.phone) {
      await sendWhatsAppNotification(customer.phone, message);
    }
    
    // If customer has email, send email notification
    if (customer.email) {
      await sendEmailNotification(customer.email, ticketTitle, message);
    }

    // If ticket came from phone, you could add SMS notification here
    if (ticket.source === "PHONE" && customer.phone) {
      // await sendSMSNotification(customer.phone, message);
      console.log("SMS notification would be sent here");
    }

    // Log the notification
    await logCustomerNotification(customerId, ticketId, message);
  } catch (error) {
    console.error("Error sending customer notification:", error);
  }
}

async function sendWhatsAppNotification(
  phoneNumber: string,
  message: string
) {
  try {
    // Import WhatsApp service dynamically to avoid circular dependencies
    const { WhatsAppService } = await import("@/features/ai/channels/whatsapp/whatsapp.service");
    const { WhatsAppAdapter } = await import("@/features/ai/channels/whatsapp/whatsapp.adapter");
    
    const adapter = new WhatsAppAdapter({
      phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || "",
      accessToken: process.env.WHATSAPP_ACCESS_TOKEN || "",
      apiVersion: "v18.0",
      enabled: true,
      autoResponse: false,
      responseDelay: 0,
    });
    
    const whatsappService = new WhatsAppService(adapter);
    
    await whatsappService.processOutgoingMessage(
      {
        to: phoneNumber,
        content: message,
      }
    );
    
    console.log("WhatsApp notification sent successfully");
  } catch (error) {
    console.error("Error sending WhatsApp notification:", error);
    // Don't throw error, allow other notification channels to work
  }
}

async function sendEmailNotification(
  email: string,
  subject: string,
  message: string
) {
  try {
    // Here you would integrate with your email sending service
    // For now, we'll just log it
    console.log(`Email notification to ${email}:`, {
      subject: `Talep Atama Bildirimi: ${subject}`,
      body: message,
    });
    
    // TODO: Integrate with actual email sending service (e.g., Resend, SendGrid, etc.)
    // Example:
    // await resend.emails.send({
    //   from: 'your-email@yourdomain.com',
    //   to: email,
    //   subject: `Talep Atama Bildirimi: ${subject}`,
    //   text: message,
    // });
  } catch (error) {
    console.error("Error sending email notification:", error);
    // Don't throw error, allow other notification channels to work
  }
}

async function logCustomerNotification(
  customerId: string,
  ticketId: string,
  message: string
) {
  try {
    await prisma.activityLog.create({
      data: {
        action: "CUSTOMER_NOTIFICATION",
        entityType: "CUSTOMER",
        entityId: customerId,
        metadata: {
          ticketId,
          notificationType: "ASSIGNMENT_NOTIFICATION",
          message: message.substring(0, 100),
        },
      },
    } as any);
  } catch (error) {
    console.error("Error logging customer notification:", error);
  }
}
