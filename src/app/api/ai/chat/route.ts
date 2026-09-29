import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { openai } from "@/features/ai/services/openai.service";
import { buildSystemPrompt } from "@/features/ai/services/prompt.service";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Each OpenAI call costs money; cap how often one account can call this.
    const rate = checkRateLimit(`ai-chat:${session.user.id}`, 30, 10 * 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = await req.json();

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: buildSystemPrompt() },
        { role: "user", content: body.message },
      ],
    });

    return NextResponse.json({
      answer: response.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ error: "AI request failed" }, { status: 500 });
  }
}
