"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { useTranslations } from "next-intl";

interface Ticket {
  id: string;
  title: string;
  status: string;
  priority: string;
}

interface Appointment {
  id: string;
  title: string;
  description: string | null;
  startAt: string;
  endAt: string;
  status: string;
  customer: {
    id: string;
    firstName: string;
    lastName: string;
  };
  tickets: Ticket[];
}

interface UserWithAppointments {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  appointments: Appointment[];
}

interface TimelineData {
  date: string;
  view: string;
  startDate?: string;
  endDate?: string;
  users: UserWithAppointments[];
}

export function DailyTimeline() {
  const t = useTranslations("appointments");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [timelineData, setTimelineData] = useState<TimelineData | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"day" | "week" | "month">("day");

  useEffect(() => {
    fetchTimelineData();
  }, [currentDate, view]);

  const fetchTimelineData = async () => {
    setLoading(true);
    try {
      const dateStr = currentDate.toISOString().split('T')[0];
      const response = await fetch(`/api/appointments/timeline?date=${dateStr}&view=${view}`);
      const data = await response.json();
      setTimelineData(data);
    } catch (error) {
      console.error("Failed to fetch timeline data:", error);
    } finally {
      setLoading(false);
    }
  };

  const goToPreviousDay = () => {
    setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 1)));
  };

  const goToNextDay = () => {
    setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 1)));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    if (!isNaN(newDate.getTime())) {
      setCurrentDate(newDate);
    }
  };

  const formatDisplayDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('tr-TR', options);
  };

  const formatInputDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getUserColor = (userId: string) => {
    // Generate a consistent color based on user ID
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500",
      "bg-orange-500",
      "bg-red-500",
      "bg-cyan-500",
      "bg-emerald-500",
    ];
    const hash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const getAppointmentColor = (status: string, userId: string) => {
    // Use user-based color coding
    return getUserColor(userId);
  };

  const getAppointmentPosition = (startAt: string, endAt: string) => {
    const start = new Date(startAt);
    const end = new Date(endAt);

    // Calculate position based on 8:00 to 18:00 timeline (10 hours, 20 half-hour slots minus 12:30)
    const dayStart = new Date(start);
    dayStart.setHours(8, 0, 0, 0);
    const dayEnd = new Date(start);
    dayEnd.setHours(18, 0, 0, 0);

    const totalMinutes = (dayEnd.getTime() - dayStart.getTime()) / (1000 * 60);
    const startMinutes = (start.getTime() - dayStart.getTime()) / (1000 * 60);
    const durationMinutes = (end.getTime() - start.getTime()) / (1000 * 60);

    // Each 30-minute slot is 50px
    const slotWidth = 50;
    let leftPixels = (startMinutes / 30) * slotWidth;
    const widthPixels = (durationMinutes / 30) * slotWidth;

    // Adjust for missing 12:30 slot (subtract 50px for appointments after 12:30)
    if (startMinutes > 270) { // 12:30 is 270 minutes after 8:00
      leftPixels -= slotWidth;
    }

    return { left: leftPixels, width: widthPixels };
  };

  const renderTimeHeader = () => {
    const slots = [];
    for (let hour = 8; hour <= 17; hour++) {
      // Hour slot
      slots.push(
        <div key={`${hour}-00`} className="flex-shrink-0 w-[50px] border-r border-slate-200 h-full">
          <div className="text-xs text-slate-500 text-center py-3 font-medium">
            {hour}:00
          </div>
        </div>
      );
      // Half-hour slot (skip 12:30 entirely)
      if (hour !== 12) {
        slots.push(
          <div key={`${hour}-30`} className="flex-shrink-0 w-[50px] border-r border-slate-200 h-full">
            <div className="text-xs text-slate-400 text-center py-3 font-medium">
              {hour}:30
            </div>
          </div>
        );
      }
    }
    // Final 18:00 slot
    slots.push(
      <div key="18-00" className="flex-shrink-0 w-[50px] border-r border-slate-200 h-full">
        <div className="text-xs text-slate-500 text-center py-3 font-medium">
          18:00
        </div>
      </div>
    );
    return slots;
  };

  const renderTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 17; hour++) {
      // Hour slot
      slots.push(
        <div key={`${hour}-00`} className="flex-shrink-0 w-[50px] border-r border-slate-100 h-full relative">
          <div className="absolute bottom-0 left-0 right-0 h-px bg-slate-100"></div>
        </div>
      );
      // Half-hour slot (skip 12:30 entirely)
      if (hour !== 12) {
        slots.push(
          <div key={`${hour}-30`} className="flex-shrink-0 w-[50px] border-r border-slate-100 h-full relative">
            <div className="absolute bottom-0 left-0 right-0 h-px bg-slate-100"></div>
          </div>
        );
      }
    }
    // Final 18:00 slot
    slots.push(
      <div key="18-00" className="flex-shrink-0 w-[50px] border-r border-slate-100 h-full relative">
        <div className="absolute bottom-0 left-0 right-0 h-px bg-slate-100"></div>
      </div>
    );
    return slots;
  };

  const renderUserRow = (user: UserWithAppointments) => {
    const userInitials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    const colorClass = getUserColor(user.id);

    return (
      <div key={user.id} className="flex border-b border-slate-200">
        <div className="w-48 p-4 bg-slate-50 border-r border-slate-200 flex-shrink-0 flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold text-sm ${colorClass}`}>
            {userInitials}
          </div>
          <div>
            <div className="font-medium text-slate-900 text-sm">
              {user.firstName} {user.lastName}
            </div>
            <div className="text-xs text-slate-500">
              {user.appointments.length} randevu
            </div>
          </div>
        </div>

        <div className="flex-1 relative h-18 bg-white overflow-x-auto">
          <div className="flex h-full">
            {renderTimeSlots()}

            {user.appointments.map((appointment) => {
              const { left, width } = getAppointmentPosition(appointment.startAt, appointment.endAt);
              const appointmentColorClass = getAppointmentColor(appointment.status, user.id);

              return (
                <div
                  key={appointment.id}
                  className={`absolute top-2 bottom-2 ${appointmentColorClass} rounded-lg px-3 py-2 overflow-hidden text-white cursor-pointer hover:scale-[1.02] hover:shadow-lg transition-all`}
                  style={{ left: `${left}px`, width: `${width}px` }}
                >
                  <div className="font-semibold text-xs mb-1">{appointment.title}</div>
                  <div className="text-xs opacity-90 mb-1">
                    {appointment.customer.firstName} {appointment.customer.lastName}
                  </div>
                  <div className="text-xs opacity-75">
                    {new Date(appointment.startAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })} - {new Date(appointment.endAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              );
            })}

            {user.appointments.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-xs">
                Bugün için randevu bulunmuyor
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const startDate = timelineData?.startDate ? new Date(timelineData.startDate) : new Date();

    return (
      <div className="p-4">
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day, index) => {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + index);
            const dateStr = date.toISOString().split('T')[0];

            return (
              <div key={day} className="border border-slate-200 rounded-lg p-2 min-h-32">
                <div className="font-medium text-slate-700 mb-2">
                  {day} {date.getDate()}
                </div>
                <div className="space-y-1">
                  {timelineData?.users?.map((user) =>
                    user.appointments
                      .filter((app: any) => app.startAt.startsWith(dateStr))
                      .map((appointment: any) => (
                        <div
                          key={appointment.id}
                          className={`text-xs p-1 rounded ${getUserColor(user.id)} text-white truncate cursor-pointer hover:opacity-90`}
                        >
                          {appointment.title}
                        </div>
                      ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderMonthView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // Monday as first day
    const totalDays = lastDay.getDate();

    const days = [];
    // Empty cells for days before first day of month
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    // Days of the month
    for (let i = 1; i <= totalDays; i++) {
      days.push(i);
    }

    const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    return (
      <div className="flex flex-col h-full p-4">
        <div className="grid grid-cols-7 gap-2 mb-2 flex-shrink-0">
          {weekDays.map((day) => (
            <div key={day} className="text-center font-medium text-slate-700 text-sm">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2 flex-1">
          {days.map((day, index) => {
            if (!day) {
              return <div key={index} className="h-full bg-slate-50 rounded-lg"></div>;
            }

            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const hasAppointments = timelineData?.users?.some((user: any) =>
              user.appointments.some((app: any) => app.startAt.startsWith(dateStr))
            );

            return (
              <div
                key={index}
                className={`h-full border border-slate-200 rounded-lg p-2 ${hasAppointments ? 'bg-indigo-50' : 'bg-white'}`}
              >
                <div className="font-medium text-slate-700 mb-1">{day}</div>
                <div className="space-y-1 overflow-auto">
                  {timelineData?.users?.map((user: any) =>
                    user.appointments
                      .filter((app: any) => app.startAt.startsWith(dateStr))
                      .slice(0, 2)
                      .map((appointment: any) => (
                        <div
                          key={appointment.id}
                          className={`text-xs p-1 rounded ${getUserColor(user.id)} text-white truncate cursor-pointer hover:opacity-90`}
                        >
                          {appointment.title}
                        </div>
                      ))
                  )}
                  {timelineData?.users?.some((user: any) =>
                    user.appointments.filter((app: any) => app.startAt.startsWith(dateStr)).length > 2
                  ) && (
                    <div className="text-xs text-slate-500 text-center">+</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Header with navigation */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={goToPreviousDay}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={goToToday}
            className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-slate-100 transition-colors"
          >
            {t("today")}
          </button>

          <button
            onClick={goToNextDay}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <ChevronRight size={20} />
          </button>

          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-slate-400" />
            <input
              type="date"
              value={formatInputDate(currentDate)}
              onChange={handleDateChange}
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="text-lg font-semibold">
          {formatDisplayDate(currentDate)}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setView("week")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              view === "week" ? "bg-indigo-600 text-white" : "hover:bg-slate-100"
            }`}
          >
            {t("week")}
          </button>
          <button
            onClick={() => setView("day")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              view === "day" ? "bg-indigo-600 text-white" : "hover:bg-slate-100"
            }`}
          >
            {t("day")}
          </button>
          <button
            onClick={() => setView("month")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              view === "month" ? "bg-indigo-600 text-white" : "hover:bg-slate-100"
            }`}
          >
            {t("month")}
          </button>
        </div>
      </div>

      {/* Timeline */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-slate-500">{t("loading")}</div>
        </div>
      ) : view === "day" ? (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden flex-1 flex flex-col">
          {/* Time header */}
          <div className="flex border-b border-slate-200 bg-slate-50 flex-shrink-0">
            <div className="w-48 p-4 border-r border-slate-200 font-medium text-slate-700 flex-shrink-0">
              {t("employees")}
            </div>
            <div className="flex-1 overflow-x-auto">
              <div className="flex h-12">
                {renderTimeHeader()}
              </div>
            </div>
          </div>

          {/* User rows */}
          <div className="flex-1 overflow-auto">
            {timelineData?.users?.map((user) => renderUserRow(user))}
          </div>

          {timelineData?.users?.length === 0 && (
            <div className="p-8 text-center text-slate-500">
              {t("noAppointments")}
            </div>
          )}
        </div>
      ) : view === "week" ? (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {renderWeekView()}
        </div>
      ) : view === "month" ? (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden flex-1">
          {renderMonthView()}
        </div>
      ) : null}

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 text-sm flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-yellow-500"></div>
          <span className="text-slate-600">{t("statusPlanned")}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-blue-500"></div>
          <span className="text-slate-600">{t("statusInProgress")}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-green-500"></div>
          <span className="text-slate-600">{t("statusCompleted")}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-red-500"></div>
          <span className="text-slate-600">{t("statusCancelled")}</span>
        </div>
      </div>
    </div>
  );
}
