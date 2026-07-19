"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react";

export function EmployeeTargetAchievement() {
  const targetAmount = 100000;
  const achievedAmount = 75000;
  const percentage = Math.round((achievedAmount / targetAmount) * 100);

  return (
    <Card className="border-slate-100 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
            Hedef Başarısı
          </CardTitle>
          <Target size={16} className="text-indigo-500" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center mb-4">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="#e2e8f0"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="#6366f1"
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 56}`}
                strokeDashoffset={`${2 * Math.PI * 56 * (1 - percentage / 100)}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-slate-800">{percentage}%</span>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Hedef</span>
            <span className="font-medium text-slate-800">₺{targetAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Gerçekleşen</span>
            <span className="font-medium text-emerald-600">₺{achievedAmount.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
