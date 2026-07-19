import { prisma } from '@/lib/prisma';

export class NotificationService {
  /**
   * Kullanıcıya bildirim gönder
   */
  async notifyUser(user: any, appointment: any): Promise<void> {
    try {
      await prisma.notification.create({
        data: {
          userId: user.id,
          title: 'Yeni Randevu',
          message: `Size yeni bir randevu atandı: ${appointment.title}`,
          type: 'INFO',
          entityType: 'Appointment',
          entityId: appointment.id
        }
      });

      // Buraya email/SMS bildirim eklenebilir
    } catch (error) {
      console.error('Error notifying user:', error);
    }
  }

  /**
   * Müşteriye bildirim gönder
   */
  async notifyCustomer(customer: any, appointment: any, channel: any): Promise<void> {
    try {
      // Kanal bazlı bildirim
      // WhatsApp için mesaj, Email için email, vb.
      
      console.log(`Notifying customer ${customer.id} via ${channel} about appointment ${appointment.id}`);
      
      // İleride burası kanal adapter'ları üzerinden bildirim gönderecek
    } catch (error) {
      console.error('Error notifying customer:', error);
    }
  }

  /**
   * Acil ticket bildirimi
   */
  async notifyUrgentTicket(user: any, ticket: any): Promise<void> {
    try {
      await prisma.notification.create({
        data: {
          userId: user.id,
          title: 'Acil Ticket',
          message: `Size acil bir ticket atandı: ${ticket.title}`,
          type: 'ERROR',
          entityType: 'Ticket',
          entityId: ticket.id
        }
      });
    } catch (error) {
      console.error('Error notifying urgent ticket:', error);
    }
  }
}
