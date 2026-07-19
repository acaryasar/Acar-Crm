"use client";

import { DollarSign, ShoppingCart, Calculator, TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";

interface OverallSummaryProps {
  startDate: string;
  endDate: string;
}

export function OverallSummary({ startDate, endDate }: OverallSummaryProps) {
  const t = useTranslations("salesPersonnelDetailReport");

  // Mock data - in real implementation, this would come from API
  const summaryData = {
    totalSalesAmount: 1245750.00,
    totalOrderCount: 256,
    averageOrderAmount: 4047.07,
    totalCommission: 124575.00,
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('tr-TR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('tr-TR').format(value);
  };

  const cards = [
    {
      title: String(t("totalSalesAmount")),
      value: formatCurrency(summaryData.totalSalesAmount),
      icon: DollarSign,
      color: "blue",
    },
    {
      title: String(t("totalOrderCount")),
      value: formatNumber(summaryData.totalOrderCount),
      icon: ShoppingCart,
      color: "green",
    },
    {
      title: String(t("averageOrderAmount")),
      value: formatCurrency(summaryData.averageOrderAmount),
      icon: Calculator,
      color: "purple",
    },
    {
      title: String(t("totalCommission")),
      value: formatCurrency(summaryData.totalCommission),
      icon: TrendingUp,
      color: "orange",
    },
  ];

  const colorClasses = {
    blue: {
      bg: "bg-blue-50",
      icon: "text-blue-600",
    },
    green: {
      bg: "bg-green-50",
      icon: "text-green-600",
    },
    purple: {
      bg: "bg-purple-50",
      icon: "text-purple-600",
    },
    orange: {
      bg: "bg-orange-50",
      icon: "text-orange-600",
    },
  } as const;

  type ColorKey = keyof typeof colorClasses;

  const cardsWithColor = cards.map(card => ({
    ...card,
    color: card.color as ColorKey
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cardsWithColor.map((card) => {
        const Icon = card.icon;
        const colors = colorClasses[card.color];
        
        return (
          <div
            key={card.title}
            className="bg-white rounded-xl border border-slate-200 shadow-sm p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-600 mb-1">{card.title}</p>
                <p className="text-2xl font-bold text-slate-800">{card.value} ₺</p>
              </div>
              <div className={`h-12 w-12 rounded-xl ${colors.bg} flex items-center justify-center shrink-0`}>
                <Icon size={24} className={colors.icon} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
