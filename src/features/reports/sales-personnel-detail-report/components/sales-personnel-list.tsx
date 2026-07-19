"use client";

import { useState } from "react";
import { User, ChevronRight } from "lucide-react";

interface SalesPersonnel {
  id: string;
  name: string;
  totalSales: number;
  orderCount: number;
}

interface SalesPersonnelListProps {
  startDate: string;
  endDate: string;
  onSelectPersonnel: (personnel: SalesPersonnel) => void;
  selectedPersonnelId?: string;
}

export function SalesPersonnelList({ 
  startDate, 
  endDate, 
  onSelectPersonnel,
  selectedPersonnelId 
}: SalesPersonnelListProps) {
  // Mock data - in real implementation, this would come from API
  const personnelList: SalesPersonnel[] = [
    {
      id: "1",
      name: "Ahmet Yılmaz",
      totalSales: 512450.00,
      orderCount: 98,
    },
    {
      id: "2",
      name: "Mehmet Demir",
      totalSales: 398200.00,
      orderCount: 74,
    },
    {
      id: "3",
      name: "Elif Kaya",
      totalSales: 201750.00,
      orderCount: 42,
    },
    {
      id: "4",
      name: "Murat Aksoy",
      totalSales: 133350.00,
      orderCount: 28,
    },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('tr-TR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('tr-TR').format(value);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800">Satış Personeli Listesi</h3>
      </div>
      
      <div className="divide-y divide-slate-100">
        {personnelList.map((personnel) => (
          <button
            key={personnel.id}
            onClick={() => onSelectPersonnel(personnel)}
            className={`w-full p-4 text-left hover:bg-slate-50 transition-colors ${
              selectedPersonnelId === personnel.id ? "bg-indigo-50 border-l-4 border-indigo-600" : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                  <User size={18} className="text-slate-500" />
                </div>
                <div>
                  <p className="font-medium text-slate-800">{personnel.name}</p>
                  <p className="text-sm text-slate-500">{formatNumber(personnel.orderCount)} sipariş</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="font-semibold text-slate-800">{formatCurrency(personnel.totalSales)} ₺</p>
                </div>
                {selectedPersonnelId === personnel.id && (
                  <ChevronRight size={20} className="text-indigo-600" />
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
