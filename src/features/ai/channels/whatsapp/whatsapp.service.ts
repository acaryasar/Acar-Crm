import { WhatsAppAdapter } from './whatsapp.adapter';
import { IncomingMessage, OutgoingMessage } from '../../channels/types';

export class WhatsAppService {
  private adapter: WhatsAppAdapter;

  constructor(adapter: WhatsAppAdapter) {
    this.adapter = adapter;
  }

  /**
   * Gelen WhatsApp mesajını işle
   */
  async processIncomingMessage(message: IncomingMessage, companyId: string): Promise<void> {
    try {
      // Mesajı logla
      await this.logIncomingMessage(message, companyId);

      // AI Orchestrator'a ilet
      const { AIOrchestrator } = await import('../../core/ai-orchestrator');
      const orchestrator = new AIOrchestrator();
      await orchestrator.processMessage(message, companyId);
    } catch (error) {
      console.error('Error processing WhatsApp message:', error);
      throw error;
    }
  }

  /**
   * Giden WhatsApp mesajını işle
   */
  async processOutgoingMessage(message: OutgoingMessage, companyId: string): Promise<void> {
    try {
      // Mesajı gönder
      await this.adapter.sendMessage(message);

      // Mesajı logla
      await this.logOutgoingMessage(message, companyId);
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      throw error;
    }
  }

  /**
   * Gelen mesajı logla
   */
  private async logIncomingMessage(message: IncomingMessage, companyId: string): Promise<void> {
    const { ConversationLogger } = await import('../../logging/conversation-logger');
    const logger = new ConversationLogger();
    await logger.logIncomingMessage(message, companyId);
  }

  /**
   * Giden mesajı logla
   */
  private async logOutgoingMessage(message: OutgoingMessage, companyId: string): Promise<void> {
    const { ConversationLogger } = await import('../../logging/conversation-logger');
    const logger = new ConversationLogger();
    await logger.logOutgoingMessage(message, 'WHATSAPP', companyId);
  }

  /**
   * WhatsApp konuşma geçmişini al
   */
  async getConversationHistory(conversationId: string): Promise<any[]> {
    return await this.adapter.getConversationHistory(conversationId);
  }

  /**
   * WhatsApp şablon mesajı gönder
   */
  async sendTemplateMessage(to: string, templateName: string, components: any[] = []): Promise<void> {
    await this.adapter.sendTemplateMessage(to, templateName, components);
  }

  /**
   * WhatsApp medya mesajı gönder
   */
  async sendMediaMessage(to: string, mediaUrl: string, mediaType: string, caption?: string): Promise<void> {
    await this.adapter.sendMediaMessage(to, mediaUrl, mediaType, caption);
  }
}
