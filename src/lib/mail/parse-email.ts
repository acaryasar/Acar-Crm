import { simpleParser } from "mailparser";

export async function parseEmail(
  raw: string
) {
  return simpleParser(raw);
}