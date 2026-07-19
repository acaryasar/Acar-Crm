"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import { OverallSummary } from "@/features/reports/sales-personnel-detail-report/components/overall-summary";
import { DateRangeFilterExport } from "@/features/reports/sales-personnel-detail-report/components/date-range-filter-export";
import { SalesPersonnelList } from "@/features/reports/sales-personnel-detail-report/components/sales-personnel-list";
import { PersonnelSummary } from "@/features/reports/sales-personnel-detail-report/components/personnel-summary";
import { SalesDetailsTable } from "@/features/reports/sales-personnel-detail-report/components/sales-details-table";
import { useTranslations } from "next-intl";

interface SalesPersonnel {
  id: string;
  name: string;
  totalSales: number;
  orderCount: number;
}

export default function SalesPersonnelDetailReportPage() {
  const t = useTranslations("salesPersonnelDetailReport");
  const [selectedPersonnel, setSelectedPersonnel] = useState<SalesPersonnel>({
    id: "1",
    name: "Ahmet Yılmaz",
    totalSales: 512450.00,
    orderCount: 98,
  });

  const [startDate, setStartDate] = useState("2024-05-01");
  const [endDate, setEndDate] = useState("2024-05-31");

  const handleSelectPersonnel = (personnel: SalesPersonnel) => {
    setSelectedPersonnel(personnel);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-100 flex items-center justify-center">
            <FileText size={20} className="text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{String(t("title"))}</h1>
            <p className="text-sm text-slate-500">Raporlar &gt; {String(t("title"))}</p>
          </div>
        </div>

        <DateRangeFilterExport initialStartDate={startDate} initialEndDate={endDate} />
      </div>

      <div className="flex-1 min-h-0 overflow-auto space-y-6">
        <OverallSummary startDate={startDate} endDate={endDate} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <SalesPersonnelList
              startDate={startDate}
              endDate={endDate}
              onSelectPersonnel={handleSelectPersonnel}
              selectedPersonnelId={selectedPersonnel.id}
            />
          </div>
          
          <div className="lg:col-span-2 space-y-6">
            <PersonnelSummary
              personnelName={selectedPersonnel.name}
              startDate={startDate}
              endDate={endDate}
            />
            <SalesDetailsTable
              personnelId={selectedPersonnel.id}
              startDate={startDate}
              endDate={endDate}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
