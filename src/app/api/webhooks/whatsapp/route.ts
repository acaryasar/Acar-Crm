import { NextRequest, NextResponse } from 'next/server';
import { AIOrchestrator } from '@/features/ai/core/ai-orchestrator';
import { IncomingMessage } from '@/features/ai/channels/types';

// WhatsApp webhook verification (Meta requirement)
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'handwerk_verify_token';

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }

  return new NextResponse('Forbidden', { status: 403 });
}

// WhatsApp webhook - incoming messages
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // WhatsApp webhook structure validation
    if (!body.entry || !body.entry[0]?.changes) {
      return NextResponse.json({ status: 'ok' }, { status: 200 });
    }

    const changes = body.entry[0].changes;
    
    for (const change of changes) {
      if (change.field === 'messages') {
        const messages = change.value.messages;
        
        for (const message of messages) {
          // Process only text messages for now
          if (message.type === 'text') {
            await processWhatsAppMessage(message, change.value);
          }
        }
      }
    }

    return NextResponse.json({ status: 'ok' }, { status: 200 });
  } catch (error) {
    console.error('WhatsApp webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function processWhatsAppMessage(message: any, value: any) {
  const phoneNumber = message.from;
  const text = message.text.body;
  const messageId = message.id;
  const timestamp = new Date(parseInt(message.timestamp) * 1000);

  // Company ID'yi belirle (telefon numarasına göre veya default)
  const companyId = await getCompanyIdByPhone(phoneNumber);

  // IncomingMessage oluştur
  const incomingMessage: IncomingMessage = {
    id: messageId,
    channelType: 'WHATSAPP' as any,
    from: phoneNumber,
    to: value.metadata?.display_phone_number,
    content: text,
    timestamp,
    metadata: {
      whatsappMessageId: messageId,
      phoneNumber: phoneNumber
    }
  };

  // AI Orchestrator ile işle
  const orchestrator = new AIOrchestrator();
  await orchestrator.processMessage(incomingMessage, companyId);
}

async function getCompanyIdByPhone(phoneNumber: string): Promise<string> {
  // Basit implementasyon: İlk company'yi döndür
  // İleride telefon numarasına göre company mapping yapılabilir
  const { prisma } = await import('@/lib/prisma');
  const company = await prisma.company.findFirst({
    where: { is_active: true }
  });

  return company?.id || '';
}
