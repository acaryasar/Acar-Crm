import { BaseChannelAdapter } from '../../channels/base-channel.adapter';
import { IncomingMessage, OutgoingMessage, ConversationHistory, Media } from '../../channels/types';

interface PhoneConfig {
  accountSid: string;
  authToken: string;
  phoneNumber: string;
  enabled: boolean;
  autoResponse: boolean;
  voiceRecognition: boolean;
}

export class PhoneAdapter extends BaseChannelAdapter {
  readonly channelType = 'PHONE' as any;
  protected config: PhoneConfig;
  private apiUrl: string;

  constructor(config: PhoneConfig) {
    super(config);
    this.config = config;
    this.apiUrl = `https://api.twilio.com/2010-04-01/Accounts/${config.accountSid}`;
  }

  /**
   * Gelen çağrıyı al (webhook üzerinden)
   */
  async receiveMessage(): Promise<IncomingMessage | null> {
    // Bu metod webhook tarafından kullanılır
    return null;
  }

  /**
   * Mesaj gönder (SMS veya voice call)
   */
  async sendMessage(message: OutgoingMessage): Promise<void> {
    try {
      // SMS gönderme
      const url = `${this.apiUrl}/Messages.json`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${this.config.accountSid}:${this.config.authToken}`)}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          From: this.config.phoneNumber,
          To: message.to,
          Body: message.content
        })
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Twilio API error: ${error}`);
      }

      console.log('SMS sent successfully');
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

      const calls = await prisma.phoneCall.findMany({
        where: {
          ticketId: conversationId
        },
        orderBy: {
          createdAt: 'asc'
        }
      });

      return calls.map((call: any) => ({
        id: call.id,
        role: call.direction === 'INBOUND' ? 'user' : 'assistant',
        content: call.transcription || 'Ses kaydı',
        timestamp: call.createdAt,
        media: call.recordingUrl ? [{
          type: 'audio',
          url: call.recordingUrl
        }] : undefined
      }));
    } catch (error) {
      this.handleError(error as Error, 'getConversationHistory');
      return [];
    }
  }

  /**
   * Medya dosyasını kaydet (ses kaydı)
   */
  async storeMedia(media: Media): Promise<string> {
    // Ses kayıtları Twilio'da saklanır
    // İleride S3 veya başka storage'a upload edilebilir
    return media.url;
  }

  /**
   * Çağrı başlat
   */
  async initiateCall(to: string, url: string): Promise<void> {
    try {
      const callUrl = `${this.apiUrl}/Calls.json`;

      const response = await fetch(callUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${this.config.accountSid}:${this.config.authToken}`)}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          From: this.config.phoneNumber,
          To: to,
          Url: url
        })
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Twilio call error: ${error}`);
      }

      console.log('Call initiated successfully');
    } catch (error) {
      this.handleError(error as Error, 'initiateCall');
      throw error;
    }
  }

  /**
   * Çağrı kaydet
   */
  async recordCall(callSid: string): Promise<string> {
    try {
      const recordingUrl = `${this.apiUrl}/Calls/${callSid}/Recordings.json`;

      const response = await fetch(recordingUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${this.config.accountSid}:${this.config.authToken}`)}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Twilio recording error: ${error}`);
      }

      const data = await response.json();
      return data.recording_url;
    } catch (error) {
      this.handleError(error as Error, 'recordCall');
      throw error;
    }
  }
}
