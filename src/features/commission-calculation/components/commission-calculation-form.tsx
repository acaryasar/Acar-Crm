"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { Calculator, Calendar, User, FileText, TrendingUp } from "lucide-react";

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
      alert("Lütfen kullanıcı ve kural seçin");
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
      alert("Hesaplama başarısız oldu");
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
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <TrendingUp size={20} className="text-blue-600" />
                </div>
                <span className="text-sm font-medium text-blue-700">{t("totalSales")}</span>
              </div>
              <div className="text-3xl font-bold text-blue-900">
                ₺{results.totalSales.toLocaleString()}
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-6 border border-emerald-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <Calculator size={20} className="text-emerald-600" />
                </div>
                <span className="text-sm font-medium text-emerald-700">{t("totalCommission")}</span>
              </div>
              <div className="text-3xl font-bold text-emerald-900">
                ₺{results.totalCommission.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Sales Details */}
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

          {/* Commission Details */}
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
        </div>
      )}

      {!calculated && (
        <div className="text-center py-16 text-slate-500">
          <Calculator size={48} className="mx-auto mb-4 text-slate-300" />
          <p className="text-sm">{t("noData")}</p>
        </div>
      )}
    </div>
  );
}
