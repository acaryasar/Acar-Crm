"use client";

import { createCompany, updateCompany } from "@/features/companies/actions/create-company";
import { Building2, Mail, Phone, Globe, MapPin, CreditCard, FileText } from "lucide-react";
import { useTranslations } from "next-intl";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition";

const inputClassReadonly =
  "w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-2.5 text-sm text-slate-600 outline-none";

const labelClass = "block text-sm font-medium text-slate-700 mb-1.5";

interface CompanyFormProps {
  mode?: "create" | "edit" | "view";
  company?: {
    id: string;
    name: string;
    taxId?: string | null;
    taxOffice?: string | null;
    email?: string | null;
    phone?: string | null;
    website?: string | null;
    street?: string | null;
    city?: string | null;
    postalCode?: string | null;
    country?: string | null;
    bankName?: string | null;
    iban?: string | null;
  };
}

export function CompanyForm({ mode = "create", company }: CompanyFormProps) {
  const t = useTranslations("companies");
  const isReadonly = mode === "view";
  const action = mode === "create" ? createCompany : updateCompany;

  return (
    <form id="company-form" action={action} className="space-y-5">
      {mode !== "create" && company && (
        <input type="hidden" name="id" value={company.id} />
      )}
      
      <div className="grid grid-cols-2 gap-4">
        {/* Temel Bilgiler */}
        <div className="col-span-1 space-y-5">
          {/* Personal Info */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <Building2 size={16} className="text-indigo-500" />
              <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                {t("basicInfo")}
              </h2>
            </div>

            <div>
              <label className={labelClass}>{t("name")}</label>
              <input
                name="name"
                defaultValue={company?.name}
                placeholder="Handwerk GmbH"
                className={isReadonly ? inputClassReadonly : inputClass}
                readOnly={isReadonly}
                required={!isReadonly}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>{t("taxId")}</label>
                <input
                  name="taxId"
                  defaultValue={company?.taxId || ""}
                  placeholder="TR1234567890"
                  className={isReadonly ? inputClassReadonly : inputClass}
                  readOnly={isReadonly}
                />
              </div>
              <div>
                <label className={labelClass}>{t("taxOffice")}</label>
                <input
                  name="taxOffice"
                  defaultValue={company?.taxOffice || ""}
                  placeholder="Vergi Dairesi"
                  className={isReadonly ? inputClassReadonly : inputClass}
                  readOnly={isReadonly}
                />
              </div>
            </div>
          </div>
           {/* Banka Bilgileri */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <CreditCard size={16} className="text-indigo-500" />
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
              {t("bankInfo")}
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>{t("bankName")}</label>
              <input
                name="bankName"
                defaultValue={company?.bankName || ""}
                placeholder="Garanti BBVA"
                className={isReadonly ? inputClassReadonly : inputClass}
                readOnly={isReadonly}
              />
            </div>
            <div>
              <label className={labelClass}>{t("iban")}</label>
              <input
                name="iban"
                defaultValue={company?.iban || ""}
                placeholder="TR00 0000 0000 0000 0000 0000 00"
                className={isReadonly ? inputClassReadonly : inputClass}
                readOnly={isReadonly}
              />
            </div>
          </div>
        </div>
        </div>
        {/* Right Column - Address */}
        <div className="col-span-1 space-y-5">
        {/* İletişim Bilgileri */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Mail size={16} className="text-indigo-500" />
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
              {t("contactInfo")}
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>{t("email")}</label>
              <input
                name="email"
                type="email"
                defaultValue={company?.email || ""}
                placeholder="info@company.com"
                className={isReadonly ? inputClassReadonly : inputClass}
                readOnly={isReadonly}
              />
            </div>
            <div>
              <label className={labelClass}>{t("phone")}</label>
              <input
                name="phone"
                defaultValue={company?.phone || ""}
                placeholder="+90 212 123 45 67"
                className={isReadonly ? inputClassReadonly : inputClass}
                readOnly={isReadonly}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>{t("website")}</label>
            <input
              name="website"
              defaultValue={company?.website || ""}
              placeholder="https://www.company.com"
              className={isReadonly ? inputClassReadonly : inputClass}
              readOnly={isReadonly}
            />
          </div>
        </div>
        {/* Adres Bilgileri */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <MapPin size={16} className="text-indigo-500" />
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
              {t("addressInfo")}
            </h2>
          </div>

          <div>
            <label className={labelClass}>{t("street")}</label>
            <input
              name="street"
              defaultValue={company?.street || ""}
              placeholder="123 Main Street"
              className={isReadonly ? inputClassReadonly : inputClass}
              readOnly={isReadonly}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelClass}>{t("city")}</label>
              <input
                name="city"
                defaultValue={company?.city || ""}
                placeholder="İstanbul"
                className={isReadonly ? inputClassReadonly : inputClass}
                readOnly={isReadonly}
              />
            </div>
            <div>
              <label className={labelClass}>{t("postalCode")}</label>
              <input
                name="postalCode"
                defaultValue={company?.postalCode || ""}
                placeholder="34000"
                className={isReadonly ? inputClassReadonly : inputClass}
                readOnly={isReadonly}
              />
            </div>
            <div>
              <label className={labelClass}>{t("country")}</label>
              <input
                name="country"
                defaultValue={company?.country || ""}
                placeholder="Türkiye"
                className={isReadonly ? inputClassReadonly : inputClass}
                readOnly={isReadonly}
              />
            </div>
          </div>
        </div>
        </div>
      </div>

      
    </form>
  );
}
