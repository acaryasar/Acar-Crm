import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // AI Conversation Log'u al
    const conversationLog = await prisma.aIConversationLog.findUnique({
      where: { ticketId: id },
      include: {
        whatsappMessages: {
          orderBy: { createdAt: 'asc' }
        },
        phoneCalls: true,
        webChatSessions: {
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!conversationLog) {
      // Return empty data instead of 404
      return NextResponse.json({
        whatsappMessages: [],
        phoneCalls: [],
        webChatSessions: []
      });
    }

    return NextResponse.json(conversationLog);
  } catch (error) {
    console.error('Error fetching conversation log:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
