"use client";

import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

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

interface PremiumDetailSidebarProps {
  premium: Premium | null;
  onClose: () => void;
}

export function PremiumDetailSidebar({ premium, onClose }: PremiumDetailSidebarProps) {
  const t = useTranslations("premiumPayments");

  if (!premium) {
    return null;
  }

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

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl border-l border-slate-200 z-50 overflow-y-auto">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-800">{t("selectedPremiumDetail")}</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X size={18} className="text-slate-600" />
          </Button>
        </div>

        {/* Employee Info */}
        <div className="mb-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center">
              <span className="text-xl">👤</span>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">{premium.employeeName}</h3>
              <p className="text-sm text-slate-500">{premium.employeeTitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(premium.status)}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b border-slate-50">
            <span className="text-sm text-slate-500">{t("period")}</span>
            <span className="text-sm font-medium text-slate-800">{premium.period}</span>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-slate-50">
            <span className="text-sm text-slate-500">{t("premiumPlan")}</span>
            <span className="text-sm font-medium text-slate-800">{premium.premiumPlan}</span>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-slate-50">
            <span className="text-sm text-slate-500">{t("premiumType")}</span>
            <span className="text-sm font-medium text-slate-800">{premium.premiumType}</span>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-slate-50">
            <span className="text-sm text-slate-500">{t("premiumAmount")}</span>
            <span className="text-sm font-bold text-slate-800">{formatCurrency(premium.amount)}</span>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-slate-50">
            <span className="text-sm text-slate-500">{t("status")}</span>
            {getStatusBadge(premium.status)}
          </div>

          <div className="flex justify-between items-center py-2 border-b border-slate-50">
            <span className="text-sm text-slate-500">{t("department")}</span>
            <span className="text-sm font-medium text-slate-800">{premium.department}</span>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-slate-50">
            <span className="text-sm text-slate-500">{t("paymentDate")}</span>
            <span className="text-sm font-medium text-slate-800">{premium.paymentDate || "—"}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 space-y-3">
          {premium.status === "payable" && (
            <Button className="w-full" size="sm">
              {t("approvePayment")}
            </Button>
          )}
          {premium.status === "pending" && (
            <>
              <Button className="w-full" size="sm">
                {t("approve")}
              </Button>
              <Button variant="outline" className="w-full" size="sm">
                {t("reject")}
              </Button>
            </>
          )}
          <Button variant="outline" className="w-full" size="sm">
            {t("printDocument")}
          </Button>
        </div>
      </div>
    </div>
  );
}
