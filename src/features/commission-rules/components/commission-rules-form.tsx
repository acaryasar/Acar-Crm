"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

interface Props {
  mode: "create" | "edit" | "view";
  rule?: any;
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission
    console.log("Form data:", formData);
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
    </form>
  );
}
