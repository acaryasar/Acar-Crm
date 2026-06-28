export const AI_CONFIG = {
  openai: {
    model: 'gpt-4o',
    temperature: 0.7,
    maxTokens: 1000
  },
  intents: {
    confidenceThreshold: 0.8,
    maxRetries: 3,
    trainingData: {
      NEW_CUSTOMER_INQUIRY: [
        'yeni müşteri olmak istiyorum',
        'kayıt olmak istiyorum',
        'ben yeni müşteriyim',
        'hesap açmak istiyorum',
        'ilk defa geldim'
      ],
      EXISTING_CUSTOMER_FOLLOWUP: [
        'randevum hakkında bilgi almak istiyorum',
        'önceki talebim ne durumda',
        'geçen seferki işlemlerim',
        'müşteri numaram'
      ],
      APPOINTMENT_REQUEST: [
        'randevu almak istiyorum',
        'tarih ayırmak istiyorum',
        'zamanlama yapabilir miyiz',
        'müsait olduğunuz tarih',
        'randevu oluşturun'
      ],
      URGENT_ISSUE: [
        'acil durum',
        'en kısa sürede yardımcı olun',
        'acil yardım',
        'su sızıntısı',
        'yangın',
        'elektrik kesintisi'
      ],
      GENERAL_QUESTION: [
        'fiyatlar ne kadar',
        'çalışma saatleriniz',
        'hizmetleriniz neler',
        'adresiniz nerede',
        'iletişim bilgileri'
      ]
    }
  },
  channels: {
    whatsapp: {
      enabled: true,
      autoResponse: true,
      responseDelay: 2000
    },
    phone: {
      enabled: true,
      voiceRecognition: true,
      autoResponse: false
    },
    webChat: {
      enabled: true,
      autoResponse: true,
      responseDelay: 1000
    },
    email: {
      enabled: true,
      autoResponse: false,
      processingInterval: 300000
    }
  },
  responseTemplates: {
    customerCreated: 'Merhaba {firstName}, kaydınız başarıyla oluşturuldu. Size nasıl yardımcı olabilirim?',
    appointmentConfirmation: 'Randevunuz başarıyla oluşturuldu!\n\nTarih: {date}\nPersonel: {employee}\n\nRandevunuzdan önce size hatırlatma yapılacaktır.',
    urgentIssue: 'Acil durum talebiniz alındı. En kısa sürede size yardımcı olmaya çalışacağız. Ticket numaranız: {ticketId}',
    lowConfidence: 'Talebinizi anladım. Bir uzmanımız en kısa sürede size yardımcı olacaktır.',
    unknownIntent: 'Talebinizi tam olarak anlayamadım. Lütfen daha detaylı bilgi verir misiniz?'
  }
};
