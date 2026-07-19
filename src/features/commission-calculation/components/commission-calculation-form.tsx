"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { Calculator, Calendar, User, FileText, TrendingUp, Eye, X, AlertCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function CommissionCalculationForm() {
  const t = useTranslations("commission");
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [selectedRule, setSelectedRule] = useState("");
  const [calculated, setCalculated] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [rules, setRules] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUserForDetail, setSelectedUserForDetail] = useState<any>(null);
  const [showValidationDialog, setShowValidationDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);

  // Generate months for current year
  const currentYear = new Date().getFullYear();
  const months = [
    { value: "all", label: t("allPeriods") },
    ...Array.from({ length: 12 }, (_, i) => {
      const monthNames = [
        t("january"), t("february"), t("march"), t("april"),
        t("may"), t("june"), t("july"), t("august"),
        t("september"), t("october"), t("november"), t("december")
      ];
      return {
        value: `${currentYear}-${String(i + 1).padStart(2, '0')}`,
        label: `${monthNames[i]} ${currentYear}`
      };
    })
  ];

  useEffect(() => {
    fetchRules();
    fetchUsers();
  }, []);

  const fetchRules = async () => {
    try {
      const response = await fetch("/api/commission-rules/list");
      const data = await response.json();
      if (data.data) {
        setRules(data.data);
      }
    } catch (error) {
      console.error("Error fetching rules:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users/list");
      const data = await response.json();
      if (data.data) {
        setUsers(data.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleCalculate = async () => {
    if (!selectedUser || !selectedRule) {
      setShowValidationDialog(true);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/commission-calculation/calculate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: selectedUser,
          period: selectedPeriod,
          ruleId: selectedRule,
        }),
      });

      const data = await response.json();
      if (data.data) {
        setResults(data.data);
        setCalculated(true);
      }
    } catch (error) {
      console.error("Error calculating commission:", error);
      setShowErrorDialog(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      {/* Filter Section */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
            <User size={16} />
            {t("selectUser")}
          </label>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">Kullanıcı Seçin</option>
            <option value="all">Tümü</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.firstName} {user.lastName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
            <Calendar size={16} />
            {t("period")}
          </label>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
            <FileText size={16} />
            {t("selectRule")}
          </label>
          <select
            value={selectedRule}
            onChange={(e) => setSelectedRule(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">Kural Seçin</option>
            {rules.map((rule) => (
              <option key={rule.id} value={rule.id}>
                {rule.name} ({t(rule.commissionType?.toLowerCase() || "percentage")})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end mb-6">
        <button
          onClick={handleCalculate}
          disabled={loading}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-6 py-2.5 rounded-xl transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Calculator size={16} />
          {loading ? "Hesaplanıyor..." : t("calculate")}
        </button>
      </div>

      {calculated && results && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <TrendingUp size={20} className="text-blue-600" />
                </div>
                <span className="text-sm font-medium text-blue-700">
                  {results.isAllUsers ? "Ortalama Satış" : t("totalSales")}
                </span>
              </div>
              <div className="text-3xl font-bold text-blue-900">
                ₺{(results.isAllUsers ? results.averageSales : results.totalSales).toLocaleString()}
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-6 border border-emerald-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <Calculator size={20} className="text-emerald-600" />
                </div>
                <span className="text-sm font-medium text-emerald-700">
                  {results.isAllUsers ? "Toplam Prim" : t("totalCommission")}
                </span>
              </div>
              <div className="text-3xl font-bold text-emerald-900">
                ₺{(results.isAllUsers ? results.userCommissions?.reduce((sum: number, u: any) => sum + u.commission, 0) : results.totalCommission).toLocaleString()}
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Calculator size={20} className="text-purple-600" />
                </div>
                <span className="text-sm font-medium text-purple-700">
                  {results.isAllUsers ? "Ortalama Prim" : "Prim Oranı"}
                </span>
              </div>
              <div className="text-3xl font-bold text-purple-900">
                {results.isAllUsers 
                  ? `₺${results.averageCommission.toLocaleString()}`
                  : `${results.totalSales > 0 ? ((results.totalCommission / results.totalSales) * 100).toFixed(2) : '0.00'}%`
                }
              </div>
            </div>
          </div>

          {/* User Commissions Table (shown when all users selected) */}
          {results.isAllUsers && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-800">
                  Kullanıcı Prim Listesi ({results.totalUsers} kullanıcı)
                </h3>
                <button
                  onClick={() => setSelectedUserForDetail(null)}
                  className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors shadow-sm"
                >
                  <Eye size={16} />
                  Detay Görüntüle
                </button>
              </div>
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 py-3">
                        Kullanıcı
                      </th>
                      <th className="text-right text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 py-3">
                        Toplam Satış
                      </th>
                      <th className="text-right text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 py-3">
                        Prim Tutarı
                      </th>
                      <th className="text-right text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 py-3">
                        Ortalama Prim Oranı %
                      </th>
                      <th className="text-center text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 py-3">
                        İşlemler
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {results.userCommissions.map((user: any) => (
                      <tr key={user.userId} className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-sm text-slate-600">{user.userName}</td>
                        <td className="px-4 py-3 text-sm text-slate-600 text-right">
                          ₺{user.totalSales.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600 text-right">
                          ₺{user.commission.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600 text-right">
                          {user.totalSales > 0 ? ((user.commission / user.totalSales) * 100).toFixed(2) : '0.00'}%
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => setSelectedUserForDetail(user)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Detay Görüntüle"
                          >
                            <Eye size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* User Detail Modal */}
          {selectedUserForDetail && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800">
                      {selectedUserForDetail.userName} - Prim Detayları
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                      Toplam Satış: ₺{selectedUserForDetail.totalSales.toLocaleString()} | 
                      Prim Tutarı: ₺{selectedUserForDetail.commission.toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedUserForDetail(null)}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                          <TrendingUp size={20} className="text-blue-600" />
                        </div>
                        <span className="text-sm font-medium text-blue-700">Toplam Satış</span>
                      </div>
                      <div className="text-3xl font-bold text-blue-900">
                        ₺{selectedUserForDetail.totalSales.toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-6 border border-emerald-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                          <Calculator size={20} className="text-emerald-600" />
                        </div>
                        <span className="text-sm font-medium text-emerald-700">Prim Tutarı</span>
                      </div>
                      <div className="text-3xl font-bold text-emerald-900">
                        ₺{selectedUserForDetail.commission.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100 mb-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                        <Calculator size={20} className="text-purple-600" />
                      </div>
                      <span className="text-sm font-medium text-purple-700">Prim Oranı</span>
                    </div>
                    <div className="text-3xl font-bold text-purple-900">
                      {selectedUserForDetail.totalSales > 0 
                        ? ((selectedUserForDetail.commission / selectedUserForDetail.totalSales) * 100).toFixed(2)
                        : '0.00'}%
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-6">
                    <h4 className="text-sm font-semibold text-slate-700 mb-4">Kullanıcı Bilgileri</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-500">Kullanıcı ID:</span>
                        <span className="ml-2 text-slate-700">{selectedUserForDetail.userId}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Kullanıcı Adı:</span>
                        <span className="ml-2 text-slate-700">{selectedUserForDetail.userName}</span>
                      </div>
                    </div>
                  </div>

                  {/* Sales Details */}
                  {selectedUserForDetail.salesDetails && selectedUserForDetail.salesDetails.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-slate-700 mb-4">Satış Detayları</h4>
                      <div className="rounded-xl border border-slate-200 overflow-hidden">
                        <table className="w-full">
                          <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                              <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 py-3">
                                Sipariş No
                              </th>
                              <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 py-3">
                                Tarih
                              </th>
                              <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 py-3">
                                Müşteri
                              </th>
                              <th className="text-right text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 py-3">
                                Tutar
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200">
                            {selectedUserForDetail.salesDetails.map((sale: any) => (
                              <tr key={sale.id} className="hover:bg-slate-50">
                                <td className="px-4 py-3 text-sm text-slate-600">{sale.orderNumber}</td>
                                <td className="px-4 py-3 text-sm text-slate-600">
                                  {new Date(sale.date).toLocaleDateString('tr-TR')}
                                </td>
                                <td className="px-4 py-3 text-sm text-slate-600">{sale.customer}</td>
                                <td className="px-4 py-3 text-sm text-slate-600 text-right">
                                  ₺{sale.amount.toLocaleString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Commission Details */}
                  {selectedUserForDetail.commissionDetails && selectedUserForDetail.commissionDetails.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-slate-700 mb-4">Prim Detayları</h4>
                      <div className="rounded-xl border border-slate-200 overflow-hidden">
                        <table className="w-full">
                          <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                              <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 py-3">
                                Kademe
                              </th>
                              <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 py-3">
                                Oran
                              </th>
                              <th className="text-right text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 py-3">
                                Prim Tutarı
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200">
                            {selectedUserForDetail.commissionDetails.map((detail: any, index: number) => (
                              <tr key={index} className="hover:bg-slate-50">
                                <td className="px-4 py-3 text-sm text-slate-600">{detail.tier}</td>
                                <td className="px-4 py-3 text-sm text-slate-600">{detail.rate}</td>
                                <td className="px-4 py-3 text-sm text-slate-600 text-right">
                                  ₺{detail.amount.toLocaleString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Sales Details (shown only for single user) */}
          {!results.isAllUsers && (
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">{t("salesDetails")}</h3>
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 py-3">
                        Sipariş No
                      </th>
                      <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 py-3">
                        Tarih
                      </th>
                      <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 py-3">
                        Müşteri
                      </th>
                      <th className="text-right text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 py-3">
                        Tutar
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {results.salesDetails.map((sale: any) => (
                      <tr key={sale.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-sm text-slate-600">{sale.orderNumber}</td>
                        <td className="px-4 py-3 text-sm text-slate-600">
                          {new Date(sale.date).toLocaleDateString('tr-TR')}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600">{sale.customer}</td>
                        <td className="px-4 py-3 text-sm text-slate-600 text-right">
                          ₺{sale.amount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Commission Details (shown only for single user) */}
          {!results.isAllUsers && (
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">{t("commissionDetails")}</h3>
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 py-3">
                        Kademe
                      </th>
                      <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 py-3">
                        Oran
                      </th>
                      <th className="text-right text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 py-3">
                        Prim Tutarı
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {results.commissionDetails.map((detail: any, index: number) => (
                      <tr key={index} className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-sm text-slate-600">{detail.tier}</td>
                        <td className="px-4 py-3 text-sm text-slate-600">{detail.rate}</td>
                        <td className="px-4 py-3 text-sm text-slate-600 text-right">
                          ₺{detail.amount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {!calculated && (
        <div className="text-center py-16 text-slate-500">
          <Calculator size={48} className="mx-auto mb-4 text-slate-300" />
          <p className="text-sm">{t("noData")}</p>
        </div>
      )}

      {/* Validation Dialog */}
      <AlertDialog open={showValidationDialog} onOpenChange={setShowValidationDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              <AlertDialogTitle>Eksik Bilgi</AlertDialogTitle>
            </div>
            <AlertDialogDescription>
              Lütfen kullanıcı ve kural seçin
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowValidationDialog(false)}>
              Tamam
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Error Dialog */}
      <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <AlertDialogTitle>Hata</AlertDialogTitle>
            </div>
            <AlertDialogDescription>
              Hesaplama başarısız oldu
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowErrorDialog(false)}>
              Tamam
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
