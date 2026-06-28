import { IncomingMessage, IntentResult } from '../channels/types';
import { prisma } from '@/lib/prisma';

export class TicketCreationService {
  /**
   * Ticket oluştur
   */
  async createTicket(data: {
    customerId: string;
    companyId: string;
    title: string;
    description?: string;
    source: any;
    category: any;
    priority: any;
    assignedUserId?: string;
  }): Promise<any> {
    try {
      const ticket = await prisma.ticket.create({
        data: {
          customerId: data.customerId,
          companyId: data.companyId,
          title: data.title,
          description: data.description,
          source: data.source,
          category: data.category,
          priority: data.priority,
          assignedUserId: data.assignedUserId
        }
      });

      return ticket;
    } catch (error) {
      console.error('Error creating ticket:', error);
      throw error;
    }
  }

  /**
   * Ticket durumunu güncelle
   */
  async updateTicketStatus(ticketId: string, status: any): Promise<void> {
    try {
      await prisma.ticket.update({
        where: { id: ticketId },
        data: { status }
      });
    } catch (error) {
      console.error('Error updating ticket status:', error);
    }
  }

  /**
   * Ticket'ı kullanıcıya ata
   */
  async assignTicket(ticketId: string, userId: string): Promise<void> {
    try {
      await prisma.ticket.update({
        where: { id: ticketId },
        data: { assignedUserId: userId }
      });
    } catch (error) {
      console.error('Error assigning ticket:', error);
    }
  }

  /**
   * Manuel inceleme için ticket oluştur
   */
  async createManualReviewTicket(
    message: IncomingMessage,
    intentResult: IntentResult | null,
    companyId: string
  ): Promise<any> {
    try {
      const ticket = await prisma.ticket.create({
        data: {
          customerId: '', // Will be updated later
          companyId,
          title: 'Manuel İnceleme Gerekiyor',
          description: message.content,
          source: message.channelType,
          category: 'OTHER',
          priority: 'MEDIUM',
          aiSummary: intentResult ? `Intent: ${intentResult.intent}, Confidence: ${intentResult.confidence}` : null
        }
      });

      return ticket;
    } catch (error) {
      console.error('Error creating manual review ticket:', error);
      throw error;
    }
  }

  /**
   * Hata ticket'ı oluştur
   */
  async createErrorTicket(message: IncomingMessage, companyId: string): Promise<any> {
    try {
      const ticket = await prisma.ticket.create({
        data: {
          customerId: '',
          companyId,
          title: 'AI İşleme Hatası',
          description: message.content,
          source: message.channelType,
          category: 'OTHER',
          priority: 'HIGH'
        }
      });

      return ticket;
    } catch (error) {
      console.error('Error creating error ticket:', error);
      throw error;
    }
  }
}
