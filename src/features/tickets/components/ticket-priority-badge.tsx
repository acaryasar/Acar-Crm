"use client";

import { useTranslations } from "next-intl";

interface Props {
  priority: string;
}

export function TicketPriorityBadge({
  priority,
}: Props) {
  const t = useTranslations("tickets.priorities");

  const colors = {
    LOW: "bg-slate-100 text-slate-700",
    MEDIUM: "bg-blue-100 text-blue-700",
    HIGH: "bg-orange-100 text-orange-700",
    URGENT: "bg-red-100 text-red-700",
  };

  return (
    <span className={`px-2.5   text-xs py-1 rounded-full font-medium ${colors[priority as keyof typeof colors]}`}>
      {t(priority as keyof typeof t)}
    </span>

  );
}