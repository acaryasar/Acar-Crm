import { IncomingMessage, OutgoingMessage, ConversationHistory, Media } from './types';
import { TicketSource } from '@prisma/client';

export interface IChannelAdapter {
  /**
   * Kanal tipi
   */
  readonly channelType: TicketSource;

  /**
   * Gelen mesajı al
   */
  receiveMessage(): Promise<IncomingMessage | null>;

  /**
   * Mesaj gönder
   */
  sendMessage(message: OutgoingMessage): Promise<void>;

  /**
   * Konuşma geçmişini al
   */
  getConversationHistory(conversationId: string): Promise<ConversationHistory[]>;

  /**
   * Medya dosyasını kaydet
   */
  storeMedia(media: Media): Promise<string>;

  /**
   * Kanal yapılandırması
   */
  getConfig(): Record<string, any>;

  /**
   * Kanalın aktif olup olmadığını kontrol et
   */
  isActive(): boolean;
}

export abstract class BaseChannelAdapter implements IChannelAdapter {
  abstract readonly channelType: TicketSource;
  protected config: Record<string, any>;

  constructor(config: Record<string, any> = {}) {
    this.config = config;
  }

  abstract receiveMessage(): Promise<IncomingMessage | null>;
  abstract sendMessage(message: OutgoingMessage): Promise<void>;
  abstract getConversationHistory(conversationId: string): Promise<ConversationHistory[]>;
  abstract storeMedia(media: Media): Promise<string>;

  getConfig(): Record<string, any> {
    return this.config;
  }

  isActive(): boolean {
    return this.config.enabled ?? false;
  }

  /**
   * Mesajı doğrula
   */
  protected validateMessage(message: IncomingMessage): boolean {
    return !!(
      message.id &&
      message.from &&
      message.content &&
      message.timestamp
    );
  }

  /**
   * Mesajı normalize et
   */
  protected normalizeMessage(message: IncomingMessage): IncomingMessage {
    return {
      ...message,
      content: message.content.trim(),
      timestamp: new Date(message.timestamp)
    };
  }

  /**
   * Hata yönetimi
   */
  protected handleError(error: Error, context: string): void {
    console.error(`[${this.channelType}] Error in ${context}:`, error);
    // Buraya logging servisi eklenebilir
  }
}
