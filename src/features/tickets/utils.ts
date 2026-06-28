export function getSourceConfig(source: string) {
  switch (source) {
    case "PHONE":
      return {
        label: "Telefon",
        badge: "bg-blue-50 text-blue-700",
        border: "border-l-blue-500",
      };

    case "WHATSAPP":
      return {
        label: "WhatsApp",
        badge: "bg-green-50 text-green-700",
        border: "border-l-green-500",
      };

    case "EMAIL":
      return {
        label: "Email",
        badge: "bg-purple-50 text-purple-700",
        border: "border-l-purple-500",
      };

    case "WEB_CHAT":
      return {
        label: "Web",
        badge: "bg-slate-100 text-slate-700",
        border: "border-l-slate-500",
      };

    default:
      return {
        label: source,
        badge: "bg-orange-50 text-orange-700",
        border: "border-l-orange-500",
      };
  }
}
