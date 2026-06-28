"use client";

import { useTranslations } from "next-intl";

interface Props { source: string;}

export function TicketSourceBadge({
  source,
}: Props) {
  const t = useTranslations("tickets.sources");

  const config = {
    PHONE: {
      label: t("PHONE"),
      className:
        "bg-blue-50 text-blue-700",
    },

    WHATSAPP: {
      label: t("WHATSAPP"),
      className:
        "bg-green-50 text-green-700",
    },

    EMAIL: {
      label: t("EMAIL"),
      className:
        "bg-purple-50 text-purple-700",
    },

    WEB: {
      label: t("WEB"),
      className:
        "bg-slate-100 text-slate-700",
    },
  };

  const item = config[source as keyof typeof config];

  return (
    <span className={`px-3 py-1 rounded-md text-xs font-bold ${item?.className}`}>
      {item?.label}
    </span>
  );
}