"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OrderStatusData {
  name: string;
  value: number;
  color: string;
}

interface OrderStatusChartProps {
  data?: OrderStatusData[];
  total?: number;
}

export function OrderStatusChart({ data = generateMockData(), total = 256 }: OrderStatusChartProps) {
  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('tr-TR').format(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-slate-700">SİPARİŞ DURUMU</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          <div className="relative w-32 h-32 flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={60}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    fontSize: '12px'
                  }}
                  formatter={(value: any, name: any) => [`${formatNumber(Number(value))} (${((Number(value) / total) * 100).toFixed(1)}%)`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-xl font-bold text-blue-600">{formatNumber(total)}</div>
              </div>
            </div>
          </div>
          
          <div className="flex-1 space-y-2">
            {data.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-700">{formatNumber(item.value)}</span>
                  <span className="text-slate-400">(%{((item.value / total) * 100).toFixed(1)})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function generateMockData(): OrderStatusData[] {
  return [
    { name: "Yeni", value: 45, color: "#3b82f6" },
    { name: "Onaylandı", value: 78, color: "#10b981" },
    { name: "Sevkiyatta", value: 52, color: "#f59e0b" },
    { name: "Teslim Edildi", value: 68, color: "#6366f1" },
    { name: "İptal", value: 13, color: "#ef4444" },
  ];
}
