"use client";

import { useTranslations } from "next-intl";

interface KPICardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
}

function KPICard({ title, value, subtitle, icon }: KPICardProps) {
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm border border-slate-100">
      <div className="flex items-start justify-between mb-3">
        <div className="text-sm font-medium text-slate-600">{title}</div>
        
      </div>
      <div className="text-2xl font-bold text-slate-800 mb-2">{value}</div>
      {subtitle && (
        <div className="text-xs text-slate-500">{subtitle}</div>
      )}
    </div>
  );
}

interface PremiumSummaryCardsProps {
  totalPremiumAmount?: number;
  payablePremium?: number;
  payableCount?: number;
  paidPremium?: number;
  paidCount?: number;
  pendingApproval?: number;
  pendingCount?: number;
  averagePremiumRate?: number;
  totalEmployees?: number;
}

export function PremiumSummaryCards({
  totalPremiumAmount = 245680,
  payablePremium = 112450,
  payableCount = 9,
  paidPremium = 96230,
  paidCount = 14,
  pendingApproval = 36800,
  pendingCount = 6,
  averagePremiumRate = 3.45,
  totalEmployees = 28,
}: PremiumSummaryCardsProps) {
  const t = useTranslations("premiumPayments");

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('tr-TR').format(value);
  };

  const kpis = [
    {
      title: t("totalPremiumAmount"),
      value: formatCurrency(totalPremiumAmount),
      subtitle: t("thisPeriod"),
      icon: <span className="text-lg">💰</span>,
    },
    {
      title: t("payablePremium"),
      value: formatCurrency(payablePremium),
      subtitle: `${payableCount} ${t("people")}`,
      icon: <span className="text-lg">💵</span>,
    },
    {
      title: t("paidPremium"),
      value: formatCurrency(paidPremium),
      subtitle: `${paidCount} ${t("people")}`,
      icon: <span className="text-lg">✅</span>,
    },
    {
      title: t("pendingApproval"),
      value: formatCurrency(pendingApproval),
      subtitle: `${pendingCount} ${t("people")}`,
      icon: <span className="text-lg">⏳</span>,
    },
    {
      title: t("averagePremiumRate"),
      value: `%${averagePremiumRate.toFixed(2)}`,
      subtitle: t("revenuePremium"),
      icon: <span className="text-lg">📊</span>,
    },
    {
      title: t("totalEmployees"),
      value: formatNumber(totalEmployees),
      subtitle: t("activeSalesTeam"),
      icon: <span className="text-lg">👥</span>,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {kpis.map((kpi, index) => (
        <KPICard key={index} {...kpi} />
      ))}
    </div>
  );
}
