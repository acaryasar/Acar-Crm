import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

interface DemoSession {
  step: "greeting" | "customer_name" | "customer_phone" | "customer_email" | "issue_description" | "category" | "priority" | "appointment_date" | "confirmation" | "completed";
  data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
    description?: string;
    category?: string;
    priority?: string;
    appointmentDate?: string;
  };
  conversationLogId?: string;
  sessionId?: string;
}

const sessions = new Map<string, DemoSession>();

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const companyId = (session?.user as any)?.companyId;

    if (!companyId) {
      return NextResponse.json({ error: "Unauthorized - No company ID found" }, { status: 401 });
    }

    const { message, sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 });
    }

    // Get or create session
    let demoSession = sessions.get(sessionId);
    if (!demoSession) {
      // Create conversation log for new session
      const conversationLog = await prisma.aIConversationLog.create({
        data: {
          companyId,
          channelType: "WEB_CHAT",
          conversationType: "INITIAL_INQUIRY",
          startTime: new Date(),
        }
      });

      demoSession = {
        step: "greeting",
        data: {},
        conversationLogId: conversationLog.id,
        sessionId: sessionId,
      };
      sessions.set(sessionId, demoSession);
    }

    const response = await processStep(demoSession, message, companyId);

    return NextResponse.json({ answer: response });
  } catch (error) {
    console.error("Error in Web Chat demo chat:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

async function processStep(session: DemoSession, message: string, companyId: string): Promise<string> {
  const lowerMessage = message.toLowerCase().trim();

  switch (session.step) {
    case "greeting":
      session.step = "customer_name";
      return "Merhaba! Web-Chat AI asistanı olarak size yardımcı olmaktan mutluluk duyarım. Lütfen adınızı söyleyin.";

    case "customer_name":
      const nameParts = message.trim().split(" ");
      session.data.firstName = nameParts[0];
      session.data.lastName = nameParts.slice(1).join(" ") || "";
      session.step = "customer_email";
      return `Teşekkürler ${session.data.firstName}. E-posta adresinizi paylaşır mısınız?`;

    case "customer_email":
      if (message.includes("@")) {
        session.data.email = message.trim();
        session.step = "customer_phone";
        return "E-posta adresiniz kaydedildi. Telefon numaranızı paylaşır mısınız?";
      }
      return "Lütfen geçerli bir e-posta adresi girin.";

    case "customer_phone":
      const phoneDigits = message.replace(/\D/g, "");
      if (phoneDigits.length >= 10) {
        session.data.phone = message.trim();
        session.step = "issue_description";
        return "Telefon numaranız kaydedildi. Size nasıl yardımcı olabilirim? Lütfen sorunuzu veya talebinizi açıklayın.";
      }
      return "Lütfen geçerli bir telefon numarası girin.";

    case "issue_description":
      session.data.description = message;
      session.step = "category";
      return "Sorunuzu anladım. Bu talebin hangi kategoriye ait olduğunu belirtir misiniz? (Örn: Teknik destek, Satış, Fatura vb.)";

    case "category":
      session.data.category = message;
      session.step = "priority";
      return "Kategori kaydedildi. Bu talebin öncelik seviyesi nedir? (Düşük, Orta, Yüksek, Acil)";

    case "priority":
      const priorityMap: Record<string, string> = {
        "düşük": "LOW",
        "orta": "MEDIUM", 
        "yüksek": "HIGH",
        "acil": "URGENT"
      };
      session.data.priority = priorityMap[lowerMessage] || "MEDIUM";
      session.step = "appointment_date";
      return "Öncelik belirlendi. Randevu talebiniz var mı? Varsa tarih belirtin, yoksa 'hayır' yazın.";

    case "appointment_date":
      if (lowerMessage === "hayır" || lowerMessage === "yok" || lowerMessage === "no") {
        session.step = "confirmation";
        return await createCustomerTicketAppointment(session, companyId);
      }
      session.data.appointmentDate = message;
      session.step = "confirmation";
      return await createCustomerTicketAppointment(session, companyId);

    case "confirmation":
      session.step = "completed";
      return "Talebiniz başarıyla oluşturuldu. Başka bir konuda yardımcı olabilir miyim?";

    case "completed":
      if (lowerMessage === "evet" || lowerMessage === "yes" || lowerMessage === "e") {
        session.step = "greeting";
        session.data = {};
        return "Yeni bir talep oluşturmak için adınızı söyleyin.";
      }
      return "Başka bir konuda yardıma ihtiyacınız olduğunda yazabilirsiniz. İyi günler!";

    default:
      return "Bir hata oluştu. Lütfen tekrar deneyin.";
  }
}

async function createCustomerTicketAppointment(session: DemoSession, companyId: string): Promise<string> {
  try {
    // Create customer
    const customer = await prisma.customer.create({
      data: {
        companyId,
        firstName: session.data.firstName || "Demo",
        lastName: session.data.lastName || "User",
        email: session.data.email || "demo@example.com",
        phone: session.data.phone || "+905555555555",
        isActive: true,
      }
    });

    // Create ticket
    const ticket = await prisma.ticket.create({
      data: {
        companyId,
        customerId: customer.id,
        title: `${session.data.category || "Genel"} - Web Chat Talebi`,
        description: session.data.description || "Web chat üzerinden gelen talep",
        source: "WEB",
        status: "NEW",
        priority: (session.data.priority as any) || "MEDIUM",
      }
    });

    // Update conversation log with ticket
    await prisma.aIConversationLog.update({
      where: { id: session.conversationLogId },
      data: { ticketId: ticket.id }
    });

    // Create appointment if date provided
    if (session.data.appointmentDate) {
      await prisma.appointment.create({
        data: {
          companyId,
          customerId: customer.id,
          ticketId: ticket.id,
          appointmentDate: new Date(session.data.appointmentDate),
          status: "PLANNED",
        }
      });
    }

    return `Talebiniz başarıyla oluşturuldu!\n\nMüşteri: ${customer.firstName} ${customer.lastName}\nE-posta: ${customer.email}\nTelefon: ${customer.phone}\nKategori: ${session.data.category}\nÖncelik: ${session.data.priority}\n${session.data.appointmentDate ? `Randevu: ${session.data.appointmentDate}` : ''}\n\nTalep ID: ${ticket.id}`;
  } catch (error) {
    console.error("Error creating customer/ticket:", error);
    return "Talep oluşturulurken bir hata oluştu. Lütfen daha sonra tekrar deneyin.";
  }
}
