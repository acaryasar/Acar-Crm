"use client";

import { useTranslations } from "next-intl";

interface Props {
  status: string;
}

export function TicketStatusBadge({
  status,
}: Props) {
  const t = useTranslations("tickets.statuses");

  const colors = {
    NEW: "bg-slate-100 text-slate-700",
    ASSIGNED: "bg-blue-100 text-blue-700",
    IN_PROGRESS: "bg-yellow-100 text-yellow-700",
    COMPLETED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
    APPOINTMENT_CONFIRMED: "bg-emerald-100 text-emerald-700",
    APPOINTMENT_CANCELLED: "bg-red-100 text-red-700",
  };

  return (
    <span className={`px-2.5 text-xs py-1 rounded-full font-medium ${colors[status as keyof typeof colors] || "bg-gray-100 text-gray-700"}`}>
      {t(status as keyof typeof t)}
    </span>

  );
}
