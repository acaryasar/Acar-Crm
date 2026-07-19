import { requireRole } from "@/lib/auth-guard";
import { PhoneCallDemoChat } from "./phone-call-demo-chat";

export default async function PhoneCallDemoPage({
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
        <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            {ticketId ? "Telefon Araması Geçmişi" : "Phone Call AI"}
          </h1>
          <p className="text-sm text-slate-500">
            {ticketId ? "Ticket ile ilişkili telefon aramaları" : "AI ile Telefon Asistanı"}
          </p>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <PhoneCallDemoChat ticketId={ticketId} />
      </div>
    </div>
  );
}
