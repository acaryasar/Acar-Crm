"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ticket, UserRound, Users, Calendar } from "lucide-react";
import Link from "next/link";

export function EmployeeRecentTickets() {
  const recentTickets = [
    {
      id: "1",
      title: "Yazılım Destek Talebi",
      status: "IN_PROGRESS",
      priority: "HIGH",
      customer: { firstName: "Ahmet", lastName: "Yılmaz" },
      assignedUser: { firstName: "Mehmet", lastName: "Demir" },
      createdAt: new Date("2026-07-15"),
    },
    {
      id: "2",
      title: "Sistem Entegrasyonu",
      status: "ASSIGNED",
      priority: "MEDIUM",
      customer: { firstName: "Ayşe", lastName: "Kaya" },
      assignedUser: { firstName: "Mehmet", lastName: "Demir" },
      createdAt: new Date("2026-07-14"),
    },
    {
      id: "3",
      title: "Veri Analizi Projesi",
      status: "NEW",
      priority: "LOW",
      customer: { firstName: "Ali", lastName: "Özkan" },
      assignedUser: null,
      createdAt: new Date("2026-07-13"),
    },
  ];

  const statusColors: Record<string, string> = {
    NEW: "bg-slate-100 text-slate-600",
    ASSIGNED: "bg-blue-100 text-blue-700",
    IN_PROGRESS: "bg-amber-100 text-amber-700",
    APPOINTMENT_CONFIRMED: "bg-green-100 text-green-700",
    APPOINTMENT_CANCELLED: "bg-red-100 text-red-700",
    COMPLETED: "bg-emerald-100 text-emerald-700",
    CANCELLED: "bg-red-100 text-red-700",
  };

  const priorityColors: Record<string, string> = {
    LOW: "text-slate-400",
    MEDIUM: "text-amber-500",
    HIGH: "text-orange-500",
    URGENT: "text-red-500",
  };

  const statusLabels: Record<string, string> = {
    NEW: "Yeni",
    ASSIGNED: "Atandı",
    IN_PROGRESS: "Devam Ediyor",
    APPOINTMENT_CONFIRMED: "Randevu Onaylandı",
    APPOINTMENT_CANCELLED: "Randevu İptal",
    COMPLETED: "Tamamlandı",
    CANCELLED: "İptal",
  };

  const priorityLabels: Record<string, string> = {
    LOW: "Düşük",
    MEDIUM: "Orta",
    HIGH: "Yüksek",
    URGENT: "Acil",
  };

  return (
    <Card className="border-slate-100 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
            Son Ticketlar
          </CardTitle>
          <Link href="/tickets" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
            Tümünü Gör
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {recentTickets.map((ticket) => (
            <Link
              key={ticket.id}
              href={`/tickets?mode=view&id=${ticket.id}`}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group border border-transparent hover:border-slate-100"
            >
              <div
                className="h-2 w-2 rounded-full shrink-0"
                style={{
                  backgroundColor:
                    ticket.priority === "URGENT"
                      ? "#ef4444"
                      : ticket.priority === "HIGH"
                      ? "#f97316"
                      : ticket.priority === "MEDIUM"
                      ? "#f59e0b"
                      : "#94a3b8",
                }}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium text-slate-700 truncate group-hover:text-indigo-600 transition-colors">
                    {ticket.title}
                  </p>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
                      statusColors[ticket.status] || statusColors.NEW
                    }`}
                  >
                    {statusLabels[ticket.status] || ticket.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  {ticket.customer && (
                    <span className="flex items-center gap-1">
                      <UserRound size={12} />
                      {ticket.customer.firstName} {ticket.customer.lastName}
                    </span>
                  )}
                  {ticket.assignedUser && (
                    <span className="flex items-center gap-1">
                      <Users size={12} />
                      {ticket.assignedUser.firstName} {ticket.assignedUser.lastName}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {ticket.createdAt.toLocaleDateString("tr-TR")}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
