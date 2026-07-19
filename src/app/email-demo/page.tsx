import { requireRole } from "@/lib/auth-guard";
import { EmailDemoChat } from "./email-demo-chat";

export default async function EmailDemoPage({
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
        <div className="h-10 w-10 rounded-xl bg-purple-100 flex items-center justify-center">
          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            {ticketId ? "E-posta Geçmişi" : "Email AI"}
          </h1>
          <p className="text-sm text-slate-500">
            {ticketId ? "Ticket ile ilişkili e-postalar" : "AI ile E-posta Asistanı"}
          </p>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <EmailDemoChat ticketId={ticketId} />
      </div>
    </div>
  );
}
