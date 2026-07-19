"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Calendar, Filter, Download } from "lucide-react";

interface DateRangeFilterExportProps {
  initialStartDate: string;
  initialEndDate: string;
}

export function DateRangeFilterExport({ initialStartDate, initialEndDate }: DateRangeFilterExportProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);

  const formatDateForDisplay = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  const formatDateForInput = (dateString: string) => {
    return dateString;
  };

  const handleFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('startDate', startDate);
    params.set('endDate', endDate);
    router.push(`?${params.toString()}`);
  };

  const handleExport = () => {
    // In real implementation, this would generate and download the report
    alert(`Rapor dışa aktarılıyor: ${formatDateForDisplay(startDate)} - ${formatDateForDisplay(endDate)}`);
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2">
        <Calendar size={16} className="text-slate-400" />
        <input
          type="date"
          value={formatDateForInput(startDate)}
          onChange={(e) => setStartDate(e.target.value)}
          className="text-sm text-slate-600 bg-transparent border-none outline-none w-32"
        />
        <span className="text-slate-400">-</span>
        <input
          type="date"
          value={formatDateForInput(endDate)}
          onChange={(e) => setEndDate(e.target.value)}
          className="text-sm text-slate-600 bg-transparent border-none outline-none w-32"
        />
      </div>

      <button
        onClick={handleFilter}
        className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors"
      >
        <Filter size={16} />
        Filtrele
      </button>

      <button
        onClick={handleExport}
        className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm"
      >
        <Download size={16} />
        Dışa Aktar
      </button>
    </div>
  );
}
