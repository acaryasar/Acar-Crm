import { ImapFlow } from "imapflow";

const host = process.env.IMAP_HOST || "";
const port = parseInt(process.env.IMAP_PORT || "993");
const user = process.env.IMAP_USER || "";
const password = process.env.IMAP_PASSWORD || "";

export const imapClient = new ImapFlow({
  host,
  port,
  secure: true,
  auth: {
    user,
    pass: password,
  },
  logger: false,
});
