"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Receipt, Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PremiumSummaryCards } from "./premium-summary-cards";
import { PremiumTable, Premium, PremiumStatus } from "./premium-table";
import { PremiumDetailSidebar } from "./premium-detail-sidebar";

export function PremiumPaymentsPage() {
  const t = useTranslations("premiumPayments");
  const [selectedPremium, setSelectedPremium] = useState<Premium | null>(null);
  const [activeTab, setActiveTab] = useState<PremiumStatus>("all");
  const [dateRange, setDateRange] = useState({ start: "01.05.2024", end: "31.05.2024" });
  const [filters, setFilters] = useState({
    premiumPlan: "all",
    premiumType: "all",
    department: "all",
    status: "all",
  });

  const handleRowClick = (premium: Premium) => {
    setSelectedPremium(premium);
  };

  const handleCloseSidebar = () => {
    setSelectedPremium(null);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 shrink-0">
        <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
          <Receipt size={20} className="text-slate-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{t("title")}</h1>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 shrink-0">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Input
              type="text"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="w-32 h-9"
              placeholder="Başlangıç"
            />
            <span className="text-slate-400">-</span>
            <Input
              type="text"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="w-32 h-9"
              placeholder="Bitiş"
            />
          </div>

          <Select value={filters.premiumPlan} onValueChange={(value: string) => setFilters({ ...filters, premiumPlan: value })}>
            <SelectTrigger className="w-48 h-9">
              <SelectValue placeholder={t("premiumPlan")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("all")}</SelectItem>
              <SelectItem value="Satış Prim Planı %2-%5">Satış Prim Planı %2-%5</SelectItem>
              <SelectItem value="Yönetici Prim Planı">Yönetici Prim Planı</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.premiumType} onValueChange={(value: string) => setFilters({ ...filters, premiumType: value })}>
            <SelectTrigger className="w-48 h-9">
              <SelectValue placeholder={t("premiumType")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("all")}</SelectItem>
              <SelectItem value="Ciro Primi">Ciro Primi</SelectItem>
              <SelectItem value="Performans Primi">Performans Primi</SelectItem>
              <SelectItem value="Hedef Primi">Hedef Primi</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.department} onValueChange={(value: string) => setFilters({ ...filters, department: value })}>
            <SelectTrigger className="w-48 h-9">
              <SelectValue placeholder={t("department")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("all")}</SelectItem>
              <SelectItem value="Satış">Satış</SelectItem>
              <SelectItem value="Pazarlama">Pazarlama</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" onClick={() => setFilters({ premiumPlan: "all", premiumType: "all", department: "all", status: "all" })}>
            {t("clear")}
          </Button>
          <Button size="sm">
            {t("filter")}
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download size={16} />
            {t("downloadExcel")}
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <RefreshCw size={16} />
            {t("refresh")}
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="mb-6 shrink-0">
        <PremiumSummaryCards />
      </div>

      {/* Main Content */}
      <div className="flex-1 min-h-0 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 overflow-hidden">
        <PremiumTable
          activeTab={activeTab}
          onActiveTabChange={setActiveTab}
          filters={filters}
          dateRange={dateRange}
          onRowClick={handleRowClick}
          selectedPremiumId={selectedPremium?.id}
        />
      </div>

      {/* Detail Sidebar */}
      {selectedPremium && (
        <PremiumDetailSidebar
          premium={selectedPremium}
          onClose={handleCloseSidebar}
        />
      )}
    </div>
  );
}
