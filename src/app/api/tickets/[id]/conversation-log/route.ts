import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Bu görüşme kayıtları müşteri adı/telefonu/şikayet içeriği gibi hassas
    // verileri içerdiğinden yalnızca yetkili kullanıcılar erişebilmeli.
    const ticket = await prisma.ticket.findUnique({
      where: { id },
      select: { id: true, assignedUserId: true },
    });

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    const isPrivileged = session.user.role === 'ADMIN' || session.user.role === 'SUPERVISOR';

    if (!isPrivileged && ticket.assignedUserId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

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
