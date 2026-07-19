import { NextRequest, NextResponse } from 'next/server';
import { AIOrchestrator } from '@/features/ai/core/ai-orchestrator';
import { IncomingMessage } from '@/features/ai/channels/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, sessionId, customerEmail, customerName } = body;

    // Web chat session oluştur veya güncelle
    const { prisma } = await import('@/lib/prisma');
    const session = await prisma.webChatSession.upsert({
      where: { sessionId: sessionId || `session_${Date.now()}` },
      update: {
        updatedAt: new Date(),
        status: 'ACTIVE'
      },
      create: {
        sessionId: sessionId || `session_${Date.now()}`,
        customerEmail,
        customerName,
        status: 'ACTIVE',
        ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown'
      }
    });

    // IncomingMessage oluştur
    const incomingMessage: IncomingMessage = {
      id: `web_${Date.now()}`,
      channelType: 'WEB_CHAT' as any,
      from: customerEmail || 'anonymous',
      content: message,
      timestamp: new Date(),
      metadata: {
        sessionId: session.sessionId,
        customerEmail,
        customerName
      }
    };

    // AI Orchestrator ile işle
    const orchestrator = new AIOrchestrator();
    await orchestrator.processMessage(incomingMessage);

    // Basit cevap döndür (gerçek implementasyon orchestrator'dan gelecek)
    return NextResponse.json({
      reply: 'Mesajınız alındı. Size en kısa sürede yardımcı olacağım.',
      sessionId: session.sessionId
    });
  } catch (error) {
    console.error('Web chat error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
