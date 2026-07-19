"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Clock, AlertCircle, Calendar } from "lucide-react";

export function EmployeeTasks() {
  const tasks = [
    {
      id: "1",
      title: "Müşteri toplantısı hazırlığı",
      status: "pending",
      dueDate: new Date("2026-07-20"),
    },
    {
      id: "2",
      title: "Rapor gönderimi",
      status: "in_progress",
      dueDate: new Date("2026-07-19"),
    },
    {
      id: "3",
      title: "Proje sunumu",
      status: "completed",
      dueDate: new Date("2026-07-18"),
    },
    {
      id: "4",
      title: "Eğitim tamamlama",
      status: "overdue",
      dueDate: new Date("2026-07-17"),
    },
  ];

  const statusIcons: Record<string, any> = {
    pending: Clock,
    in_progress: AlertCircle,
    completed: CheckCircle2,
    overdue: AlertCircle,
  };

  const statusColors: Record<string, string> = {
    pending: "text-amber-500 bg-amber-50",
    in_progress: "text-blue-500 bg-blue-50",
    completed: "text-emerald-500 bg-emerald-50",
    overdue: "text-red-500 bg-red-50",
  };

  const statusLabels: Record<string, string> = {
    pending: "Beklemede",
    in_progress: "Devam Ediyor",
    completed: "Tamamlandı",
    overdue: "Gecikmiş",
  };

  return (
    <Card className="border-slate-100 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
          Görevler
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {tasks.map((task) => {
            const StatusIcon = statusIcons[task.status];
            return (
              <div
                key={task.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100"
              >
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${statusColors[task.status]}`}>
                  <StatusIcon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">{task.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[task.status]}`}>
                      {statusLabels[task.status]}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <Calendar size={10} />
                      {task.dueDate.toLocaleDateString("tr-TR")}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
