import { NextResponse } from "next/server";

import { openai } from "@/features/ai/services/openai.service";
import { buildSystemPrompt } from "@/features/ai/services/prompt.service";

export async function POST(req: Request) {
  try {
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
