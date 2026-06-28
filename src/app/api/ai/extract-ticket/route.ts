import { NextResponse } from "next/server";

import {
  extractTicket,
} from "@/features/ai/services/ticket-extraction.service";

export async function POST(
  req: Request
) {
  const body = await req.json();

  const ticket =
    await extractTicket(body.text);

  return NextResponse.json(ticket);
}