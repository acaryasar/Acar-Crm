# AI Asistan Mimarisi Önerisi

## Genel Bakış

Bu mimari, WhatsApp, Telefon, Web Chat ve Email kanallarından gelen iletişimleri yöneten, müşteri oluşturabilen, talep (ticket) oluşturabilen ve randevu ayarlayabilen generic bir AI asistan sistemi için tasarlanmıştır.

## Mimari Katmanları

### 1. İletişim Kanalı Katmanı (Communication Channel Layer)

Her kanal için ayrı bir adapter yapısı:

```
src/features/ai/channels/
├── base-channel.adapter.ts        # Base interface
├── whatsapp/
│   ├── whatsapp.adapter.ts
│   ├── whatsapp.webhook.ts
│   └── whatsapp.service.ts
├── phone/
│   ├── phone.adapter.ts
│   ├── phone.service.ts
│   └── voice-recognition.service.ts
├── web-chat/
│   ├── web-chat.connector.ts
│   └── web-chat.service.ts
└── email/
    ├── email.adapter.ts
    └── email.processor.ts
```

**Base Channel Interface:**
```typescript
interface IChannelAdapter {
  channelType: TicketSource;
  receiveMessage(): Promise<IncomingMessage>;
  sendMessage(to: string, content: string): Promise<void>;
  getConversationHistory(conversationId: string): Promise<Message[]>;
  storeMedia(media: Media): Promise<string>;
}
```

### 2. AI İşleme Katmanı (AI Processing Layer)

```
src/features/ai/core/
├── ai-orchestrator.ts             # Ana koordinatör
├── conversation-manager.ts        # Konuşma yönetimi
├── intent-processor.ts            # Intent tanıma ve işleme
├── entity-extractor.ts            # Entity extraction (müşteri, tarih, adres)
└── response-generator.ts          # Cevap oluşturma
```

**Intent Types:**
```typescript
enum Intent {
  NEW_CUSTOMER_INQUIRY,
  EXISTING_CUSTOMER_FOLLOWUP,
  APPOINTMENT_REQUEST,
  URGENT_ISSUE,
  GENERAL_QUESTION,
  UNKNOWN
}
```

### 3. İş Mantığı Katmanı (Business Logic Layer)

```
src/features/ai/services/
├── customer-resolution.service.ts # Müşteri bulma/oluşturna
├── ticket-creation.service.ts     # Ticket oluşturma
├── appointment-scheduler.service.ts # Randevu planlama
├── user-availability.service.ts   # Müsait kullanıcı bulma
└── notification.service.ts         # Bildirim gönderme
```

### 4. Loglama ve Takip Katmanı (Logging & Tracking Layer)

```
src/features/ai/logging/
├── conversation-logger.ts          # Konuşma loglama
├── activity-tracker.ts            # Aktivite takibi
└── media-storage.service.ts       # Medya depolama
```

## Veritabanı Schema Güncellemeleri

### Yeni Modeller

```prisma
// AI Conversation Log - Ticket ile ilişkilendirilmiş konuşmalar
model AIConversationLog {
  id String @id @default(cuid())

  ticketId String
  ticket   Ticket @relation(fields: [ticketId], references: [id])

  channelType TicketSource

  // Konuşma detayları
  conversationType ConversationType
  startTime DateTime
  endTime DateTime?

  // Medya referansları
  audioRecordingUrl String?   // Telefon için ses kaydı
  chatLog Json?              // Konuşma geçmişi
  originalEmailId String?    // Email için referans

  // AI işleme sonuçları
  aiIntent String?
  aiConfidence Float?
  aiExtractedEntities Json?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([ticketId])
  @@index([channelType])
  @@index([createdAt])
}

enum ConversationType {
  INITIAL_INQUIRY
  INFORMATION_GATHERING
  APPOINTMENT_SCHEDULING
  ISSUE_RESOLUTION
  FOLLOW_UP
}

// WhatsApp Message
model WhatsAppMessage {
  id String @id @default(cuid())

  companyId String
  company   Company @relation(fields: [companyId], references: [id])

  conversationLogId String?
  conversationLog   AIConversationLog? @relation(fields: [conversationLogId], references: [id])

  ticketId String?
  ticket   Ticket? @relation(fields: [ticketId], references: [id])

  phoneNumber String
  messageFrom String  // 'customer' or 'assistant'
  content String @db.Text

  mediaUrl String?
  mediaType String?

  whatsappMessageId String @unique

  createdAt DateTime @default(now())

  @@index([companyId])
  @@index([ticketId])
  @@index([phoneNumber])
  @@index([createdAt])
}

// Phone Call
model PhoneCall {
  id String @id @default(cuid())

  companyId String
  company   Company @relation(fields: [companyId], references: [id])

  conversationLogId String?
  conversationLog   AIConversationLog? @relation(fields: [conversationLogId], references: [id])

  ticketId String?
  ticket   Ticket? @relation(fields: [ticketId], references: [id])

  phoneNumber String
  direction CallDirection
  duration Int?

  recordingUrl String?
  transcription String? @db.Text

  callStatus CallStatus

  createdAt DateTime @default(now())

  @@index([companyId])
  @@index([ticketId])
  @@index([phoneNumber])
  @@index([createdAt])
}

enum CallDirection {
  INBOUND
  OUTBOUND
}

enum CallStatus {
  COMPLETED
  MISSED
  CANCELLED
}

// Web Chat Session
model WebChatSession {
  id String @id @default(cuid())

  companyId String
  company   Company @relation(fields: [companyId], references: [id])

  conversationLogId String?
  conversationLog   AIConversationLog? @relation(fields: [conversationLogId], references: [id])

  ticketId String?
  ticket   Ticket? @relation(fields: [ticketId], references: [id])

  sessionId String @unique
  customerEmail String?
  customerName String?

  ipAddress String?
  userAgent String?

  status ChatStatus

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([companyId])
  @@index([ticketId])
  @@index([sessionId])
  @@index([createdAt])
}

enum ChatStatus {
  ACTIVE
  CLOSED
  TRANSFERRED
}
```

### Mevcut Modeller İçin Güncellemeler

```prisma
model Ticket {
  // ... mevcut alanlar ...

  // AI conversation log referansı
  aiConversationLog AIConversationLog?
  
  // Kanal spesifik referanslar
  whatsappMessages WhatsAppMessage[]
  phoneCalls        PhoneCall[]
  webChatSessions   WebChatSession[]
  
  // ... mevcut alanlar ...
}

model Company {
  // ... mevcut alanlar ...
  
  // AI asistan konfigürasyonu
  aiConfig Json?
  
  // Yeni ilişkiler
  whatsappMessages WhatsAppMessage[]
  phoneCalls        PhoneCall[]
  webChatSessions   WebChatSession[]
  aiConversationLogs AIConversationLog[]
}
```

## İş Akışı (Workflow)

### 1. Mesaj Gelişi

```
Incoming Message
    ↓
Channel Adapter (WhatsApp/Phone/WebChat/Email)
    ↓
AI Orchestrator
    ↓
Intent Processor → Entity Extractor
    ↓
Business Logic Services
    ├─ Customer Resolution
    ├─ Ticket Creation
    └─ Appointment Scheduling
    ↓
Response Generator
    ↓
Channel Adapter → Send Response
    ↓
Conversation Logger
```

### 2. Müşteri Oluşturma Akışı

```typescript
async function handleCustomerInquiry(message: IncomingMessage) {
  // 1. Mevcut müşteriyi ara (telefon/email ile)
  const existingCustomer = await customerService.findCustomer(
    message.phoneNumber,
    message.email
  );

  if (!existingCustomer) {
    // 2. Yeni müşteri için gerekli bilgileri topla
    const requiredInfo = await aiService.collectCustomerInfo(message);
    
    // 3. Yeni müşteri oluştur
    const customer = await customerService.createCustomer(requiredInfo);
    
    // 4. Müşteriye onay gönder
    await channelAdapter.sendMessage(
      message.from,
      `Merhaba ${customer.firstName}, kaydınız oluşturuldu.`
    );
  }

  return existingCustomer;
}
```

### 3. Randevu Oluşturma Akışı

```typescript
async function handleAppointmentRequest(
  customer: Customer,
  message: IncomingMessage
) {
  // 1. Tercih edilen tarih/saat al
  const preferredDateTime = await aiService.extractDateTime(message.content);
  
  // 2. Müsait kullanıcıları bul
  const availableUsers = await availabilityService.findAvailableUsers(
    preferredDateTime,
    customer.companyId
  );
  
  // 3. En uygun kullanıcıyı seç (AI ile)
  const selectedUser = await aiService.selectBestUser(
    availableUsers,
    customer,
    message.content
  );
  
  // 4. Randevu oluştur
  const appointment = await appointmentService.create({
    customerId: customer.id,
    employeeId: selectedUser.id,
    startAt: preferredDateTime.start,
    endAt: preferredDateTime.end,
    title: 'AI Scheduled Appointment'
  });
  
  // 5. Her iki tarafa da bildirim gönder
  await notificationService.notifyUser(selectedUser, appointment);
  await notificationService.notifyCustomer(customer, appointment);
  
  // 6. Ticket güncelle
  await ticketService.updateStatus(ticketId, TicketStatus.APPOINTMENT_CONFIRMED);
  
  return appointment;
}
```

## Ticket Ekranı Entegrasyonu

### UI Butonları

Ticket detay sayfasında şunları ekleyin:

```typescript
// src/features/tickets/components/ticket-detail-actions.tsx

{ticket.source === 'WHATSAPP' && (
  <Button onClick={() => showWhatsAppLog(ticket.id)}>
    <MessageCircle className="w-4 h-4" />
    Sohbet Geçmişi
  </Button>
)}

{ticket.source === 'PHONE' && (
  <Button onClick={() => playAudioRecording(ticket.id)}>
    <Phone className="w-4 h-4" />
    Ses Kaydını Dinle
  </Button>
)}

{ticket.source === 'EMAIL' && (
  <Button onClick={() => showOriginalEmail(ticket.id)}>
    <Mail className="w-4 h-4" />
    Orjinal Maili Gör
  </Button>
)}

{ticket.source === 'WEB_CHAT' && (
  <Button onClick={() => showChatHistory(ticket.id)}>
    <MessageSquare className="w-4 h-4" />
    Sohbet Geçmişi
  </Button>
)}
```

### API Endpoints

```typescript
// src/app/api/tickets/[id]/conversation-log/route.ts
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const log = await prisma.aIConversationLog.findUnique({
    where: { ticketId: params.id },
    include: {
      whatsappMessages: true,
      phoneCalls: true,
      webChatSessions: true
    }
  });
  
  return Response.json(log);
}
```

## AI Model Konfigürasyonu

```typescript
// src/features/ai/config/ai-config.ts

export const AI_CONFIG = {
  openai: {
    model: 'gpt-4o',
    temperature: 0.7,
    maxTokens: 1000
  },
  intents: {
    confidenceThreshold: 0.8,
    maxRetries: 3
  },
  channels: {
    whatsapp: {
      enabled: true,
      autoResponse: true,
      responseDelay: 2000 // ms
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
      processingInterval: 300000 // 5 minutes
    }
  }
};
```

## Uygulama Adımları

### Faz 1: Temel Altyapı
1. Database schema güncellemeleri
2. Base channel interface oluşturma
3. AI orchestrator implementasyonu
4. Konuşma loglama sistemi

### Faz 2: WhatsApp Entegrasyonu
1. WhatsApp webhook endpoint
2. WhatsApp adapter
3. WhatsApp mesaj işleme
4. Ticket ekranı entegrasyonu

### Faz 3: Telefon Entegrasyonu
1. Telefon API entegrasyonu (Twilio/Babel)
2. Ses kayıt sistemi
3. Voice-to-text
4. Phone call loglama

### Faz 4: Web Chat & Email
1. Web chat widget
2. Email processor güncelleme
3. Unified conversation log

### Faz 5: AI Optimizasyonu
1. Intent classification training
2. Entity extraction iyileştirme
3. Response template tuning
4. Analytics dashboard

## Güvenlik ve Best Practices

1. **API Key Management**: Environment variables kullan
2. **Rate Limiting**: Her kanal için rate limiting
3. **Data Privacy**: GDPR uyumlu loglama
4. **Fallback Mechanism**: AI başarısız olduğunda manuel devreye alma
5. **Human Review**: Kritik işlemler için onay mekanizması
6. **Audit Trail**: Tüm AI işlemlerini logla

## Özet

Bu mimari:
- ✅ Generic channel adapter yapısı ile yeni kanalları kolay ekler
- ✅ Tek bir AI orchestrator ile tüm kanalları yönetir
- ✅ Unified conversation logging ile tüm logları merkezi tutar
- ✅ Ticket ile ilişkilendirilmiş loglar için UI entegrasyonu sağlar
- ✅ Müşteri oluşturma, ticket oluşturma ve randevu planlama iş akışlarını içerir
- ✅ Hem kullanıcıyı hem müşteriyi bilgilendirir
- ✅ Mevcut schema ile uyumlu ve genişletilebilir
