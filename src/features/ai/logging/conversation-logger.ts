import { IncomingMessage, OutgoingMessage } from '../channels/types';
import { prisma } from '@/lib/prisma';

export class ConversationLogger {
  /**
   * Gelen mesajı logla
   */
  async logIncomingMessage(message: IncomingMessage): Promise<void> {
    try {
      // Kanal spesifik loglama
      switch (message.channelType) {
        case 'WHATSAPP':
          await this.logWhatsAppMessage(message);
          break;
        case 'PHONE':
          await this.logPhoneCall(message);
          break;
        case 'WEB_CHAT':
          await this.logWebChatMessage(message);
          break;
        case 'EMAIL':
          await this.logEmailMessage(message);
          break;
      }
    } catch (error) {
      console.error('Error logging incoming message:', error);
    }
  }

  /**
   * Giden mesajı logla
   */
  async logOutgoingMessage(
    message: OutgoingMessage,
    channelType: string
  ): Promise<void> {
    try {
      // Kanal spesifik loglama
      switch (channelType) {
        case 'WHATSAPP':
          await this.logWhatsAppOutgoing(message);
          break;
        case 'PHONE':
          // Telefon için ses kaydı loglanır
          break;
        case 'WEB_CHAT':
          await this.logWebChatOutgoing(message);
          break;
        case 'EMAIL':
          await this.logEmailOutgoing(message);
          break;
      }
    } catch (error) {
      console.error('Error logging outgoing message:', error);
    }
  }

  /**
   * Konuşmayı ticket ile ilişkilendir
   */
  async linkToTicket(messageId: string, ticketId: string): Promise<void> {
    try {
      // WhatsApp için
      const whatsappMessage = await prisma.whatsAppMessage.findFirst({
        where: { whatsappMessageId: messageId }
      });

      if (whatsappMessage) {
        await prisma.whatsAppMessage.update({
          where: { id: whatsappMessage.id },
          data: { ticketId }
        });
      }

      // AI Conversation Log oluştur
      await this.createAIConversationLog(ticketId, 'WHATSAPP');
    } catch (error) {
      console.error('Error linking to ticket:', error);
    }
  }

  /**
   * AI Conversation Log oluştur
   */
  private async createAIConversationLog(
    ticketId: string,
    channelType: string
  ): Promise<void> {
    try {
      const ticket = await prisma.ticket.findUnique({
        where: { id: ticketId }
      });

      if (!ticket) return;

      await prisma.aIConversationLog.create({
        data: {
          ticketId,
          channelType: channelType as any,
          conversationType: 'INITIAL_INQUIRY' as any,
          startTime: new Date()
        }
      });
    } catch (error) {
      console.error('Error creating AI conversation log:', error);
    }
  }

  /**
   * WhatsApp mesajı logla
   */
  private async logWhatsAppMessage(message: IncomingMessage): Promise<void> {
    await prisma.whatsAppMessage.create({
      data: {
        phoneNumber: message.from,
        messageFrom: 'customer',
        content: message.content,
        whatsappMessageId: message.id,
        mediaUrl: message.media?.[0]?.url,
        mediaType: message.media?.[0]?.type
      }
    });
  }

  /**
   * WhatsApp giden mesaj logla
   */
  private async logWhatsAppOutgoing(message: OutgoingMessage): Promise<void> {
    await prisma.whatsAppMessage.create({
      data: {
        phoneNumber: message.to,
        messageFrom: 'assistant',
        content: message.content,
        whatsappMessageId: `out_${Date.now()}`,
        mediaUrl: message.media?.[0]?.url,
        mediaType: message.media?.[0]?.type
      }
    });
  }

  /**
   * Telefon araması logla
   */
  private async logPhoneCall(message: IncomingMessage): Promise<void> {
    await prisma.phoneCall.create({
      data: {
        phoneNumber: message.from,
        direction: 'INBOUND',
        callStatus: 'COMPLETED',
        transcription: message.content
      }
    });
  }

  /**
   * Web chat mesajı logla
   */
  private async logWebChatMessage(message: IncomingMessage): Promise<void> {
    const sessionId = message.metadata?.sessionId || `session_${Date.now()}`;

    await prisma.webChatSession.upsert({
      where: { sessionId },
      update: {
        updatedAt: new Date()
      },
      create: {
        sessionId,
        status: 'ACTIVE',
        customerEmail: message.metadata?.email,
        customerName: message.metadata?.name,
        ipAddress: message.metadata?.ipAddress,
        userAgent: message.metadata?.userAgent
      }
    });
  }

  /**
   * Web chat giden mesaj logla
   */
  private async logWebChatOutgoing(message: OutgoingMessage): Promise<void> {
    // Web chat için session güncelleme
    // Mesaj içeriği Message modelinde loglanabilir
  }

  /**
   * Email mesajı logla
   */
  private async logEmailMessage(message: IncomingMessage): Promise<void> {
    // Email zaten EmailInbox modelinde loglanıyor
    // Burada AI Conversation Log ile ilişkilendirme yapılabilir
  }

  /**
   * Email giden mesaj logla
   */
  private async logEmailOutgoing(message: OutgoingMessage): Promise<void> {
    // Email gönderme loglanabilir
  }

  /**
   * Konuşmayı bitir
   */
  async endConversation(ticketId: string): Promise<void> {
    try {
      await prisma.aIConversationLog.updateMany({
        where: { ticketId },
        data: {
          endTime: new Date()
        }
      });
    } catch (error) {
      console.error('Error ending conversation:', error);
    }
  }
}
