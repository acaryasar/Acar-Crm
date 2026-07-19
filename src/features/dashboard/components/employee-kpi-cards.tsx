"use client";

import { UserRound, Ticket, Calendar, Target, DollarSign, TrendingUp } from "lucide-react";
import Link from "next/link";

export function EmployeeKPICards() {
  const kpis = [
    { label: "Müşteriler", value: 124, icon: UserRound, color: "text-indigo-600 bg-indigo-50", href: "/customers" },
    { label: "Ticketlar", value: 28, icon: Ticket, color: "text-orange-600 bg-orange-50", href: "/tickets" },
    { label: "Randevular", value: 12, icon: Calendar, color: "text-emerald-600 bg-emerald-50", href: "/appointments" },
    { label: "Hedef", value: "%75", icon: Target, color: "text-blue-600 bg-blue-50", href: "/targets" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {kpis.map(({ label, value, icon: Icon, color, href }) => (
        <Link key={label} href={href} className="rounded-xl bg-white px-5 py-4 shadow-sm border border-slate-100 flex items-center gap-4 hover:border-slate-300 transition-colors group">
          <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
            <Icon size={20} />
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
            <p className="text-2xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{value}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
