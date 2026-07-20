"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Eye, MoreVertical, Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type PremiumStatus = "all" | "pending" | "payable" | "paid" | "cancelled";

export interface Premium {
  id: string;
  employeeName: string;
  employeeTitle: string;
  department: string;
  premiumPlan: string;
  period: string;
  premiumType: string;
  amount: number;
  status: "payable" | "pending" | "paid" | "cancelled";
  paymentDate?: string;
}

interface PremiumTableProps {
  premiums?: Premium[];
  activeTab?: PremiumStatus;
  onActiveTabChange?: (tab: PremiumStatus) => void;
  filters?: {
    premiumPlan: string;
    premiumType: string;
    department: string;
    status: string;
  };
  dateRange?: { start: string; end: string };
  onRowClick?: (premium: Premium) => void;
  selectedPremiumId?: string;
}

const mockPremiums: Premium[] = [
  {
    id: "1",
    employeeName: "Ahmet Yılmaz",
    employeeTitle: "Satış Temsilcisi",
    department: "Satış",
    premiumPlan: "Satış Prim Planı %2-%5",
    period: "Mayıs 2024",
    premiumType: "Ciro Primi",
    amount: 18750,
    status: "payable",
    paymentDate: "",
  },
  {
    id: "2",
    employeeName: "Ayşe Demir",
    employeeTitle: "Satış Uzmanı",
    department: "Satış",
    premiumPlan: "Satış Prim Planı %2-%5",
    period: "Mayıs 2024",
    premiumType: "Performans Primi",
    amount: 15200,
    status: "pending",
    paymentDate: "",
  },
  {
    id: "3",
    employeeName: "Mehmet Kaya",
    employeeTitle: "Bölge Müdürü",
    department: "Satış",
    premiumPlan: "Yönetici Prim Planı",
    period: "Mayıs 2024",
    premiumType: "Hedef Primi",
    amount: 22500,
    status: "paid",
    paymentDate: "27.05.2024",
  },
  {
    id: "4",
    employeeName: "Fatma Şahin",
    employeeTitle: "Satış Temsilcisi",
    department: "Satış",
    premiumPlan: "Satış Prim Planı %2-%5",
    period: "Mayıs 2024",
    premiumType: "Ciro Primi",
    amount: 12000,
    status: "paid",
    paymentDate: "25.05.2024",
  },
  {
    id: "5",
    employeeName: "Ali Özkan",
    employeeTitle: "Satış Uzmanı",
    department: "Satış",
    premiumPlan: "Satış Prim Planı %2-%5",
    period: "Mayıs 2024",
    premiumType: "Performans Primi",
    amount: 9800,
    status: "cancelled",
    paymentDate: "",
  },
  {
    id: "6",
    employeeName: "Zeynep Arslan",
    employeeTitle: "Satış Temsilcisi",
    department: "Satış",
    premiumPlan: "Satış Prim Planı %2-%5",
    period: "Mayıs 2024",
    premiumType: "Ciro Primi",
    amount: 14500,
    status: "payable",
    paymentDate: "",
  },
  {
    id: "7",
    employeeName: "Can Yıldız",
    employeeTitle: "Bölge Müdürü",
    department: "Satış",
    premiumPlan: "Yönetici Prim Planı",
    period: "Mayıs 2024",
    premiumType: "Hedef Primi",
    amount: 28000,
    status: "pending",
    paymentDate: "",
  },
  {
    id: "8",
    employeeName: "Elif Çelik",
    employeeTitle: "Satış Uzmanı",
    department: "Satış",
    premiumPlan: "Satış Prim Planı %2-%5",
    period: "Mayıs 2024",
    premiumType: "Ciro Primi",
    amount: 11000,
    status: "paid",
    paymentDate: "26.05.2024",
  },
];

export function PremiumTable({
  premiums = mockPremiums,
  activeTab = "all",
  onActiveTabChange,
  filters,
  dateRange,
  onRowClick,
  selectedPremiumId
}: PremiumTableProps) {
  const t = useTranslations("premiumPayments");
  const [selectedPremiums, setSelectedPremiums] = useState<Set<string>>(new Set());

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const getStatusBadge = (status: Premium["status"]) => {
    const statusConfig = {
      payable: { text: t("payable"), className: "bg-blue-50 text-blue-700 border border-blue-200" },
      pending: { text: t("pendingApproval"), className: "bg-amber-50 text-amber-700 border border-amber-200" },
      paid: { text: t("paid"), className: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
      cancelled: { text: t("cancelled"), className: "bg-red-50 text-red-700 border border-red-200" },
    };
    const config = statusConfig[status];
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.className}`}>
        {config.text}
      </span>
    );
  };

  const getFilteredPremiums = () => {
    const currentFilters = filters || { premiumPlan: "all", premiumType: "all", department: "all", status: "all" };
    return premiums.filter((premium) => {
      if (activeTab !== "all" && premium.status !== activeTab) return false;
      if (currentFilters.premiumPlan !== "all" && premium.premiumPlan !== currentFilters.premiumPlan) return false;
      if (currentFilters.premiumType !== "all" && premium.premiumType !== currentFilters.premiumType) return false;
      if (currentFilters.department !== "all" && premium.department !== currentFilters.department) return false;
      return true;
    });
  };

  const filteredPremiums = getFilteredPremiums();
  const tabCounts = {
    all: premiums.length,
    pending: premiums.filter(p => p.status === "pending").length,
    payable: premiums.filter(p => p.status === "payable").length,
    paid: premiums.filter(p => p.status === "paid").length,
    cancelled: premiums.filter(p => p.status === "cancelled").length,
  };

  const tabs: { key: PremiumStatus; label: string }[] = [
    { key: "all", label: t("allPremiums") },
    { key: "pending", label: `${t("pendingApproval")} (${tabCounts.pending})` },
    { key: "payable", label: `${t("payable")} (${tabCounts.payable})` },
    { key: "paid", label: `${t("paid")} (${tabCounts.paid})` },
    { key: "cancelled", label: `${t("cancelled")} (${tabCounts.cancelled})` },
  ];

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPremiums(new Set(filteredPremiums.map(p => p.id)));
    } else {
      setSelectedPremiums(new Set());
    }
  };

  const handleSelectPremium = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedPremiums);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedPremiums(newSelected);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 shrink-0">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onActiveTabChange?.(tab.key)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Scrollable Table Area */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {/* Table */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 sticky top-0 z-10">
              <tr className="border-b border-slate-100">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-10">
                  <input
                    type="checkbox"
                    className="rounded border-slate-300"
                    checked={selectedPremiums.size === filteredPremiums.length && filteredPremiums.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {t("employee")}
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {t("department")}
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {t("premiumPlan")}
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {t("period")}
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {t("premiumType")}
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {t("amount")}
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {t("status")}
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {t("paymentDate")}
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {t("actions")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPremiums.map((premium) => (
                <tr
                  key={premium.id}
                  className={`hover:bg-slate-50 transition-colors cursor-pointer ${
                    selectedPremiumId === premium.id ? "bg-blue-50" : ""
                  }`}
                  onClick={() => onRowClick?.(premium)}
                >
                  <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      className="rounded border-slate-300"
                      checked={selectedPremiums.has(premium.id)}
                      onChange={(e) => handleSelectPremium(premium.id, e.target.checked)}
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div>
                      <div className="font-medium text-slate-800">{premium.employeeName}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{premium.employeeTitle}</div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-slate-600">{premium.department}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-slate-600">{premium.premiumPlan}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-slate-600">{premium.period}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-slate-600">{premium.premiumType}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm font-medium text-slate-800">{formatCurrency(premium.amount)}</span>
                  </td>
                  <td className="px-4 py-4">
                    {getStatusBadge(premium.status)}
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-slate-600">{premium.paymentDate || "—"}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRowClick?.(premium);
                        }}
                      >
                        <Eye size={16} className="text-slate-600" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical size={16} className="text-slate-600" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between shrink-0">
        <div className="text-sm text-slate-500">
          {t("showing")} 1-10 {t("of")} {filteredPremiums.length} {t("records")}
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="10">
            <SelectTrigger className="w-20 h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" disabled className="h-9">
              ←
            </Button>
            <Button variant="outline" size="sm" className="h-9 bg-blue-50 border-blue-200">
              1
            </Button>
            <Button variant="outline" size="sm" className="h-9">
              2
            </Button>
            <Button variant="outline" size="sm" className="h-9">
              3
            </Button>
            <Button variant="outline" size="sm" className="h-9">
              →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
