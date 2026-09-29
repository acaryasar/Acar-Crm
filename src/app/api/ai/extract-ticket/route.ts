import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import {
  extractTicket,
} from "@/features/ai/services/ticket-extraction.service";

export async function POST(
  req: Request
) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rate = checkRateLimit(`ai-extract-ticket:${session.user.id}`, 30, 10 * 60 * 1000);
  if (!rate.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await req.json();

  const ticket =
    await extractTicket(body.text);

  return NextResponse.json(ticket);
}
