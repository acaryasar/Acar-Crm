import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
}

function KPICard({ title, value, change, icon }: KPICardProps) {
  const isPositive = change > 0;
  const isNegative = change < 0;
  
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm border border-slate-100">
      <div className="flex items-start justify-between mb-3">
        <div className="text-sm font-medium text-slate-600">{title}</div>
        <div className="h-9 w-9 rounded-lg bg-slate-50 flex items-center justify-center">
          {icon}
        </div>
      </div>
      <div className="text-2xl font-bold text-slate-800 mb-2">{value}</div>
      <div className="flex items-center gap-1 text-xs">
        {isPositive ? (
          <TrendingUp size={14} className="text-emerald-600" />
        ) : isNegative ? (
          <TrendingDown size={14} className="text-red-600" />
        ) : (
          <Minus size={14} className="text-slate-400" />
        )}
        <span className={isPositive ? "text-emerald-600" : isNegative ? "text-red-600" : "text-slate-400"}>
          {isPositive ? "+" : ""}{change.toFixed(1)}%
        </span>
        <span className="text-slate-400">önceki dönemden</span>
      </div>
    </div>
  );
}

interface AdminKPIProps {
  totalSalesAmount?: number;
  totalOrderAmount?: number;
  orderCount?: number;
  averageOrderAmount?: number;
  collectionRate?: number;
  totalCommissionAmount?: number;
}

export function AdminKPICards({
  totalSalesAmount = 1245750,
  totalOrderAmount = 1036250,
  orderCount = 256,
  averageOrderAmount = 4047.07,
  collectionRate = 92.5,
  totalCommissionAmount = 124575,
}: AdminKPIProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('tr-TR').format(value);
  };

  const kpis = [
    {
      title: "TOPLAM SATIŞ TUTARI",
      value: formatCurrency(totalSalesAmount),
      change: 12.5,
      icon: <span className="text-lg">💰</span>,
    },
    {
      title: "TOPLAM SİPARİŞ TUTARI",
      value: formatCurrency(totalOrderAmount),
      change: 8.3,
      icon: <span className="text-lg">📦</span>,
    },
    {
      title: "SİPARİŞ ADEDİ",
      value: formatNumber(orderCount),
      change: 10.1,
      icon: <span className="text-lg">🛒</span>,
    },
    {
      title: "ORTALAMA SİPARİŞ TUTARI",
      value: formatCurrency(averageOrderAmount),
      change: 2.1,
      icon: <span className="text-lg">📊</span>,
    },
    {
      title: "TAHSİLAT ORANI",
      value: `%${collectionRate.toFixed(1)}`,
      change: 5.0,
      icon: <span className="text-lg">💳</span>,
    },
    {
      title: "TOPLAM PRİM TUTARI",
      value: formatCurrency(totalCommissionAmount),
      change: 15.2,
      icon: <span className="text-lg">🏆</span>,
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
