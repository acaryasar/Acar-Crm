"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { useTranslations } from "next-intl";

interface SalesDetailsTableProps {
  personnelId: string;
  startDate: string;
  endDate: string;
}

interface SaleDetail {
  id: string;
  date: string;
  documentNo: string;
  customer: string;
  amount: number;
  discount: number;
  vat: number;
  grandTotal: number;
  commission: number;
}

export function SalesDetailsTable({ personnelId, startDate, endDate }: SalesDetailsTableProps) {
  const t = useTranslations("salesPersonnelDetailReport");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock data - in real implementation, this would come from API based on personnel and date range
  const mockData: SaleDetail[] = [
    {
      id: "1",
      date: "31.05.2024",
      documentNo: "SIP-2024-0256",
      customer: "ABC Teknoloji A.Ş.",
      amount: 45000.00,
      discount: 2250.00,
      vat: 8550.00,
      grandTotal: 51300.00,
      commission: 5130.00,
    },
    {
      id: "2",
      date: "30.05.2024",
      documentNo: "SIP-2024-0255",
      customer: "XYZ Lojistik Ltd. Şti.",
      amount: 32000.00,
      discount: 1600.00,
      vat: 6080.00,
      grandTotal: 36480.00,
      commission: 3648.00,
    },
    {
      id: "3",
      date: "29.05.2024",
      documentNo: "SIP-2024-0254",
      customer: "DEF Endüstriyel",
      amount: 68000.00,
      discount: 3400.00,
      vat: 12920.00,
      grandTotal: 77520.00,
      commission: 7752.00,
    },
    {
      id: "4",
      date: "28.05.2024",
      documentNo: "SIP-2024-0253",
      customer: "GHI Otomotiv",
      amount: 15000.00,
      discount: 750.00,
      vat: 2850.00,
      grandTotal: 17100.00,
      commission: 1710.00,
    },
    {
      id: "5",
      date: "27.05.2024",
      documentNo: "SIP-2024-0252",
      customer: "JKL İnşaat",
      amount: 52000.00,
      discount: 2600.00,
      vat: 9880.00,
      grandTotal: 59280.00,
      commission: 5928.00,
    },
    {
      id: "6",
      date: "26.05.2024",
      documentNo: "SIP-2024-0251",
      customer: "MNO Elektronik",
      amount: 28000.00,
      discount: 1400.00,
      vat: 5320.00,
      grandTotal: 31920.00,
      commission: 3192.00,
    },
    {
      id: "7",
      date: "25.05.2024",
      documentNo: "SIP-2024-0250",
      customer: "PQR Makine",
      amount: 41000.00,
      discount: 2050.00,
      vat: 7790.00,
      grandTotal: 46740.00,
      commission: 4674.00,
    },
    {
      id: "8",
      date: "24.05.2024",
      documentNo: "SIP-2024-0249",
      customer: "STU Metal",
      amount: 19000.00,
      discount: 950.00,
      vat: 3610.00,
      grandTotal: 21660.00,
      commission: 2166.00,
    },
    {
      id: "9",
      date: "23.05.2024",
      documentNo: "SIP-2024-0248",
      customer: "VYZ Kimya",
      amount: 35000.00,
      discount: 1750.00,
      vat: 6650.00,
      grandTotal: 39900.00,
      commission: 3990.00,
    },
    {
      id: "10",
      date: "22.05.2024",
      documentNo: "SIP-2024-0247",
      customer: "ABC Teknoloji A.Ş.",
      amount: 42000.00,
      discount: 2100.00,
      vat: 7980.00,
      grandTotal: 47880.00,
      commission: 4788.00,
    },
  ];

  const totalItems = 98; // Mock total count
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

  const totals = {
    amount: currentData.reduce((sum, item) => sum + item.amount, 0),
    discount: currentData.reduce((sum, item) => sum + item.discount, 0),
    vat: currentData.reduce((sum, item) => sum + item.vat, 0),
    grandTotal: currentData.reduce((sum, item) => sum + item.grandTotal, 0),
    commission: currentData.reduce((sum, item) => sum + item.commission, 0),
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
            <h3 className="text-lg font-semibold text-slate-800">{String(t("salesDetails"))}</h3>
            <p className="text-sm text-slate-500">{String(t("totalRecords"))}: {totalItems}</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-3">
                {String(t("date"))}
              </th>
              <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-3">
                {String(t("documentNo"))}
              </th>
              <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-3">
                {String(t("customer"))}
              </th>
              <th className="text-right text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-3">
                {String(t("amount"))} (₺)
              </th>
              <th className="text-right text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-3">
                {String(t("discount"))} (₺)
              </th>
              <th className="text-right text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-3">
                {String(t("vat"))} (₺)
              </th>
              <th className="text-right text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-3">
                {String(t("grandTotal"))} (₺)
              </th>
              <th className="text-right text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-3">
                {String(t("commission"))} (₺)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {currentData.map((sale) => (
              <tr key={sale.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 text-sm text-slate-600">{sale.date}</td>
                <td className="px-6 py-4 text-sm font-medium text-slate-800">{sale.documentNo}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{sale.customer}</td>
                <td className="px-6 py-4 text-sm text-slate-600 text-right">{formatCurrency(sale.amount)}</td>
                <td className="px-6 py-4 text-sm text-slate-600 text-right">{formatCurrency(sale.discount)}</td>
                <td className="px-6 py-4 text-sm text-slate-600 text-right">{formatCurrency(sale.vat)}</td>
                <td className="px-6 py-4 text-sm font-medium text-slate-800 text-right">{formatCurrency(sale.grandTotal)}</td>
                <td className="px-6 py-4 text-sm font-medium text-emerald-600 text-right">{formatCurrency(sale.commission)}</td>
              </tr>
            ))}
            <tr className="bg-slate-50 font-semibold">
              <td className="px-6 py-4 text-sm text-slate-800" colSpan={3}>{String(t("total"))}</td>
              <td className="px-6 py-4 text-sm text-slate-800 text-right">{formatCurrency(totals.amount)}</td>
              <td className="px-6 py-4 text-sm text-slate-800 text-right">{formatCurrency(totals.discount)}</td>
              <td className="px-6 py-4 text-sm text-slate-800 text-right">{formatCurrency(totals.vat)}</td>
              <td className="px-6 py-4 text-sm text-slate-800 text-right">{formatCurrency(totals.grandTotal)}</td>
              <td className="px-6 py-4 text-sm text-emerald-700 text-right">{formatCurrency(totals.commission)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600">10 / {String(t("page"))}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={16} />
            {String(t("previous"))}
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
            {String(t("next"))}
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
