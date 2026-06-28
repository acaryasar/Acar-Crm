import { BaseChannelAdapter } from '../../channels/base-channel.adapter';
import { IncomingMessage, OutgoingMessage, ConversationHistory, Media } from '../../channels/types';

interface WhatsAppConfig {
  phoneNumberId: string;
  accessToken: string;
  apiVersion: string;
  enabled: boolean;
  autoResponse: boolean;
  responseDelay: number;
}

export class WhatsAppAdapter extends BaseChannelAdapter {
  readonly channelType = 'WHATSAPP' as any;
  protected config: WhatsAppConfig;
  private apiUrl: string;

  constructor(config: WhatsAppConfig) {
    super(config);
    this.config = config;
    this.apiUrl = `https://graph.facebook.com/${config.apiVersion}`;
  }

  /**
   * Gelen mesajı al (webhook üzerinden çağrılır)
   */
  async receiveMessage(): Promise<IncomingMessage | null> {
    // Bu metod webhook tarafından kullanılır
    // Gerçek implementasyon webhook endpoint'inde
    return null;
  }

  /**
   * Mesaj gönder
   */
  async sendMessage(message: OutgoingMessage): Promise<void> {
    try {
      const url = `${this.apiUrl}/${this.config.phoneNumberId}/messages`;

      const payload: any = {
        messaging_product: 'whatsapp',
        to: message.to,
        type: 'text',
        text: {
          body: message.content
        }
      };

      // Medya varsa
      if (message.media && message.media.length > 0) {
        const media = message.media[0];
        payload.type = media.type === 'image' ? 'image' :
                      media.type === 'document' ? 'document' :
                      media.type === 'audio' ? 'audio' : 'video';

        payload[media.type] = {
          link: media.url,
          caption: message.content
        };
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`WhatsApp API error: ${error}`);
      }

      console.log('WhatsApp message sent successfully');
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

      const messages = await prisma.whatsAppMessage.findMany({
        where: {
          ticketId: conversationId
        },
        orderBy: {
          createdAt: 'asc'
        }
      });

      return messages.map((msg: any) => ({
        id: msg.id,
        role: msg.messageFrom === 'customer' ? 'user' : 'assistant',
        content: msg.content,
        timestamp: msg.createdAt,
        media: msg.mediaUrl ? [{
          type: msg.mediaType as any,
          url: msg.mediaUrl
        }] : undefined
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
    // WhatsApp medya URL'leri zaten Meta'nın sunucularında
    // İleride S3 veya başka bir storage'a upload edilebilir
    return media.url;
  }

  /**
   * WhatsApp şablon mesajı gönder
   */
  async sendTemplateMessage(to: string, templateName: string, components: any[] = []): Promise<void> {
    try {
      const url = `${this.apiUrl}/${this.config.phoneNumberId}/messages`;

      const payload: any = {
        messaging_product: 'whatsapp',
        to: to,
        type: 'template',
        template: {
          name: templateName,
          language: { code: 'tr' }
        }
      };

      if (components.length > 0) {
        payload.template.components = components;
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`WhatsApp template error: ${error}`);
      }
    } catch (error) {
      this.handleError(error as Error, 'sendTemplateMessage');
      throw error;
    }
  }

  /**
   * Medya mesajı gönder
   */
  async sendMediaMessage(to: string, mediaUrl: string, mediaType: string, caption?: string): Promise<void> {
    try {
      const url = `${this.apiUrl}/${this.config.phoneNumberId}/messages`;

      const payload = {
        messaging_product: 'whatsapp',
        to: to,
        type: mediaType,
        [mediaType]: {
          link: mediaUrl,
          caption: caption || ''
        }
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`WhatsApp media error: ${error}`);
      }
    } catch (error) {
      this.handleError(error as Error, 'sendMediaMessage');
      throw error;
    }
  }
}
