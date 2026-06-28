import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { WhatsAppAgent } from "@/features/ai/services/whatsapp-agent.service";
import { AIProviderConfig } from "@/features/ai/providers/base-provider";

interface DemoSession {
  agent: WhatsAppAgent;
  conversationLogId?: string;
  phoneNumber?: string;
}

const sessions = new Map<string, DemoSession>();

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const companyId = (session?.user as any)?.companyId;

    if (!companyId) {
      return NextResponse.json({ error: "Unauthorized - No company ID found" }, { status: 401 });
    }

    const { message, sessionId, reset } = await req.json();

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 });
    }

    // Handle reset
    if (reset) {
      const demoSession = sessions.get(sessionId);
      if (demoSession) {
        demoSession.agent.reset();
      }
      sessions.delete(sessionId);
      return NextResponse.json({ answer: "Oturum sıfırlandı. Yeni bir konuşma başlatabilirsiniz." });
    }

    // Get or create session
    let demoSession = sessions.get(sessionId);
    if (!demoSession) {
      // Create conversation log for new session
      const conversationLog = await prisma.aIConversationLog.create({
        data: {
          companyId,
          channelType: "WHATSAPP",
          conversationType: "INITIAL_INQUIRY",
          startTime: new Date(),
        }
      });

      // Create AI provider config based on environment
      const aiConfig: AIProviderConfig = {
        type: (process.env.AI_PROVIDER as any) || 'mock',
        baseURL: process.env.OLLAMA_BASE_URL,
        model: process.env.OLLAMA_MODEL,
      };

      demoSession = {
        agent: new WhatsAppAgent(companyId, aiConfig),
        conversationLogId: conversationLog.id,
        phoneNumber: `+90${Math.floor(Math.random() * 1000000000)}`, // Random phone for demo
      };
      sessions.set(sessionId, demoSession);
    }

    // Save user message to WhatsAppMessage
    try {
      await prisma.whatsAppMessage.create({
        data: {
          companyId,
          conversationLogId: demoSession.conversationLogId,
          phoneNumber: demoSession.phoneNumber || "+905555555555",
          messageFrom: "customer",
          content: message,
          whatsappMessageId: `demo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        }
      });
    } catch (dbError) {
      console.error("Error saving user message to WhatsAppMessage:", dbError);
    }

    // Process message with AI agent
    const response = await demoSession.agent.processMessage(message);

    // Save AI response to WhatsAppMessage
    try {
      await prisma.whatsAppMessage.create({
        data: {
          companyId,
          conversationLogId: demoSession.conversationLogId,
          phoneNumber: demoSession.phoneNumber || "+905555555555",
          messageFrom: "assistant",
          content: response,
          whatsappMessageId: `demo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        }
      });
    } catch (dbError) {
      console.error("Error saving AI response to WhatsAppMessage:", dbError);
    }

    // Update conversation log if ticket was created
    const agentState = demoSession.agent.getState();
    if (agentState.ticketId && demoSession.conversationLogId) {
      try {
        await prisma.aIConversationLog.update({
          where: { id: demoSession.conversationLogId },
          data: {
            ticketId: agentState.ticketId,
            conversationType: "APPOINTMENT_SCHEDULING",
          }
        });
      } catch (error) {
        console.error("Error updating conversation log:", error);
      }
    }

    return NextResponse.json({ 
      answer: response,
      state: agentState 
    });
  } catch (error) {
    console.error("Error in WhatsApp demo chat:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
