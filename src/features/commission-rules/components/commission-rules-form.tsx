"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

interface Props {
  mode: "create" | "edit" | "view";
  rule?: any;
}

interface Tier {
  id?: string;
  minValue: string;
  maxValue: string;
  commissionRate: string;
  order: number;
}

export function CommissionRulesForm({ mode, rule }: Props) {
  const t = useTranslations("commission");
  const [formData, setFormData] = useState({
    name: rule?.name || "",
    description: rule?.description || "",
    commissionType: rule?.commissionType || "PERCENTAGE",
    commissionRate: rule?.commissionRate || "0",
    fixedAmount: rule?.fixedAmount || "0",
    productCategoryId: rule?.productCategoryId || "",
    salesTarget: rule?.salesTarget || "0",
    calculationPeriod: rule?.calculationPeriod || "MONTHLY",
    effectiveDate: rule?.effectiveDate ? new Date(rule.effectiveDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    expiryDate: rule?.expiryDate ? new Date(rule.expiryDate).toISOString().split('T')[0] : "",
    isActive: rule?.isActive !== undefined ? rule.isActive : true,
  });

  const [tiers, setTiers] = useState<Tier[]>(
    rule?.tiers?.map((tier: any) => ({
      id: tier.id,
      minValue: tier.minValue,
      maxValue: tier.maxValue || "",
      commissionRate: tier.commissionRate,
      order: tier.order,
    })) || []
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleTierChange = (index: number, field: keyof Tier, value: string | number) => {
    setTiers(prev => {
      const newTiers = [...prev];
      newTiers[index] = { ...newTiers[index], [field]: value };
      return newTiers;
    });
  };

  const addTier = () => {
    setTiers(prev => [
      ...prev,
      {
        minValue: "0",
        maxValue: "",
        commissionRate: "0",
        order: prev.length,
      },
    ]);
  };

  const removeTier = (index: number) => {
    setTiers(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      ...formData,
      tiers: formData.commissionType === "TIERED" ? tiers : undefined,
    };

    try {
      const url = mode === "edit" && rule?.id 
        ? `/api/commission-rules/${rule.id}`
        : "/api/commission-rules";
      
      const method = mode === "edit" ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to save commission rule");
      }

      window.location.href = "/commission-rules";
    } catch (error) {
      console.error("Error saving commission rule:", error);
      alert("Kaydetme başarısız oldu");
    }
  };

  return (
    <form id="commission-rule-form" onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {t("ruleName")} *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={mode === "view"}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500"
            required
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {t("description")}
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            disabled={mode === "view"}
            rows={3}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {t("commissionType")} *
          </label>
          <select
            name="commissionType"
            value={formData.commissionType}
            onChange={handleChange}
            disabled={mode === "view"}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500"
            required
          >
            <option value="PERCENTAGE">{t("percentage")}</option>
            <option value="FIXED">{t("fixed")}</option>
            <option value="TIERED">{t("tiered")}</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {t("commissionRate")} (%)
          </label>
          <input
            type="number"
            name="commissionRate"
            value={formData.commissionRate}
            onChange={handleChange}
            disabled={mode === "view"}
            step="0.01"
            min="0"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {t("fixedAmount")}
          </label>
          <input
            type="number"
            name="fixedAmount"
            value={formData.fixedAmount}
            onChange={handleChange}
            disabled={mode === "view"}
            step="0.01"
            min="0"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {t("salesTarget")}
          </label>
          <input
            type="number"
            name="salesTarget"
            value={formData.salesTarget}
            onChange={handleChange}
            disabled={mode === "view"}
            step="0.01"
            min="0"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {t("calculationPeriod")} *
          </label>
          <select
            name="calculationPeriod"
            value={formData.calculationPeriod}
            onChange={handleChange}
            disabled={mode === "view"}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500"
            required
          >
            <option value="DAILY">{t("daily")}</option>
            <option value="WEEKLY">{t("weekly")}</option>
            <option value="MONTHLY">{t("monthly")}</option>
            <option value="QUARTERLY">{t("quarterly")}</option>
            <option value="YEARLY">{t("yearly")}</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {t("effectiveDate")} *
          </label>
          <input
            type="date"
            name="effectiveDate"
            value={formData.effectiveDate}
            onChange={handleChange}
            disabled={mode === "view"}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {t("expiryDate")}
          </label>
          <input
            type="date"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            disabled={mode === "view"}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500"
          />
        </div>

        <div className="col-span-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              disabled={mode === "view"}
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 disabled:bg-slate-50"
            />
            <span className="text-sm font-medium text-slate-700">{t("active")}</span>
          </label>
        </div>
      </div>

      {formData.commissionType === "TIERED" && (
        <div className="mt-6 pt-6 border-t border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-800">{t("tiered")}</h3>
            {mode !== "view" && (
              <button
                type="button"
                onClick={addTier}
                className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                <Plus size={16} />
                {t("addTier")}
              </button>
            )}
          </div>

          {tiers.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">
              Henüz kademe tanımlanmadı
            </div>
          ) : (
            <div className="space-y-3">
              {tiers.map((tier, index) => (
                <div key={index} className="grid grid-cols-4 gap-3 items-end bg-slate-50 p-4 rounded-xl">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      {t("minValue")}
                    </label>
                    <input
                      type="number"
                      value={tier.minValue}
                      onChange={(e) => handleTierChange(index, "minValue", e.target.value)}
                      disabled={mode === "view"}
                      step="0.01"
                      min="0"
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-slate-100 disabled:text-slate-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      {t("maxValue")}
                    </label>
                    <input
                      type="number"
                      value={tier.maxValue}
                      onChange={(e) => handleTierChange(index, "maxValue", e.target.value)}
                      disabled={mode === "view"}
                      step="0.01"
                      min="0"
                      placeholder="Sınırsız"
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-slate-100 disabled:text-slate-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      {t("tierRate")}
                    </label>
                    <input
                      type="number"
                      value={tier.commissionRate}
                      onChange={(e) => handleTierChange(index, "commissionRate", e.target.value)}
                      disabled={mode === "view"}
                      step="0.01"
                      min="0"
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-slate-100 disabled:text-slate-500"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        {t("tierOrder")}
                      </label>
                      <input
                        type="number"
                        value={tier.order}
                        onChange={(e) => handleTierChange(index, "order", parseInt(e.target.value))}
                        disabled={mode === "view"}
                        min="0"
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-slate-100 disabled:text-slate-500"
                      />
                    </div>
                    {mode !== "view" && tiers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTier(index)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </form>
  );
}
