"use client";

import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Package, Calculator } from "lucide-react";
import { useTranslations } from "next-intl";

interface SummaryCardsProps {
  startDate: string;
  endDate: string;
}

export function SummaryCards({ startDate, endDate }: SummaryCardsProps) {
  const t = useTranslations("salesOrderReport");

  // Mock data - in real implementation, this would come from API
  const summaryData = {
    totalSalesAmount: {
      value: 1245750.00,
      change: 12.5,
      trend: "up" as const,
    },
    totalOrderAmount: {
      value: 1036250.00,
      change: 8.3,
      trend: "up" as const,
    },
    totalOrderCount: {
      value: 256,
      change: 10.1,
      trend: "up" as const,
    },
    averageOrderAmount: {
      value: 4047.07,
      change: 2.1,
      trend: "up" as const,
    },
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

  const colorClasses = {
    blue: {
      bg: "bg-blue-50",
      icon: "text-blue-600",
      change: "text-emerald-600",
    },
    green: {
      bg: "bg-green-50",
      icon: "text-green-600",
      change: "text-emerald-600",
    },
    purple: {
      bg: "bg-purple-50",
      icon: "text-purple-600",
      change: "text-emerald-600",
    },
    orange: {
      bg: "bg-orange-50",
      icon: "text-orange-600",
      change: "text-emerald-600",
    },
  } as const;

  type ColorKey = keyof typeof colorClasses;

  const cards = [
    {
      title: String(t("totalSalesAmount")),
      value: formatCurrency(summaryData.totalSalesAmount.value),
      change: summaryData.totalSalesAmount.change,
      trend: summaryData.totalSalesAmount.trend,
      icon: DollarSign,
      color: "blue" as ColorKey,
    },
    {
      title: String(t("totalOrderAmount")),
      value: formatCurrency(summaryData.totalOrderAmount.value),
      change: summaryData.totalOrderAmount.change,
      trend: summaryData.totalOrderAmount.trend,
      icon: ShoppingCart,
      color: "green" as ColorKey,
    },
    {
      title: String(t("totalOrderCount")),
      value: formatNumber(summaryData.totalOrderCount.value),
      change: summaryData.totalOrderCount.change,
      trend: summaryData.totalOrderCount.trend,
      icon: Package,
      color: "purple" as ColorKey,
    },
    {
      title: String(t("averageOrderAmount")),
      value: formatCurrency(summaryData.averageOrderAmount.value),
      change: summaryData.averageOrderAmount.change,
      trend: summaryData.averageOrderAmount.trend,
      icon: Calculator,
      color: "orange" as ColorKey,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
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
                <p className="text-2xl font-bold text-slate-800 mb-2">{card.value} ₺</p>
                <div className="flex items-center gap-1">
                  {card.trend === "up" ? (
                    <TrendingUp size={16} className={colors.change} />
                  ) : (
                    <TrendingDown size={16} className="text-red-600" />
                  )}
                  <span className={`text-sm font-medium ${
                    card.trend === "up" ? colors.change : "text-red-600"
                  }`}>
                    %{card.change}
                  </span>
                  <span className="text-xs text-slate-500 ml-1">
                    {String(t("comparedToPreviousPeriod"))}
                  </span>
                </div>
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
