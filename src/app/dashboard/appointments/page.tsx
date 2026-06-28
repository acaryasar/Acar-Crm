import { DailyTimeline } from "@/features/appointments/components/daily-timeline";
import { Calendar } from "lucide-react";

export default function AppointmentsPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center">
          <Calendar size={20} className="text-emerald-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Appointments</h1>
          <p className="text-sm text-slate-500">Schedule and track appointments</p>
        </div>
      </div>

      <DailyTimeline />
    </div>
  );
}
