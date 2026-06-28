import { BaseChannelAdapter } from '../../channels/base-channel.adapter';
import { IncomingMessage, OutgoingMessage, ConversationHistory, Media } from '../../channels/types';

interface WebChatConfig {
  enabled: boolean;
  autoResponse: boolean;
  responseDelay: number;
}

export class WebChatAdapter extends BaseChannelAdapter {
  readonly channelType = 'WEB_CHAT' as any;
  protected config: WebChatConfig;

  constructor(config: WebChatConfig) {
    super(config);
    this.config = config;
  }

  /**
   * Gelen mesajı al (WebSocket veya HTTP üzerinden)
   */
  async receiveMessage(): Promise<IncomingMessage | null> {
    // Bu metod WebSocket veya HTTP endpoint tarafından kullanılır
    return null;
  }

  /**
   * Mesaj gönder
   */
  async sendMessage(message: OutgoingMessage): Promise<void> {
    try {
      // Web chat için mesaj gönderme (WebSocket veya HTTP)
      // İleride WebSocket implementasyonu eklenecek
      console.log('Web chat message sent:', message);
    } catch (error) {
      this.handleError(error as Error, 'sendMessage');
      throw error;
    }
  }

  /**
   * Konuşma geçmişini al
   */
  async getConversationHistory(conversationId: string): Promise<ConversationHistory[]> {
    try {
      const { prisma } = await import('@/lib/prisma');

      const messages = await prisma.webChatSession.findMany({
        where: {
          ticketId: conversationId
        },
        orderBy: {
          createdAt: 'asc'
        }
      });

      // Web chat mesajları Message modelinde tutulabilir
      return messages.map((session: any) => ({
        id: session.id,
        role: 'user',
        content: '', // Mesajlar ayrı bir tabloda tutulmalı
        timestamp: session.createdAt
      }));
    } catch (error) {
      this.handleError(error as Error, 'getConversationHistory');
      return [];
    }
  }

  /**
   * Medya dosyasını kaydet
   */
  async storeMedia(media: Media): Promise<string> {
    // Web chat medya dosyaları S3 veya başka storage'a upload edilmeli
    // İleride implementasyon eklenecek
    return media.url;
  }
}
