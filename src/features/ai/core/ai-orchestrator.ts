import { IChannelAdapter } from '../channels/base-channel.adapter';
import { IncomingMessage, OutgoingMessage, IntentResult, CustomerInfo, AppointmentRequest } from '../channels/types';
import { ConversationLogger } from '../logging/conversation-logger';
import { prisma } from '@/lib/prisma';

export class AIOrchestrator {
  private channels: Map<string, IChannelAdapter>;
  private intentProcessor: any;
  private entityExtractor: any;
  private responseGenerator: any;
  private conversationLogger: ConversationLogger;
  private customerResolutionService: any;
  private ticketCreationService: any;
  private appointmentSchedulerService: any;
  private notificationService: any;
  private companyId: string;

  constructor() {
    this.channels = new Map();
    this.conversationLogger = new ConversationLogger();
    this.companyId = '';

    // Lazy load services
    this.intentProcessor = null;
    this.entityExtractor = null;
    this.responseGenerator = null;
    this.customerResolutionService = null;
    this.ticketCreationService = null;
    this.appointmentSchedulerService = null;
    this.notificationService = null;
  }

  private async initServices() {
    if (!this.intentProcessor) {
      const { IntentProcessor } = await import('./intent-processor');
      this.intentProcessor = new IntentProcessor();
    }
    if (!this.entityExtractor) {
      const { EntityExtractor } = await import('./entity-extractor');
      this.entityExtractor = new EntityExtractor();
    }
    if (!this.responseGenerator) {
      const { ResponseGenerator } = await import('./response-generator');
      this.responseGenerator = new ResponseGenerator();
    }
    if (!this.customerResolutionService) {
      const { CustomerResolutionService } = await import('../services/customer-resolution.service');
      this.customerResolutionService = new CustomerResolutionService();
    }
    if (!this.ticketCreationService) {
      const { TicketCreationService } = await import('../services/ticket-creation.service');
      this.ticketCreationService = new TicketCreationService();
    }
    if (!this.appointmentSchedulerService) {
      const { AppointmentSchedulerService } = await import('../services/appointment-scheduler.service');
      this.appointmentSchedulerService = new AppointmentSchedulerService();
    }
    if (!this.notificationService) {
      const { NotificationService } = await import('../services/notification.service');
      this.notificationService = new NotificationService();
    }
  }

  /**
   * Kanal kaydet
   */
  registerChannel(channel: IChannelAdapter): void {
    this.channels.set(channel.channelType, channel);
  }

  /**
   * Kanal al
   */
  getChannel(channelType: string): IChannelAdapter | undefined {
    return this.channels.get(channelType);
  }

  /**
   * Gelen mesajı işle
   */
  async processMessage(message: IncomingMessage, companyId: string): Promise<void> {
    try {
      this.companyId = companyId;
      await this.initServices();

      const channel = this.getChannel(message.channelType);
      if (!channel || !channel.isActive()) {
        console.log(`Channel ${message.channelType} is not active`);
        return;
      }

      // 1. Konuşmayı logla
      await this.conversationLogger.logIncomingMessage(message, companyId);

      // 2. Intent belirle
      const intentResult = await this.intentProcessor.process(message);
      console.log('Intent:', intentResult);

      // 3. Entity'leri çıkar
      const entities = await this.entityExtractor.extract(message, intentResult);
      console.log('Entities:', entities);

      // 4. İş mantığına göre aksiyon al
      const response = await this.handleIntent(message, intentResult, entities, companyId);

      // 5. Cevabı gönder
      if (response && channel.getConfig().autoResponse) {
        const delay = channel.getConfig().responseDelay || 0;
        setTimeout(async () => {
          await channel.sendMessage(response);
          await this.conversationLogger.logOutgoingMessage(response, message.channelType, companyId);
        }, delay);
      }

    } catch (error) {
      console.error('Error processing message:', error);
      // Hata durumunda manuel müdahale için ticket oluştur
      await this.initServices();
      await this.ticketCreationService.createErrorTicket(message, companyId);
    }
  }

  /**
   * Intent'e göre aksiyon al
   */
  private async handleIntent(
    message: IncomingMessage,
    intentResult: IntentResult,
    entities: Record<string, any>,
    companyId: string
  ): Promise<OutgoingMessage | null> {
    const { intent, confidence } = intentResult;

    // Confidence düşükse insan müdahalesi iste
    if (confidence < 0.7) {
      await this.ticketCreationService.createManualReviewTicket(message, intentResult, companyId);
      return this.responseGenerator.generateLowConfidenceResponse(message);
    }

    switch (intent) {
      case 'NEW_CUSTOMER_INQUIRY':
        return await this.handleNewCustomerInquiry(message, entities, companyId);

      case 'EXISTING_CUSTOMER_FOLLOWUP':
        return await this.handleExistingCustomerFollowup(message, entities, companyId);

      case 'APPOINTMENT_REQUEST':
        return await this.handleAppointmentRequest(message, entities, companyId);

      case 'URGENT_ISSUE':
        return await this.handleUrgentIssue(message, entities, companyId);

      case 'GENERAL_QUESTION':
        return await this.handleGeneralQuestion(message, entities, companyId);

      default:
        return await this.handleUnknownIntent(message, companyId);
    }
  }

  /**
   * Yeni müşteri sorgusunu işle
   */
  private async handleNewCustomerInquiry(
    message: IncomingMessage,
    entities: Record<string, any>,
    companyId: string
  ): Promise<OutgoingMessage> {
    // Mevcut müşteriyi ara
    const existingCustomer = await this.customerResolutionService.findCustomer(
      message.from,
      companyId
    );

    if (existingCustomer) {
      // Mevcut müşteri varsa follow-up'a yönlendir
      return await this.handleExistingCustomerFollowup(message, entities, companyId);
    }

    // Eksik bilgileri topla
    const missingInfo = this.customerResolutionService.getMissingCustomerInfo(entities);
    
    if (missingInfo.length > 0) {
      return this.responseGenerator.generateCustomerInfoRequest(missingInfo);
    }

    // Yeni müşteri oluştur
    const customer = await this.customerResolutionService.createCustomer(
      entities as CustomerInfo,
      companyId
    );

    // Ticket oluştur
    const ticket = await this.ticketCreationService.createTicket({
      customerId: customer.id,
      companyId,
      title: 'Yeni Müşteri Kaydı',
      description: message.content,
      source: message.channelType,
      category: 'OTHER',
      priority: 'MEDIUM'
    });

    // Konuşma logunu ticket ile ilişkilendir
    await this.conversationLogger.linkToTicket(message.id, ticket.id);

    return this.responseGenerator.generateCustomerCreatedResponse(customer);
  }

  /**
   * Mevcut müşteri follow-up'ı işle
   */
  private async handleExistingCustomerFollowup(
    message: IncomingMessage,
    entities: Record<string, any>,
    companyId: string
  ): Promise<OutgoingMessage> {
    const customer = await this.customerResolutionService.findCustomer(message.from, companyId);
    
    if (!customer) {
      return await this.handleNewCustomerInquiry(message, entities, companyId);
    }

    // Ticket oluştur
    const ticket = await this.ticketCreationService.createTicket({
      customerId: customer.id,
      companyId,
      title: 'Müşteri Follow-up',
      description: message.content,
      source: message.channelType,
      category: 'OTHER',
      priority: 'MEDIUM'
    });

    // Konuşma logunu ticket ile ilişkilendir
    await this.conversationLogger.linkToTicket(message.id, ticket.id);

    return this.responseGenerator.generateFollowupResponse(customer);
  }

  /**
   * Randevu talebini işle
   */
  private async handleAppointmentRequest(
    message: IncomingMessage,
    entities: Record<string, any>,
    companyId: string
  ): Promise<OutgoingMessage> {
    const customer = await this.customerResolutionService.findCustomer(message.from, companyId);
    
    if (!customer) {
      // Önce müşteri oluştur
      await this.handleNewCustomerInquiry(message, entities, companyId);
      return this.responseGenerator.generateAppointmentRequestAfterCustomerCreation();
    }

    // Tarih bilgisi eksikse sor
    if (!entities.preferredStartAt || !entities.preferredEndAt) {
      return this.responseGenerator.generateDateTimeRequest();
    }

    // Müsait kullanıcıları bul
    const availableUsers = await this.appointmentSchedulerService.findAvailableUsers(
      entities.preferredStartAt,
      entities.preferredEndAt,
      companyId
    );

    if (availableUsers.length === 0) {
      return this.responseGenerator.generateNoAvailableUsersResponse();
    }

    // En uygun kullanıcıyı seç
    const selectedUser = await this.appointmentSchedulerService.selectBestUser(
      availableUsers,
      customer,
      entities
    );

    // Randevu oluştur
    const appointment = await this.appointmentSchedulerService.createAppointment({
      customerId: customer.id,
      employeeId: selectedUser.id,
      companyId: this.companyId,
      startAt: entities.preferredStartAt,
      endAt: entities.preferredEndAt,
      title: entities.category || 'Randevu',
      description: entities.description || message.content
    });

    // Ticket oluştur ve güncelle
    const ticket = await this.ticketCreationService.createTicket({
      customerId: customer.id,
      companyId,
      title: 'Randevu Talebi',
      description: message.content,
      source: message.channelType,
      category: entities.category || 'OTHER',
      priority: 'MEDIUM',
      assignedUserId: selectedUser.id
    });

    await this.ticketCreationService.updateTicketStatus(ticket.id, 'APPOINTMENT_CONFIRMED');

    // Konuşma logunu ticket ile ilişkilendir
    await this.conversationLogger.linkToTicket(message.id, ticket.id);

    // Bildirimler gönder
    await this.notificationService.notifyUser(selectedUser, appointment);
    await this.notificationService.notifyCustomer(customer, appointment, message.channelType);

    return this.responseGenerator.generateAppointmentConfirmationResponse(appointment, selectedUser);
  }

  /**
   * Acil durumu işle
   */
  private async handleUrgentIssue(
    message: IncomingMessage,
    entities: Record<string, any>,
    companyId: string
  ): Promise<OutgoingMessage> {
    const customer = await this.customerResolutionService.findCustomer(message.from, companyId);
    
    if (!customer) {
      await this.handleNewCustomerInquiry(message, entities, companyId);
    }

    // Yüksek öncelikli ticket oluştur
    const ticket = await this.ticketCreationService.createTicket({
      customerId: customer?.id || '',
      companyId,
      title: 'Acil Durum',
      description: message.content,
      source: message.channelType,
      category: entities.category || 'OTHER',
      priority: 'URGENT'
    });

    // Konuşma logunu ticket ile ilişkilendir
    await this.conversationLogger.linkToTicket(message.id, ticket.id);

    // Müsait bir kullanıcıya ata
    const availableUser = await this.appointmentSchedulerService.findAvailableUsers(
      new Date(),
      new Date(Date.now() + 3600000), // 1 saat
      companyId
    );

    if (availableUser.length > 0) {
      await this.ticketCreationService.assignTicket(ticket.id, availableUser[0].id);
      await this.notificationService.notifyUrgentTicket(availableUser[0], ticket);
    }

    return this.responseGenerator.generateUrgentIssueResponse(ticket);
  }

  /**
   * Genel soruyu işle
   */
  private async handleGeneralQuestion(
    message: IncomingMessage,
    entities: Record<string, any>,
    companyId: string
  ): Promise<OutgoingMessage> {
    // AI ile cevap oluştur
    const answer = await this.responseGenerator.generateAIResponse(message.content);
    
    return {
      to: message.from,
      content: answer
    };
  }

  /**
   * Bilinmeyen intent'i işle
   */
  private async handleUnknownIntent(
    message: IncomingMessage,
    companyId: string
  ): Promise<OutgoingMessage> {
    // Manuel inceleme için ticket oluştur
    await this.ticketCreationService.createManualReviewTicket(message, null, companyId);
    
    return this.responseGenerator.generateUnknownIntentResponse();
  }
}
