"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

import { TicketSourceBadge, }   from "./ticket-source-badge";
import { TicketPriorityBadge, } from "./ticket-priority-badge";
import { TicketStatusBadge, }   from "./ticket-status-badge";
import { TicketAiSummary,}      from "./ticket-ai-summary";
import { TicketAiActions, }     from "./ticket-ai-actions";
import { getSourceConfig }      from "@/features/tickets/utils";

export function TicketCard({
  ticket,
}: any) {

  const t = useTranslations("tickets");
  const sourceConfig = getSourceConfig(ticket.source);

  return (
    <Link href={`/tickets?mode=view&id=${ticket.id}`}
      className={`block bg-white rounded-xl border p-5 shadow-sm hover:shadow-md transition border-l-4 ${sourceConfig.border}`}>
      <div className="flex justify-between gap-6">
        <div className="flex-1 space-y-3">
          <div className="flex items-center space-x-3">
            <TicketSourceBadge source={ticket.source}/>

            <span className="text-xs bg-slate-100 px-2 py-1 rounded">
              {ticket.id.slice(0, 8)}
            </span>

            <TicketPriorityBadge priority={ticket.priority}/>
          </div>

          <div>
            <h3 className="font-bold text-lg">
              {t("customer")} : {ticket.customer ? `${ticket.customer.firstName} ${ticket.customer.lastName}` : t("noCustomer")}
            </h3>

            <p className="text-indigo-600 font-medium">
              {t("tickettitle")} : {ticket.title}
            </p>

            {ticket.assignedUser && (
              <div className="mt-2">
                <p className="text-sm text-slate-600">
                  {ticket.assignedUser.firstName} {ticket.assignedUser.lastName}
                </p>
                <p className="text-xs text-slate-500">
                  Usta
                </p>
              </div>
            )}
          </div>         

          <TicketAiSummary summary={ticket.aiSummary}/>
        </div>

        <div className="min-w-[180px] flex flex-col items-end justify-between gap-2">
          <TicketStatusBadge status={ticket.status} />

          <div className="text-xs text-slate-400">
            {new Date(ticket.createdAt).toLocaleDateString()}
          </div>
          <TicketAiActions ticket={ticket} />
        </div>
      </div>
    </Link>
  );
}

