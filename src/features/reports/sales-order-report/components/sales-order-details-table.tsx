"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, FileText } from "lucide-react";

interface SalesOrderDetailsTableProps {
  startDate: string;
  endDate: string;
}

interface OrderDetail {
  id: string;
  date: string;
  documentNo: string;
  customer: string;
  salesPerson: string;
  orderCount: number;
  amount: number;
  discount: number;
  vat: number;
  grandTotal: number;
  status: "completed" | "pending" | "cancelled";
}

export function SalesOrderDetailsTable({ startDate, endDate }: SalesOrderDetailsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Mock data - in real implementation, this would come from API based on date range
  const mockData: OrderDetail[] = [
    {
      id: "1",
      date: "31.05.2024",
      documentNo: "SIP-2024-0256",
      customer: "ABC Teknoloji A.Ş.",
      salesPerson: "Ahmet Yılmaz",
      orderCount: 3,
      amount: 45000.00,
      discount: 2250.00,
      vat: 8550.00,
      grandTotal: 51300.00,
      status: "completed",
    },
    {
      id: "2",
      date: "30.05.2024",
      documentNo: "SIP-2024-0255",
      customer: "XYZ Lojistik Ltd. Şti.",
      salesPerson: "Mehmet Demir",
      orderCount: 2,
      amount: 32000.00,
      discount: 1600.00,
      vat: 6080.00,
      grandTotal: 36480.00,
      status: "completed",
    },
    {
      id: "3",
      date: "29.05.2024",
      documentNo: "SIP-2024-0254",
      customer: "DEF Endüstriyel",
      salesPerson: "Ayşe Kaya",
      orderCount: 5,
      amount: 68000.00,
      discount: 3400.00,
      vat: 12920.00,
      grandTotal: 77520.00,
      status: "pending",
    },
    {
      id: "4",
      date: "28.05.2024",
      documentNo: "SIP-2024-0253",
      customer: "GHI Otomotiv",
      salesPerson: "Ahmet Yılmaz",
      orderCount: 1,
      amount: 15000.00,
      discount: 750.00,
      vat: 2850.00,
      grandTotal: 17100.00,
      status: "completed",
    },
    {
      id: "5",
      date: "27.05.2024",
      documentNo: "SIP-2024-0252",
      customer: "JKL İnşaat",
      salesPerson: "Fatma Şahin",
      orderCount: 4,
      amount: 52000.00,
      discount: 2600.00,
      vat: 9880.00,
      grandTotal: 59280.00,
      status: "completed",
    },
    {
      id: "6",
      date: "26.05.2024",
      documentNo: "SIP-2024-0251",
      customer: "MNO Elektronik",
      salesPerson: "Mehmet Demir",
      orderCount: 2,
      amount: 28000.00,
      discount: 1400.00,
      vat: 5320.00,
      grandTotal: 31920.00,
      status: "cancelled",
    },
    {
      id: "7",
      date: "25.05.2024",
      documentNo: "SIP-2024-0250",
      customer: "PQR Makine",
      salesPerson: "Ayşe Kaya",
      orderCount: 3,
      amount: 41000.00,
      discount: 2050.00,
      vat: 7790.00,
      grandTotal: 46740.00,
      status: "completed",
    },
    {
      id: "8",
      date: "24.05.2024",
      documentNo: "SIP-2024-0249",
      customer: "STU Metal",
      salesPerson: "Ahmet Yılmaz",
      orderCount: 1,
      amount: 19000.00,
      discount: 950.00,
      vat: 3610.00,
      grandTotal: 21660.00,
      status: "completed",
    },
  ];

  const totalItems = 256; // Mock total count
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = mockData.slice(startIndex, endIndex);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('tr-TR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const getStatusBadge = (status: OrderDetail["status"]) => {
    const statusConfig = {
      completed: {
        label: "Tamamlandı",
        className: "bg-emerald-50 text-emerald-700 border-emerald-200",
      },
      pending: {
        label: "Beklemede",
        className: "bg-amber-50 text-amber-700 border-amber-200",
      },
      cancelled: {
        label: "İptal",
        className: "bg-red-50 text-red-700 border-red-200",
      },
    };

    const config = statusConfig[status];
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${config.className}`}>
        {config.label}
      </span>
    );
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-100 flex items-center justify-center">
            <FileText size={20} className="text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800">Satış / Sipariş Detayları</h3>
            <p className="text-sm text-slate-500">Toplam {totalItems} kayıt</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-3">
                Tarih
              </th>
              <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-3">
                Belge No
              </th>
              <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-3">
                Müşteri
              </th>
              <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-3">
                Satış Personeli
              </th>
              <th className="text-right text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-3">
                Sipariş Adedi
              </th>
              <th className="text-right text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-3">
                Tutar (₺)
              </th>
              <th className="text-right text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-3">
                İskonto (₺)
              </th>
              <th className="text-right text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-3">
                KDV (₺)
              </th>
              <th className="text-right text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-3">
                Genel Toplam (₺)
              </th>
              <th className="text-center text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-3">
                Durum
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {currentData.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 text-sm text-slate-600">{order.date}</td>
                <td className="px-6 py-4 text-sm font-medium text-slate-800">{order.documentNo}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{order.customer}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{order.salesPerson}</td>
                <td className="px-6 py-4 text-sm text-slate-600 text-right">{order.orderCount}</td>
                <td className="px-6 py-4 text-sm text-slate-600 text-right">{formatCurrency(order.amount)}</td>
                <td className="px-6 py-4 text-sm text-slate-600 text-right">{formatCurrency(order.discount)}</td>
                <td className="px-6 py-4 text-sm text-slate-600 text-right">{formatCurrency(order.vat)}</td>
                <td className="px-6 py-4 text-sm font-medium text-slate-800 text-right">{formatCurrency(order.grandTotal)}</td>
                <td className="px-6 py-4 text-center">{getStatusBadge(order.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
        <div className="text-sm text-slate-600">
          {startIndex + 1}-{Math.min(endIndex, totalItems)} / {totalItems} kayıt
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={16} />
            Önceki
          </button>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 text-sm font-medium rounded-lg transition-colors ${
                    currentPage === pageNum
                      ? "bg-indigo-600 text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            {totalPages > 5 && (
              <>
                <span className="text-slate-400">...</span>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className={`w-8 h-8 text-sm font-medium rounded-lg transition-colors ${
                    currentPage === totalPages
                      ? "bg-indigo-600 text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Sonraki
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
