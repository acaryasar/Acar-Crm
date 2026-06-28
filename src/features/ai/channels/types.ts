import { TicketSource } from '@prisma/client';

export interface IncomingMessage {
  id: string;
  channelType: TicketSource;
  from: string;
  to?: string;
  content: string;
  timestamp: Date;
  metadata?: Record<string, any>;
  media?: Media[];
}

export interface Media {
  type: 'image' | 'audio' | 'video' | 'document';
  url: string;
  mimeType?: string;
  filename?: string;
}

export interface OutgoingMessage {
  to: string;
  content: string;
  media?: Media[];
  metadata?: Record<string, any>;
}

export interface ConversationHistory {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  media?: Media[];
}

export interface ChannelConfig {
  enabled: boolean;
  autoResponse: boolean;
  responseDelay?: number;
  maxRetries?: number;
}

export enum Intent {
  NEW_CUSTOMER_INQUIRY = 'NEW_CUSTOMER_INQUIRY',
  EXISTING_CUSTOMER_FOLLOWUP = 'EXISTING_CUSTOMER_FOLLOWUP',
  APPOINTMENT_REQUEST = 'APPOINTMENT_REQUEST',
  URGENT_ISSUE = 'URGENT_ISSUE',
  GENERAL_QUESTION = 'GENERAL_QUESTION',
  UNKNOWN = 'UNKNOWN'
}

export interface IntentResult {
  intent: Intent;
  confidence: number;
  entities: Record<string, any>;
}

export interface CustomerInfo {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  street?: string;
  city?: string;
  postalCode?: string;
}

export interface AppointmentRequest {
  preferredStartAt: Date;
  preferredEndAt: Date;
  category?: string;
  description?: string;
}
