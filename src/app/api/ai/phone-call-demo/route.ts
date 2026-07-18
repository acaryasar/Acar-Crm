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
  phoneNumber?: string;
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
          channelType: "PHONE",
          conversationType: "INITIAL_INQUIRY",
          startTime: new Date(),
        }
      });

      demoSession = {
        step: "greeting",
        data: {},
        conversationLogId: conversationLog.id,
        phoneNumber: `+90${Math.floor(Math.random() * 1000000000)}`,
      };
      sessions.set(sessionId, demoSession);
    }

    const response = await processStep(demoSession, message, companyId);

    return NextResponse.json({ answer: response });
  } catch (error) {
    console.error("Error in Phone Call demo chat:", error);
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
      return "Merhaba! Phone Call AI asistanı olarak size yardımcı olmaktan mutluluk duyarım. Lütfen adınızı söyleyin.";

    case "customer_name":
      const nameParts = message.trim().split(" ");
      session.data.firstName = nameParts[0];
      session.data.lastName = nameParts.slice(1).join(" ") || "";
      session.step = "customer_phone";
      return `Teşekkürler ${session.data.firstName}. Telefon numaranızı paylaşır mısınız?`;

    case "customer_phone":
      const phoneDigits = message.replace(/\D/g, "");
      if (phoneDigits.length >= 10) {
        session.data.phone = message.trim();
        session.step = "customer_email";
        return "Telefon numaranız kaydedildi. E-posta adresinizi paylaşır mısınız?";
      }
      return "Lütfen geçerli bir telefon numarası girin.";

    case "customer_email":
      if (message.includes("@")) {
        session.data.email = message.trim();
        session.step = "issue_description";
        return "E-posta adresiniz kaydedildi. Size nasıl yardımcı olabilirim? Lütfen sorunuzu veya talebinizi açıklayın.";
      }
      return "Lütfen geçerli bir e-posta adresi girin.";

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
      return "Başka bir konuda yardıma ihtiyacınız olduğunda arayabilirsiniz. İyi günler!";

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
        is_active: true,
      }
    });

    // Create ticket
    const ticket = await prisma.ticket.create({
      data: {
        companyId,
        customerId: customer.id,
        title: `${session.data.category || "Genel"} - Telefon Talebi`,
        description: session.data.description || "Telefon araması üzerinden gelen talep",
        source: "PHONE",
        status: "NEW",
        category: "OTHER",
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
      const appointmentDate = new Date(session.data.appointmentDate);
      const endDate = new Date(appointmentDate.getTime() + 60 * 60 * 1000); // 1 hour later
      
      await prisma.appointment.create({
        data: {
          companyId,
          customerId: customer.id,
          title: "Telefon Randevusu",
          description: session.data.description || "Telefon araması üzerinden gelen randevu",
          startAt: appointmentDate,
          endAt: endDate,
          status: "PLANNED",
        }
      });
    }

    return `Talebiniz başarıyla oluşturuldu!\n\nMüşteri: ${customer.firstName} ${customer.lastName}\nTelefon: ${customer.phone}\nE-posta: ${customer.email}\nKategori: ${session.data.category}\nÖncelik: ${session.data.priority}\n${session.data.appointmentDate ? `Randevu: ${session.data.appointmentDate}` : ''}\n\nTalep ID: ${ticket.id}`;
  } catch (error) {
    console.error("Error creating customer/ticket:", error);
    return "Talep oluşturulurken bir hata oluştu. Lütfen daha sonra tekrar deneyin.";
  }
}
