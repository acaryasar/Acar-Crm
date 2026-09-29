import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { AIOrchestrator } from '@/features/ai/core/ai-orchestrator';
import { IncomingMessage } from '@/features/ai/channels/types';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

// WhatsApp webhook verification (Meta requirement)
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

  // No hardcoded fallback: a guessable default token would let anyone pass
  // Meta's verification handshake. If it isn't configured, refuse instead.
  if (!VERIFY_TOKEN) {
    console.error('WHATSAPP_VERIFY_TOKEN is not set; refusing webhook verification.');
    return new NextResponse('Server misconfigured', { status: 500 });
  }

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }

  return new NextResponse('Forbidden', { status: 403 });
}

function isValidSignature(rawBody: string, signatureHeader: string | null, appSecret: string): boolean {
  if (!signatureHeader || !signatureHeader.startsWith('sha256=')) {
    return false;
  }

  const expected =
    'sha256=' +
    crypto.createHmac('sha256', appSecret).update(rawBody, 'utf8').digest('hex');

  const expectedBuf = Buffer.from(expected, 'utf8');
  const receivedBuf = Buffer.from(signatureHeader, 'utf8');

  if (expectedBuf.length !== receivedBuf.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuf, receivedBuf);
}

// WhatsApp webhook - incoming messages
export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rate = checkRateLimit(`whatsapp-webhook:${ip}`, 120, 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const rawBody = await req.text();
    const appSecret = process.env.WHATSAPP_APP_SECRET;

    if (appSecret) {
      const signature = req.headers.get('x-hub-signature-256');
      if (!isValidSignature(rawBody, signature, appSecret)) {
        console.warn('WhatsApp webhook: invalid or missing X-Hub-Signature-256, rejecting request.');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    } else {
      // Without WHATSAPP_APP_SECRET, anyone can POST forged "WhatsApp
      // messages" here. This is acceptable only for local/demo use.
      console.warn(
        'WHATSAPP_APP_SECRET is not set; webhook signature verification is DISABLED. ' +
          'Do not run production traffic like this — see docs/guvenlik-inceleme-raporu-2026-09-10.md #3.1.'
      );
    }

    const body = JSON.parse(rawBody);

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
  await orchestrator.processMessage(incomingMessage);
}
