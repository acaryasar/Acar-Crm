import { IncomingMessage, OutgoingMessage } from '../channels/types';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export class ResponseGenerator {
  /**
   * AI ile cevap oluştur
   */
  async generateAIResponse(question: string): Promise<string> {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'Sen bir profesyonel müşteri hizmetleri asistanısın. Türkçe cevap ver. Kısa, net ve yardımsever ol.'
          },
          {
            role: 'user',
            content: question
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      return response.choices[0].message.content || 'Üzgünüm, şu an size yardımcı olamıyorum.';
    } catch (error) {
      console.error('Error generating AI response:', error);
      return 'Üzgünüm, bir hata oluştu. Lütfen daha sonra tekrar deneyin.';
    }
  }

  /**
   * Müşteri bilgi isteği oluştur
   */
  generateCustomerInfoRequest(missingInfo: string[]): OutgoingMessage {
    const infoText = missingInfo.join(', ');
    return {
      to: '', // Will be set by caller
      content: `Size daha iyi yardımcı olabilmem için lütfen şu bilgileri paylaşın: ${infoText}`
    };
  }

  /**
   * Müşteri oluşturuldu bildirimi
   */
  generateCustomerCreatedResponse(customer: any): OutgoingMessage {
    return {
      to: '',
      content: `Merhaba ${customer.firstName}, kaydınız başarıyla oluşturuldu. Size nasıl yardımcı olabilirim?`
    };
  }

  /**
   * Follow-up cevabı
   */
  generateFollowupResponse(customer: any): OutgoingMessage {
    return {
      to: '',
      content: `Merhaba ${customer.firstName}, tekrar hoş geldiniz. Size nasıl yardımcı olabilirim?`
    };
  }

  /**
   * Tarih isteği
   */
  generateDateTimeRequest(): OutgoingMessage {
    return {
      to: '',
      content: 'Randevu için tercih ettiğiniz tarih ve saati belirtir misiniz?'
    };
  }

  /**
   * Müsait kullanıcı yok cevabı
   */
  generateNoAvailableUsersResponse(): OutgoingMessage {
    return {
      to: '',
      content: 'Üzgünüm, belirtilen tarihte müsait personelimiz bulunmamaktadır. Başka bir tarih deneyebilir misiniz?'
    };
  }

  /**
   * Randevu onayı
   */
  generateAppointmentConfirmationResponse(
    appointment: any,
    user: any
  ): OutgoingMessage {
    const date = new Date(appointment.startAt).toLocaleString('tr-TR');
    return {
      to: '',
      content: `Randevunuz başarıyla oluşturuldu!\n\nTarih: ${date}\nPersonel: ${user.firstName} ${user.lastName}\n\nRandevunuzdan önce size hatırlatma yapılacaktır.`
    };
  }

  /**
   * Müşteri oluşturulduktan sonra randevu isteği
   */
  generateAppointmentRequestAfterCustomerCreation(): OutgoingMessage {
    return {
      to: '',
      content: 'Kaydınız oluşturuldu. Şimdi randevu talebinizi alabiliriz. Tercih ettiğiniz tarih ve saati belirtir misiniz?'
    };
  }

  /**
   * Acil durum cevabı
   */
  generateUrgentIssueResponse(ticket: any): OutgoingMessage {
    return {
      to: '',
      content: 'Acil durum talebiniz alındı. En kısa sürede size yardımcı olmaya çalışacağız. Ticket numaranız: ' + ticket.id
    };
  }

  /**
   * Düşük confidence cevabı
   */
  generateLowConfidenceResponse(message: IncomingMessage): OutgoingMessage {
    return {
      to: message.from,
      content: 'Talebinizi anladım. Bir uzmanımız en kısa sürede size yardımcı olacaktır.'
    };
  }

  /**
   * Bilinmeyen intent cevabı
   */
  generateUnknownIntentResponse(): OutgoingMessage {
    return {
      to: '',
      content: 'Talebinizi tam olarak anlayamadım. Lütfen daha detaylı bilgi verir misiniz?'
    };
  }
}
