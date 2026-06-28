import { imapClient } from "./client";
import { simpleParser, type ParsedMail } from "mailparser";

export async function fetchEmails(): Promise<ParsedMail[]> {
  await imapClient.connect();
  await imapClient.mailboxOpen("INBOX");

  const emails: ParsedMail[] = [];

  for await (const message of imapClient.fetch("1:*", { source: true })) {
    if (!message.source) {
      continue;
    }

    const parsed = await simpleParser(message.source);
    emails.push(parsed);
  }

  await imapClient.logout();

  return emails;
}
