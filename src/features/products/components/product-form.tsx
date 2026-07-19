"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Package, DollarSign, Box, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition";

const inputClassReadonly =
  "w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-2.5 text-sm text-slate-600 outline-none";

const labelClass = "block text-sm font-medium text-slate-700 mb-1.5";

interface ProductFormProps {
  mode?: "create" | "edit" | "view";
  product?: {
    id: string;
    code: string;
    name: string;
    description: string | null;
    categoryId: string | null;
    unit: string;
    purchasePrice: string | null;
    salePrice: string;
    taxRate: string;
    currentStock: number;
    minStock: number;
    maxStock: number | null;
    barcode: string | null;
    imageUrl: string | null;
    isActive: boolean;
  };
}

export function ProductForm({ mode = "create", product }: ProductFormProps) {
  const router = useRouter();
  const t = useTranslations("products");
  const [loading, setLoading] = useState(false);
  const isReadonly = mode === "view";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const body: any = {
      code: String(formData.get("code")),
      name: String(formData.get("name")),
      description: String(formData.get("description") || ""),
      categoryId: String(formData.get("categoryId") || ""),
      unit: String(formData.get("unit")),
      purchasePrice: String(formData.get("purchasePrice") || ""),
      salePrice: String(formData.get("salePrice")),
      taxRate: String(formData.get("taxRate")),
      currentStock: parseInt(String(formData.get("currentStock")) || "0"),
      minStock: parseInt(String(formData.get("minStock")) || "0"),
      maxStock: formData.get("maxStock") ? parseInt(String(formData.get("maxStock"))) : null,
      barcode: String(formData.get("barcode") || ""),
      imageUrl: String(formData.get("imageUrl") || ""),
      isActive: formData.get("isActive") === "true",
    };

    if (mode === "edit") {
      body.id = product?.id;
    }

    const url = mode === "create" ? "/api/products" : `/api/products`;
    const method = mode === "create" ? "POST" : "POST";

    if (mode === "create") {
      await fetch(url, {
        method,
        body: JSON.stringify(body),
      });
    } else {
      await fetch(url, {
        method,
        body: JSON.stringify({
          ...body,
          action: "update",
        }),
      });
    }

    setLoading(false);
    router.push("/products");
  }

  return (
    <form id="product-form" onSubmit={handleSubmit} className="space-y-5">
      {mode !== "create" && product && (
        <input type="hidden" name="id" value={product.id} />
      )}
      
      <div className="grid grid-cols-3 gap-5">
        {/* Left Column - Product Info */}
        <div className="col-span-2 space-y-5">
          {/* Product Info */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Package size={16} className="text-indigo-500" />
              <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">{t("productInformation")}</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>{t("code")}</label>
                <input 
                  name="code" 
                  placeholder="PRD-001" 
                  defaultValue={product?.code}
                  className={isReadonly ? inputClassReadonly : inputClass} 
                  readOnly={isReadonly}
                  required={!isReadonly}
                />
              </div>
              <div>
                <label className={labelClass}>{t("barcode")}</label>
                <input 
                  name="barcode" 
                  placeholder="1234567890" 
                  defaultValue={product?.barcode || ""}
                  className={isReadonly ? inputClassReadonly : inputClass} 
                  readOnly={isReadonly}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>{t("name")}</label>
              <input 
                name="name" 
                placeholder="Product Name" 
                defaultValue={product?.name}
                className={isReadonly ? inputClassReadonly : inputClass} 
                readOnly={isReadonly}
                required={!isReadonly}
              />
            </div>

            <div>
              <label className={labelClass}>{t("description")}</label>
              <textarea
                name="description"
                rows={3}
                placeholder="Product description..."
                className={isReadonly ? inputClassReadonly : inputClass}
                defaultValue={product?.description || ""}
                readOnly={isReadonly}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>{t("category")}</label>
                <select 
                  name="categoryId" 
                  defaultValue={product?.categoryId || ""}
                  className={isReadonly ? inputClassReadonly : inputClass}
                  disabled={isReadonly}
                >
                  <option value="">Kategori Seçiniz</option>
                  <option value="cat1">Analitik Cihazlar</option>
                  <option value="cat2">Radyografi Test Ürünleri</option>
                  <option value="cat3">Ultrasonik Test Ürünleri</option>
                  <option value="cat4">Penetrant Test Ürünleri</option>
                  <option value="cat5">Sertlik Ölçüm Cihazları</option>
                  <option value="cat6">Eğitim ve Sertifikasyon</option>
                  <option value="cat7">Manyetik Parçacık Test Ürünleri</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>
                  <span className="flex items-center gap-1.5"><Box size={12} />{t("unit")}</span>
                </label>
                <select 
                  name="unit" 
                  defaultValue={product?.unit || "PIECE"}
                  className={isReadonly ? inputClassReadonly : inputClass}
                  disabled={isReadonly}
                >
                  <option value="PIECE">Adet</option>
                  <option value="KG">Kilogram</option>
                  <option value="M">Metre</option>
                  <option value="M2">Metrekare</option>
                  <option value="M3">Metreküp</option>
                  <option value="LT">Litre</option>
                  <option value="SET">Set</option>
                  <option value="BOX">Kutu</option>
                  <option value="PACKAGE">Paket</option>
                </select>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign size={16} className="text-indigo-500" />
              <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">{t("pricing")}</h2>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>{t("purchasePrice")}</label>
                <input 
                  name="purchasePrice" 
                  type="number"
                  step="0.01"
                  placeholder="0.00" 
                  defaultValue={product?.purchasePrice || ""}
                  className={isReadonly ? inputClassReadonly : inputClass} 
                  readOnly={isReadonly}
                />
              </div>
              <div>
                <label className={labelClass}>{t("salePrice")}</label>
                <input 
                  name="salePrice" 
                  type="number"
                  step="0.01"
                  placeholder="0.00" 
                  defaultValue={product?.salePrice}
                  className={isReadonly ? inputClassReadonly : inputClass} 
                  readOnly={isReadonly}
                  required={!isReadonly}
                />
              </div>
              <div>
                <label className={labelClass}>{t("taxRate")} (%)</label>
                <input 
                  name="taxRate" 
                  type="number"
                  step="0.01"
                  placeholder="0" 
                  defaultValue={product?.taxRate}
                  className={isReadonly ? inputClassReadonly : inputClass} 
                  readOnly={isReadonly}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Stock & Status */}
        <div className="col-span-1 space-y-5">
          {/* Stock */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Box size={16} className="text-indigo-500" />
              <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">{t("stockInformation")}</h2>
            </div>

            <div>
              <label className={labelClass}>{t("currentStock")}</label>
              <input 
                name="currentStock" 
                type="number"
                placeholder="0" 
                defaultValue={product?.currentStock || 0}
                className={isReadonly ? inputClassReadonly : inputClass} 
                readOnly={isReadonly}
              />
            </div>

            <div>
              <label className={labelClass}>{t("minStock")}</label>
              <input 
                name="minStock" 
                type="number"
                placeholder="0" 
                defaultValue={product?.minStock || 0}
                className={isReadonly ? inputClassReadonly : inputClass} 
                readOnly={isReadonly}
              />
            </div>

            <div>
              <label className={labelClass}>{t("maxStock")}</label>
              <input 
                name="maxStock" 
                type="number"
                placeholder="Optional" 
                defaultValue={product?.maxStock || ""}
                className={isReadonly ? inputClassReadonly : inputClass} 
                readOnly={isReadonly}
              />
            </div>
          </div>

          {/* Status */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Package size={16} className="text-indigo-500" />
              <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">{t("status")}</h2>
            </div>

            <div>
              <label className={labelClass}>{t("isActive")}</label>
              <select 
                name="isActive" 
                defaultValue={product?.isActive ? "true" : "false"}
                className={isReadonly ? inputClassReadonly : inputClass}
                disabled={isReadonly}
              >
                <option value="true">Aktif</option>
                <option value="false">Pasif</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>{t("imageUrl")}</label>
              <input 
                name="imageUrl" 
                placeholder="https://..." 
                defaultValue={product?.imageUrl || ""}
                className={isReadonly ? inputClassReadonly : inputClass} 
                readOnly={isReadonly}
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
