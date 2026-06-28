import { prisma } from '@/lib/prisma';
import { createAIProvider } from '../providers/provider-factory';
import { AIProviderConfig } from '../providers/base-provider';

interface ConversationState {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  description?: string;
  category?: string;
  priority?: string;
  preferredDate?: string;
  customerId?: string;
  ticketId?: string;
  appointmentId?: string;
}

class WhatsAppAgent {
  private state: ConversationState = {};
  private companyId: string;
  private aiProvider: any;
  private mockStep: number = 0;

  constructor(companyId: string, config?: AIProviderConfig) {
    this.companyId = companyId;
    this.aiProvider = createAIProvider(config);
  }

  async processMessage(message: string): Promise<string> {
    // Check if using mock provider
    if (this.aiProvider.constructor.name === 'MockProvider') {
      return this.processMockMessage(message);
    }

    const systemPrompt = `Sen bir WhatsApp müşteri hizmetleri asistanısın. Müşteriden bilgileri topla.

Kullanıcı mesajındaki bilgileri analiz et:
- İsim varsa kaydet
- Telefon varsa kaydet  
- "Kombi" veya "ısıtma" varsa kategori HEATING
- "Acil" varsa öncelik URGENT

Eksik bilgileri sırayla iste. Her seferinde SADECE bir şey sor. Kısa ve doğal cevap ver. Türkçe konuş.`

    const functions = [
      {
        name: 'getAvailableAppointments',
        description: 'Müsait randevu tarihlerini getirir',
        parameters: {
          type: 'object',
          properties: {
            date: {
              type: 'string',
              description: 'Tarih (YYYY-MM-DD formatında)',
            },
          },
          required: ['date'],
        },
      },
      {
        name: 'createCustomer',
        description: 'Yeni müşteri oluşturur',
        parameters: {
          type: 'object',
          properties: {
            firstName: {
              type: 'string',
              description: 'Müşterinin adı',
            },
            lastName: {
              type: 'string',
              description: 'Müşterinin soyadı',
            },
            phone: {
              type: 'string',
              description: 'Telefon numarası',
            },
            email: {
              type: 'string',
              description: 'E-posta adresi (opsiyonel)',
            },
          },
          required: ['firstName', 'lastName', 'phone'],
        },
      },
      {
        name: 'createTicket',
        description: 'Yeni talep (ticket) oluşturur',
        parameters: {
          type: 'object',
          properties: {
            customerId: {
              type: 'string',
              description: 'Müşteri ID',
            },
            title: {
              type: 'string',
              description: 'Talep başlığı',
            },
            description: {
              type: 'string',
              description: 'Talep açıklaması',
            },
            category: {
              type: 'string',
              description: 'Kategori (HEATING, PLUMBING, ELECTRICITY, PAINTING, OTHER)',
            },
            priority: {
              type: 'string',
              description: 'Öncelik (LOW, MEDIUM, HIGH, URGENT)',
            },
          },
          required: ['customerId', 'title', 'description', 'category', 'priority'],
        },
      },
      {
        name: 'createAppointment',
        description: 'Randevu oluşturur',
        parameters: {
          type: 'object',
          properties: {
            customerId: {
              type: 'string',
              description: 'Müşteri ID',
            },
            ticketId: {
              type: 'string',
              description: 'Ticket ID',
            },
            startAt: {
              type: 'string',
              description: 'Başlangıç tarihi ve saati (ISO format)',
            },
            endAt: {
              type: 'string',
              description: 'Bitiş tarihi ve saati (ISO format)',
            },
            title: {
              type: 'string',
              description: 'Randevu başlığı',
            },
            description: {
              type: 'string',
              description: 'Randevu açıklaması',
            },
          },
          required: ['customerId', 'ticketId', 'startAt', 'endAt', 'title'],
        },
      },
    ];

    const response = await this.aiProvider.processMessage(systemPrompt, functions, this.state, message);

    // Handle function calls
    if (response.functionCall) {
      const functionName = response.functionCall.name;
      const functionArgs = JSON.parse(response.functionCall.arguments);

      let functionResult: any;

      switch (functionName) {
        case 'getAvailableAppointments':
          functionResult = await this.getAvailableAppointments(functionArgs.date);
          break;
        case 'createCustomer':
          functionResult = await this.createCustomer(functionArgs);
          break;
        case 'createTicket':
          functionResult = await this.createTicket(functionArgs);
          break;
        case 'createAppointment':
          functionResult = await this.createAppointment(functionArgs);
          break;
        default:
          functionResult = { error: 'Unknown function' };
      }

      // Continue conversation with function result
      const followUpResponse = await this.aiProvider.processWithFunctionResult(
        systemPrompt,
        functions,
        response.functionCall,
        functionResult,
        this.state
      );

      return followUpResponse.content || 'Bir hata oluştu';
    }

    return response.content || 'Bir hata oluştu';
  }

  private async processMockMessage(message: string): Promise<string> {
    const userMessage = message.trim().toLowerCase();

    switch (this.mockStep) {
      case 0:
        this.mockStep = 1;
        return "Merhaba! Ben WhatsApp asistanıyım. Size nasıl yardımcı olabilirim? Önce müşteri adını öğrenmem gerekiyor. Müşterinin adı ve soyadı nedir?";

      case 1:
        const names = message.trim().split(" ");
        if (names.length < 2) {
          return "Lütfen hem ad hem de soyad girin.";
        }
        this.state.firstName = names[0];
        this.state.lastName = names.slice(1).join(" ");
        this.mockStep = 2;
        return `Teşekkürler! ${this.state.firstName} ${this.state.lastName} olarak kaydedildi. Müşterinin telefon numarası nedir?`;

      case 2:
        this.state.phone = message.trim();
        this.mockStep = 3;
        return "Telefon numarası alındı. Müşterinin e-posta adresi var mı? (Varsa girin, yoksa 'yok' yazın)";

      case 3:
        if (userMessage !== "yok") {
          this.state.email = message.trim();
        }
        this.mockStep = 4;
        return "Müşterinin yaşadığı sorunu/isteği lütfen açıklayın:";

      case 4:
        this.state.description = message.trim();
        this.mockStep = 5;
        return "Sorunun kategorisi nedir?\n1. ISITMA (Isıtma)\n2. SU_TESISATI (Su Tesisatı)\n3. ELEKTRIK (Elektrik)\n4. BOYA (Boya)\n5. DIGER (Diğer)\nLütfen numara veya kategori adı girin.";

      case 5:
        const categoryMap: Record<string, string> = {
          "1": "HEATING",
          "2": "PLUMBING",
          "3": "ELECTRICITY",
          "4": "PAINTING",
          "5": "OTHER",
          "isitma": "HEATING",
          "su_tesisati": "PLUMBING",
          "elektrik": "ELECTRICITY",
          "boya": "PAINTING",
          "diger": "OTHER"
        };
        const category = categoryMap[userMessage] || message.trim().toUpperCase();
        if (["HEATING", "PLUMBING", "ELECTRICITY", "PAINTING", "OTHER"].includes(category)) {
          this.state.category = category;
          this.mockStep = 6;
          return "Öncelik seviyesi nedir?\n1. DÜŞÜK (LOW)\n2. ORTA (MEDIUM)\n3. YÜKSEK (HIGH)\n4. ACİL (URGENT)\nLütfen numara veya öncelik adı girin.";
        }
        return "Geçersiz kategori. Lütfen geçerli bir kategori seçin.";

      case 6:
        const priorityMap: Record<string, string> = {
          "1": "LOW",
          "2": "MEDIUM",
          "3": "HIGH",
          "4": "URGENT",
          "düşük": "LOW",
          "orta": "MEDIUM",
          "yüksek": "HIGH",
          "acil": "URGENT"
        };
        const priority = priorityMap[userMessage] || message.trim().toUpperCase();
        if (["LOW", "MEDIUM", "HIGH", "URGENT"].includes(priority)) {
          this.state.priority = priority;
          this.mockStep = 7;
          return "Randevu tarihi ve saati ne olmalı? (Örn: 2026-06-28 14:00)";
        }
        return "Geçersiz öncelik. Lütfen geçerli bir öncelik seçin.";

      case 7:
        this.state.preferredDate = message.trim();
        this.mockStep = 8;
        return `Bilgileri onaylıyor musunuz?\n\nMüşteri: ${this.state.firstName} ${this.state.lastName}\nTelefon: ${this.state.phone}\nE-posta: ${this.state.email || "Yok"}\nSorun: ${this.state.description}\nKategori: ${this.state.category}\nÖncelik: ${this.state.priority}\nRandevu: ${this.state.preferredDate}\n\nOnaylamak için 'evet', iptal için 'hayır' yazın.`;

      case 8:
        if (userMessage === "evet" || userMessage === "yes") {
          const result = await this.executeMockCreation();
          this.mockStep = 9;
          return result;
        } else if (userMessage === "hayır" || userMessage === "no") {
          this.reset();
          this.mockStep = 0;
          return "İşlem iptal edildi. Yeni bir işlem başlatmak için yeni bir mesaj gönderin.";
        }
        return "Lütfen 'evet' veya 'hayır' yazın.";

      case 9:
        this.reset();
        this.mockStep = 0;
        return "İşlem tamamlandı. Yeni bir işlem başlatmak için yeni bir mesaj gönderin.";

      default:
        this.reset();
        this.mockStep = 0;
        return "Beklenmeyen bir durum oluştu. Lütfen yeni bir session başlatın.";
    }
  }

  private async executeMockCreation(): Promise<string> {
    try {
      // Create customer
      const customer = await this.createCustomer({
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        phone: this.state.phone,
        email: this.state.email,
      });

      if (!customer.success) {
        return "❌ Müşteri oluşturulurken hata oluştu.";
      }

      // Create ticket
      const ticket = await this.createTicket({
        customerId: this.state.customerId,
        title: `${this.state.category} - ${this.state.description?.substring(0, 50)}`,
        description: this.state.description,
        category: this.state.category,
        priority: this.state.priority,
      });

      if (!ticket.success) {
        return "❌ Ticket oluşturulurken hata oluştu.";
      }

      // Create appointment
      const appointmentDate = new Date(this.state.preferredDate || new Date());
      const endAt = new Date(appointmentDate.getTime() + 60 * 60 * 1000);

      const appointment = await this.createAppointment({
        customerId: this.state.customerId,
        ticketId: this.state.ticketId,
        startAt: appointmentDate.toISOString(),
        endAt: endAt.toISOString(),
        title: `${this.state.category} - ${this.state.firstName} ${this.state.lastName}`,
        description: this.state.description,
      });

      if (!appointment.success) {
        return `✅ Müşteri ve ticket oluşturuldu, ancak randevu oluşturulamadı: ${appointment.error}`;
      }

      return `✅ İşlem başarıyla tamamlandı!\n\n👤 Müşteri: ${this.state.firstName} ${this.state.lastName}\n📞 Telefon: ${this.state.phone}\n🎫 Ticket: ${ticket.ticket?.title}\n👷 Atanan Personel: ${appointment.employee}\n📅 Randevu: ${appointmentDate.toLocaleString('tr-TR')}\n\n(MOCK MODE - Demo amaçlı çalıştırıldı)`;

    } catch (error) {
      console.error("Error in mock creation:", error);
      return "❌ İşlem sırasında bir hata oluştu.";
    }
  }

  private async getAvailableAppointments(date: string): Promise<any> {
    try {
      const targetDate = new Date(date);
      const startOfDay = new Date(targetDate.setHours(8, 0, 0, 0));
      const endOfDay = new Date(targetDate.setHours(18, 0, 0, 0));

      // Get all users in the company
      const users = await prisma.user.findMany({
        where: {
          companyId: this.companyId,
          is_active: true,
        },
        include: {
          appointments: {
            where: {
              startAt: { gte: startOfDay, lte: endOfDay },
              status: 'PLANNED',
            },
          },
        },
      });

      const availableSlots: any[] = [];

      // Generate hourly slots from 8:00 to 18:00
      for (let hour = 8; hour < 18; hour++) {
        const slotStart = new Date(targetDate);
        slotStart.setHours(hour, 0, 0, 0);
        const slotEnd = new Date(targetDate);
        slotEnd.setHours(hour + 1, 0, 0, 0);

        users.forEach((user: any) => {
          const hasConflict = user.appointments.some((apt: any) => {
            return (
              (apt.startAt <= slotStart && apt.endAt > slotStart) ||
              (apt.startAt < slotEnd && apt.endAt >= slotEnd) ||
              (apt.startAt >= slotStart && apt.endAt <= slotEnd)
            );
          });

          if (!hasConflict) {
            availableSlots.push({
              date: slotStart.toISOString().split('T')[0],
              time: `${hour.toString().padStart(2, '0')}:00`,
              dateTime: slotStart.toISOString(),
              employee: `${user.firstName} ${user.lastName}`,
            });
          }
        });
      }

      return {
        success: true,
        date,
        availableSlots: availableSlots.slice(0, 10), // Return first 10 slots
      };
    } catch (error) {
      console.error('Error getting available appointments:', error);
      return { success: false, error: 'Randevu tarihleri alınamadı' };
    }
  }

  private async createCustomer(data: any): Promise<any> {
    try {
      const customer = await prisma.customer.create({
        data: {
          companyId: this.companyId,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          email: data.email || null,
        },
      });

      this.state.customerId = customer.id;
      this.state.firstName = customer.firstName;
      this.state.lastName = customer.lastName;
      this.state.phone = customer.phone;
      this.state.email = customer.email;

      // Log activity
      await prisma.activityLog.create({
        data: {
          companyId: this.companyId,
          action: 'CUSTOMER_CREATED',
          entityType: 'CUSTOMER',
          entityId: customer.id,
          metadata: {
            customerName: `${customer.firstName} ${customer.lastName}`,
            source: 'WHATSAPP_AI_AGENT',
          },
        },
      });

      return {
        success: true,
        customer,
        message: `Müşteri ${customer.firstName} ${customer.lastName} başarıyla oluşturuldu`,
      };
    } catch (error) {
      console.error('Error creating customer:', error);
      return { success: false, error: 'Müşteri oluşturulamadı' };
    }
  }

  private async createTicket(data: any): Promise<any> {
    try {
      const ticket = await prisma.ticket.create({
        data: {
          companyId: this.companyId,
          customerId: data.customerId,
          title: data.title,
          description: data.description,
          category: data.category as any,
          priority: data.priority as any,
          status: 'NEW',
          source: 'WHATSAPP',
        },
      });

      this.state.ticketId = ticket.id;

      // Log activity
      await prisma.activityLog.create({
        data: {
          companyId: this.companyId,
          action: 'TICKET_CREATED',
          entityType: 'TICKET',
          entityId: ticket.id,
          metadata: {
            ticketTitle: ticket.title,
            customerId: data.customerId,
            source: 'WHATSAPP_AI_AGENT',
          },
        },
      });

      return {
        success: true,
        ticket,
        message: `Talep başarıyla oluşturuldu: ${ticket.title}`,
      };
    } catch (error) {
      console.error('Error creating ticket:', error);
      return { success: false, error: 'Talep oluşturulamadı' };
    }
  }

  private async createAppointment(data: any): Promise<any> {
    try {
      // Find available user for the time slot
      const startAt = new Date(data.startAt);
      const endAt = new Date(data.endAt);

      const availableUsers = await prisma.user.findMany({
        where: {
          companyId: this.companyId,
          is_active: true,
          appointments: {
            none: {
              OR: [
                { AND: [{ startAt: { lte: startAt } }, { endAt: { gt: startAt } }] },
                { AND: [{ startAt: { lt: endAt } }, { endAt: { gte: endAt } }] },
                { AND: [{ startAt: { gte: startAt } }, { endAt: { lte: endAt } }] },
              ],
            },
          },
        },
      });

      if (availableUsers.length === 0) {
        return {
          success: false,
          error: 'Bu saat için uygun personel bulunamadı',
        };
      }

      const selectedUser = availableUsers[0];

      const appointment = await prisma.appointment.create({
        data: {
          companyId: this.companyId,
          customerId: data.customerId,
          employeeId: selectedUser.id,
          title: data.title,
          description: data.description,
          startAt,
          endAt,
          status: 'PLANNED',
        },
      });

      this.state.appointmentId = appointment.id;

      // Update ticket status and assign user
      await prisma.ticket.update({
        where: { id: data.ticketId },
        data: {
          assignedUserId: selectedUser.id,
          status: 'APPOINTMENT_CONFIRMED',
        },
      });

      // Log activity
      await prisma.activityLog.create({
        data: {
          companyId: this.companyId,
          action: 'APPOINTMENT_CREATED',
          entityType: 'APPOINTMENT',
          entityId: appointment.id,
          userId: selectedUser.id,
          metadata: {
            appointmentTitle: appointment.title,
            customerId: data.customerId,
            employeeId: selectedUser.id,
            employeeName: `${selectedUser.firstName} ${selectedUser.lastName}`,
            startAt: appointment.startAt,
            source: 'WHATSAPP_AI_AGENT',
          },
        },
      });

      // Send notification to user
      await prisma.notification.create({
        data: {
          companyId: this.companyId,
          userId: selectedUser.id,
          title: 'Yeni Randevu Atandı',
          message: `${data.title} - ${startAt.toLocaleString('tr-TR')}`,
          type: 'SUCCESS',
          entityType: 'APPOINTMENT',
          entityId: appointment.id,
        },
      });

      return {
        success: true,
        appointment,
        employee: `${selectedUser.firstName} ${selectedUser.lastName}`,
        message: `Randevu başarıyla oluşturuldu. Personel: ${selectedUser.firstName} ${selectedUser.lastName}`,
      };
    } catch (error) {
      console.error('Error creating appointment:', error);
      return { success: false, error: 'Randevu oluşturulamadı' };
    }
  }

  reset() {
    this.state = {};
    this.mockStep = 0;
    if (this.aiProvider.reset) {
      this.aiProvider.reset();
    }
  }

  getState(): ConversationState {
    return { ...this.state };
  }
}

export { WhatsAppAgent };
