"use client";

import { DollarSign, ShoppingCart, Calculator, TrendingUp, User } from "lucide-react";

interface PersonnelSummaryProps {
  personnelName: string;
  startDate: string;
  endDate: string;
}

export function PersonnelSummary({ personnelName, startDate, endDate }: PersonnelSummaryProps) {
  // Mock data - in real implementation, this would come from API based on selected personnel
  const summaryData = {
    totalSales: 512450.00,
    orderCount: 98,
    averageOrder: 5229.08,
    commissionAmount: 51245.00,
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
      title: "Toplam Satış",
      value: formatCurrency(summaryData.totalSales),
      icon: DollarSign,
      color: "blue",
    },
    {
      title: "Sipariş Adedi",
      value: formatNumber(summaryData.orderCount),
      icon: ShoppingCart,
      color: "green",
    },
    {
      title: "Ortalama Sipariş",
      value: formatCurrency(summaryData.averageOrder),
      icon: Calculator,
      color: "purple",
    },
    {
      title: "Prim Tutarı",
      value: formatCurrency(summaryData.commissionAmount),
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
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-xl bg-indigo-100 flex items-center justify-center">
          <User size={20} className="text-indigo-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-800">{personnelName} - Detay</h3>
          <p className="text-sm text-slate-500">Personel performans özeti</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {cardsWithColor.map((card) => {
          const Icon = card.icon;
          const colors = colorClasses[card.color];
          
          return (
            <div
              key={card.title}
              className="bg-slate-50 rounded-lg p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`h-8 w-8 rounded-lg ${colors.bg} flex items-center justify-center shrink-0`}>
                  <Icon size={16} className={colors.icon} />
                </div>
                <p className="text-xs font-medium text-slate-600">{card.title}</p>
              </div>
              <p className="text-xl font-bold text-slate-800">{card.value} ₺</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
