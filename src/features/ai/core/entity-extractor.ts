import { IncomingMessage, IntentResult, CustomerInfo, AppointmentRequest } from '../channels/types';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export class EntityExtractor {
  /**
   * Mesajdan entity'leri çıkar
   */
  async extract(
    message: IncomingMessage,
    intentResult: IntentResult
  ): Promise<Record<string, any>> {
    try {
      const prompt = this.buildExtractionPrompt(message, intentResult);
      
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: this.getSystemPrompt()
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2,
        response_format: { type: 'json_object' }
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      
      // Tarih string'lerini Date objesine çevir
      if (result.preferredStartAt) {
        result.preferredStartAt = new Date(result.preferredStartAt);
      }
      if (result.preferredEndAt) {
        result.preferredEndAt = new Date(result.preferredEndAt);
      }

      return result;
    } catch (error) {
      console.error('Error extracting entities:', error);
      return {};
    }
  }

  /**
   * Entity extraction için sistem prompt'u
   */
  private getSystemPrompt(): string {
    return `Sen bir entity extraction uzmanısın. Mesajlardan müşteri bilgilerini ve randevu detaylarını çıkar.

JSON formatında yanıt ver:
{
  "firstName": "string veya null",
  "lastName": "string veya null",
  "email": "string veya null",
  "phone": "string veya null",
  "street": "string veya null",
  "city": "string veya null",
  "postalCode": "string veya null",
  "preferredStartAt": "ISO date string veya null",
  "preferredEndAt": "ISO date string veya null",
  "category": "HEATING/PLUMBING/ELECTRICITY/PAINTING/OTHER veya null",
  "description": "string veya null"
}`;
  }

  /**
   * Extraction prompt'u oluştur
   */
  private buildExtractionPrompt(
    message: IncomingMessage,
    intentResult: IntentResult
  ): string {
    return `Mesaj: ${message.content}
Intent: ${intentResult.intent}
Confidence: ${intentResult.confidence}

Bu mesajdan entity'leri çıkar. Eğer bilgi yoksa null olarak işaretle.`;
  }

  /**
   * Müşteri bilgilerini doğrula
   */
  validateCustomerInfo(info: any): CustomerInfo {
    return {
      firstName: info.firstName || undefined,
      lastName: info.lastName || undefined,
      email: info.email || undefined,
      phone: info.phone || undefined,
      street: info.street || undefined,
      city: info.city || undefined,
      postalCode: info.postalCode || undefined
    };
  }

  /**
   * Randevu talebini doğrula
   */
  validateAppointmentRequest(info: any): AppointmentRequest {
    return {
      preferredStartAt: info.preferredStartAt ? new Date(info.preferredStartAt) : new Date(),
      preferredEndAt: info.preferredEndAt ? new Date(info.preferredEndAt) : new Date(),
      category: info.category,
      description: info.description
    };
  }
}
