import { requireRole } from "@/lib/auth-guard";
import { WebChatDemoChat } from "./web-chat-demo-chat";

export default async function WebChatDemoPage({
  searchParams,
}: {
  searchParams: Promise<{ ticketId?: string }>;
}) {
  const session = await requireRole(["ADMIN", "SUPERVISOR", "MANAGER", "EMPLOYEE"]);
  const params = await searchParams;
  const ticketId = params.ticketId;

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-3 mb-4 shrink-0">
        <div className="h-10 w-10 rounded-xl bg-orange-100 flex items-center justify-center">
          <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            {ticketId ? "Web Chat Geçmişi" : "Web-Chat AI"}
          </h1>
          <p className="text-sm text-slate-500">
            {ticketId ? "Ticket ile ilişkili web chat mesajları" : "AI ile Web Chat Asistanı"}
          </p>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <WebChatDemoChat ticketId={ticketId} />
      </div>
    </div>
  );
}
