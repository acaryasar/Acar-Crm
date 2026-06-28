import { IncomingMessage, IntentResult, Intent } from '../channels/types';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export class IntentProcessor {
  private confidenceThreshold = 0.7;

  /**
   * Mesajdan intent belirle
   */
  async process(message: IncomingMessage): Promise<IntentResult> {
    try {
      const prompt = this.buildIntentPrompt(message);
      
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
        temperature: 0.3,
        response_format: { type: 'json_object' }
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      
      return {
        intent: this.mapIntent(result.intent),
        confidence: result.confidence || 0.5,
        entities: result.entities || {}
      };
    } catch (error) {
      console.error('Error processing intent:', error);
      return {
        intent: Intent.UNKNOWN,
        confidence: 0,
        entities: {}
      };
    }
  }

  /**
   * Intent için sistem prompt'u
   */
  private getSystemPrompt(): string {
    return `Sen bir müşteri hizmetleri AI asistanısın. Gelen mesajların intent'ini belirle.

Mümkün intent'ler:
- NEW_CUSTOMER_INQUIRY: Yeni bir müşteri kaydı veya bilgi talebi
- EXISTING_CUSTOMER_FOLLOWUP: Mevcut bir müşterinin follow-up sorusu
- APPOINTMENT_REQUEST: Randevu talebi
- URGENT_ISSUE: Acil durum veya acil yardım talebi
- GENERAL_QUESTION: Genel bilgi sorusu
- UNKNOWN: Belirsiz intent

JSON formatında yanıt ver:
{
  "intent": "INTENT_NAME",
  "confidence": 0.0-1.0,
  "entities": {
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "phone": "string",
    "preferredStartAt": "ISO date string",
    "preferredEndAt": "ISO date string",
    "category": "string",
    "description": "string"
  }
}`;
  }

  /**
   * Intent prompt'u oluştur
   */
  private buildIntentPrompt(message: IncomingMessage): string {
    return `Mesaj: ${message.content}
Tarih: ${message.timestamp}
Gönderen: ${message.from}

Bu mesajın intent'ini belirle ve varsa entity'leri çıkar.`;
  }

  /**
   * Intent string'i enum'a map et
   */
  private mapIntent(intent: string): Intent {
    const intentMap: Record<string, Intent> = {
      'NEW_CUSTOMER_INQUIRY': Intent.NEW_CUSTOMER_INQUIRY,
      'EXISTING_CUSTOMER_FOLLOWUP': Intent.EXISTING_CUSTOMER_FOLLOWUP,
      'APPOINTMENT_REQUEST': Intent.APPOINTMENT_REQUEST,
      'URGENT_ISSUE': Intent.URGENT_ISSUE,
      'GENERAL_QUESTION': Intent.GENERAL_QUESTION
    };

    return intentMap[intent] || Intent.UNKNOWN;
  }

  /**
   * Confidence threshold kontrolü
   */
  isConfidentEnough(result: IntentResult): boolean {
    return result.confidence >= this.confidenceThreshold;
  }
}
