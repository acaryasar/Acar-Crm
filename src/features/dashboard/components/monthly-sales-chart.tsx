"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MonthlySalesData {
  month: string;
  year2023: number;
  year2024: number;
}

interface MonthlySalesChartProps {
  data?: MonthlySalesData[];
}

export function MonthlySalesChart({ data = generateMockData() }: MonthlySalesChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const months = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-slate-700">AYLARA GÖRE SATIŞ TUTARI</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={formatCurrency}
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '8px', 
                  border: 'none', 
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  fontSize: '12px'
                }}
                formatter={(value: any) => [formatCurrency(Number(value)), '']}
              />
              <Legend 
                wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
                iconType="circle"
              />
              <Bar dataKey="year2023" name="2023" fill="#94a3b8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="year2024" name="2024" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function generateMockData(): MonthlySalesData[] {
  const data: MonthlySalesData[] = [];
  const months = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
  
  months.forEach((month) => {
    const year2023 = Math.round(80000 + Math.random() * 40000);
    const year2024 = Math.round(year2023 * (1 + (Math.random() - 0.3) * 0.4));
    data.push({
      month,
      year2023,
      year2024,
    });
  });
  
  return data;
}
