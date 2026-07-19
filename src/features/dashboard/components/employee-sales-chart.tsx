"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export function EmployeeSalesChart() {
  // Mock data for demonstration
  const salesData = [
    { month: "Oca", value: 45000 },
    { month: "Şub", value: 52000 },
    { month: "Mar", value: 48000 },
    { month: "Nis", value: 61000 },
    { month: "May", value: 55000 },
    { month: "Haz", value: 67000 },
  ];

  const maxValue = Math.max(...salesData.map(d => d.value));

  return (
    <Card className="border-slate-100 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
            Satış Trendi
          </CardTitle>
          <TrendingUp size={16} className="text-indigo-500" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {salesData.map((data, index) => (
            <div key={index} className="flex items-center gap-3">
              <span className="text-xs text-slate-500 w-8">{data.month}</span>
              <div className="flex-1 h-8 bg-slate-100 rounded-lg overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg transition-all duration-500"
                  style={{ width: `${(data.value / maxValue) * 100}%` }}
                />
              </div>
              <span className="text-xs font-medium text-slate-700 w-16 text-right">
                ₺{data.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
