"use client";

import { useTranslations } from "next-intl";

interface Props {
  summary: string | null;
}

export function TicketAiSummary({
  summary,
}: Props) {
  const t = useTranslations("tickets");

  if (!summary) { return null; }

  return (
    <div className="bg-slate-50 border rounded-lg p-3 text-sm text-slate-700">
      <strong>{t("aiSummary")}</strong>{" "}
      {summary}
    </div>
  );
}