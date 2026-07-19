"use client";

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface SalesChartsProps {
  startDate: string;
  endDate: string;
}

export function SalesCharts({ startDate, endDate }: SalesChartsProps) {
  // Mock data for daily sales - in real implementation, this would come from API
  const dailySalesData = [
    { date: "01.05", sales: 45000 },
    { date: "02.05", sales: 52000 },
    { date: "03.05", sales: 38000 },
    { date: "04.05", sales: 61000 },
    { date: "05.05", sales: 55000 },
    { date: "06.05", sales: 47000 },
    { date: "07.05", sales: 72000 },
    { date: "08.05", sales: 58000 },
    { date: "09.05", sales: 43000 },
    { date: "10.05", sales: 66000 },
    { date: "11.05", sales: 51000 },
    { date: "12.05", sales: 49000 },
    { date: "13.05", sales: 63000 },
    { date: "14.05", sales: 57000 },
    { date: "15.05", sales: 41000 },
    { date: "16.05", sales: 68000 },
    { date: "17.05", sales: 54000 },
    { date: "18.05", sales: 46000 },
    { date: "19.05", sales: 71000 },
    { date: "20.05", sales: 59000 },
    { date: "21.05", sales: 44000 },
    { date: "22.05", sales: 67000 },
    { date: "23.05", sales: 52000 },
    { date: "24.05", sales: 48000 },
    { date: "25.05", sales: 64000 },
    { date: "26.05", sales: 56000 },
    { date: "27.05", sales: 42000 },
    { date: "28.05", sales: 69000 },
    { date: "29.05", sales: 53000 },
    { date: "30.05", sales: 47000 },
    { date: "31.05", sales: 62000 },
  ];

  // Mock data for monthly comparison - in real implementation, this would come from API
  const monthlyComparisonData = [
    { month: "Oca", 2023: 95000, 2024: 115000 },
    { month: "Şub", 2023: 88000, 2024: 102000 },
    { month: "Mar", 2023: 92000, 2024: 108000 },
    { month: "Nis", 2023: 105000, 2024: 125000 },
    { month: "May", 2023: 98000, 2024: 124575 },
    { month: "Haz", 2023: 89000, 2024: 95000 },
    { month: "Tem", 2023: 92000, 2024: 98000 },
    { month: "Ağu", 2023: 87000, 2024: 92000 },
    { month: "Eyl", 2023: 94000, 2024: 105000 },
    { month: "Eki", 2023: 108000, 2024: 128000 },
    { month: "Kas", 2023: 115000, 2024: 135000 },
    { month: "Ara", 2023: 125000, 2024: 145000 },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('tr-TR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Daily Sales Chart */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Günlük Satış Tutarı</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dailySalesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="date" 
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
              formatter={(value: any) => [`${formatCurrency(Number(value) || 0)} ₺`, "Satış"]}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="sales" 
              stroke="#4f46e5" 
              strokeWidth={2}
              dot={{ fill: "#4f46e5", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly Comparison Chart */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Aylara Göre Satış Karşılaştırması</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyComparisonData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="month" 
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
              formatter={(value: any) => [`${formatCurrency(Number(value) || 0)} ₺`, ""]}
            />
            <Legend />
            <Bar dataKey="2023" fill="#94a3b8" radius={[4, 4, 0, 0]} />
            <Bar dataKey="2024" fill="#4f46e5" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
