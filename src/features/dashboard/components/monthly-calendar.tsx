"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

interface DateStatus {
  hasAppointment: boolean;
  hasIncompleteTicket: boolean;
}

interface CalendarData {
  year: number;
  month: number;
  dateStatus: Record<string, DateStatus>;
}

export function MonthlyCalendar() {
  const t = useTranslations("calendar");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarData, setCalendarData] = useState<CalendarData | null>(null);
  const [loading, setLoading] = useState(true);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  useEffect(() => {
    fetchCalendarData(year, month);
  }, [year, month]);

  const fetchCalendarData = async (year: number, month: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/calendar?year=${year}&month=${month}`);
      const data = await response.json();
      setCalendarData(data);
    } catch (error) {
      console.error("Failed to fetch calendar data:", error);
    } finally {
      setLoading(false);
    }
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 2, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month - 1, 1).getDay();
  };

  const getDayClassName = (day: number) => {
    const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const status = calendarData?.dateStatus?.[dateKey];
    
    const baseClasses = "text-center text-xs font-medium text-slate-500 h-7 flex items-center justify-center";
    
    if (!status?.hasAppointment) {
      return `${baseClasses} text-slate-400`;
    }
    
    if (status.hasIncompleteTicket) {
      return `${baseClasses} bg-red-100 text-red-700 border border-red-300`;
    }
    
    return `${baseClasses} bg-green-100 text-green-700 border border-green-300`;
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-7 w-7" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(
        <div key={day} className={getDayClassName(day)}>
          {day}
        </div>
      );
    }

    return days;
  };

  const renderDayHeaders = () => {
    const dayNames = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    return (
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-slate-500 h-7 flex items-center justify-center">
            {t(`days.${day}`)}
          </div>
        ))}
      </div>
    );
  };

  const monthKeys = [
    "january", "february", "march", "april", "may", "june",
    "july", "august", "september", "october", "november", "december"
  ];

  return (
    <div className="rounded-xl bg-white p-5 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-700">{t("title")}</h3>
        <div className="flex items-center gap-1">
          <button
            onClick={goToPreviousMonth}
            className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={goToToday}
            className="px-2.5 py-1 text-xs font-medium rounded-lg hover:bg-slate-100 transition-colors"
          >
            {t("today")}
          </button>
          <button
            onClick={goToNextMonth}
            className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <div className="mb-3">
        <h4 className="text-sm font-bold text-center text-slate-800">
          {t(`months.${monthKeys[month - 1]}`)} {year}
        </h4>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="text-sm text-slate-400">{t("loading")}</div>
        </div>
      ) : (
        <>
          {renderDayHeaders()}
          <div className="grid grid-cols-7 gap-1">
            {renderCalendar()}
          </div>
        </>
      )}

      <div className="mt-3 flex items-center justify-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded bg-red-100 border border-red-300"></div>
          <span className="text-slate-500">{t("incompleteTickets")}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded bg-green-100 border border-green-300"></div>
          <span className="text-slate-500">{t("completedCancelled")}</span>
        </div>
      </div>
    </div>
  );
}
