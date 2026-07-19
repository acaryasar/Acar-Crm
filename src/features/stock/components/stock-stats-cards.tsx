"use client";

import { prisma } from "@/lib/prisma";

interface StockStatsCardsProps {
  totalProducts: number;
  criticalStock: number;
  outOfStock: number;
  totalStockValue: number;
  onTabClick: (tab: "all" | "critical" | "out-of-stock") => void;
}

export function StockStatsCards({ 
  totalProducts, 
  criticalStock, 
  outOfStock, 
  totalStockValue,
  onTabClick 
}: StockStatsCardsProps) {
  const stats = [
    {
      title: "Toplam Ürün",
      value: totalProducts,
      icon: "�",
      clickable: true,
      tab: "all" as const
    },
    {
      title: "Kritik Stok Sayısı",
      value: criticalStock,
      icon: "⚠️",
      clickable: true,
      tab: "critical" as const
    },
    {
      title: "Stokta Olmayan",
      value: outOfStock,
      icon: "❌",
      clickable: true,
      tab: "out-of-stock" as const
    },
    {
      title: "Toplam Stok Değeri",
      value: totalStockValue,
      isCurrency: true,
      icon: "💰",
      clickable: false,
      tab: null
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`bg-white rounded-lg border border-slate-200 shadow-sm p-4 ${
            stat.clickable ? "cursor-pointer hover:border-indigo-300 hover:shadow-md transition-all" : ""
          }`}
          onClick={() => stat.tab && onTabClick(stat.tab)}
        >
          <p className="text-xs font-medium text-slate-600 mb-2">{stat.title}</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{stat.icon}</span>
            <p className="text-lg font-semibold text-slate-800">
              {stat.isCurrency 
                ? stat.value.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ₺'
                : stat.value.toLocaleString('tr-TR')
              }
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
