"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowUp, ArrowDown, Package, AlertTriangle } from "lucide-react";

interface Props {
  mode: "create" | "edit" | "view";
  stockMovement?: {
    id: string;
    productId: string;
    type: string;
    quantity: number;
    stockBefore: number;
    stockAfter: number;
    referenceType?: string;
    referenceId?: string;
    notes?: string;
  };
  selectedProduct?: {
    id: string;
    name: string;
    code: string;
    currentStock: number;
  };
}

export function StockForm({ mode, stockMovement, selectedProduct }: Props) {
  const t = useTranslations("stock");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<"IN" | "OUT">(stockMovement?.type as "IN" | "OUT" || "IN");
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    // Load products when no selected product is provided
    if (!selectedProduct) {
      fetch("/api/products")
        .then(res => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then(data => {
          if (data.products) {
            setProducts(data.products.sort((a: any, b: any) => a.name.localeCompare(b.name)));
          }
        })
        .catch(error => {
          console.error("Error loading products:", error);
        });
    }
  }, [selectedProduct]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const body: any = {
      productId: String(formData.get("productId")),
      type: String(formData.get("type")),
      quantity: parseInt(String(formData.get("quantity"))),
      referenceType: String(formData.get("referenceType") || ""),
      referenceId: String(formData.get("referenceId") || ""),
      notes: String(formData.get("notes") || ""),
    };

    try {
      const url = "/api/stock/movements";
      const method = "POST";
      
      await fetch(url, { 
        method, 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body) 
      });
      
      setLoading(false);
      router.push("/dashboard/stock");
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  }

  return (
    <form id="stock-form" onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Ürün Seçimi */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">{t("product")}</label>
          {selectedProduct ? (
            // Show selected product as read-only
            <div className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700">
              <div className="font-medium">{selectedProduct.name}</div>
              <div className="text-xs text-slate-500">{selectedProduct.code} - {t("currentStock")}: {selectedProduct.currentStock}</div>
              <input type="hidden" name="productId" value={selectedProduct.id} />
            </div>
          ) : (
            // Show product dropdown
            <select
              name="productId"
              defaultValue={stockMovement?.productId || ""}
              disabled={mode === "view"}
              required
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition disabled:bg-slate-50 disabled:text-slate-400"
            >
              <option value="">{t("selectProduct")}</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} ({product.code})
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Hareket Tipi */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">{t("movementType")}</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setSelectedType("IN")}
              disabled={mode === "view"}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                selectedType === "IN"
                  ? "bg-emerald-100 text-emerald-700 border-2 border-emerald-300"
                  : "bg-slate-50 text-slate-600 border-2 border-slate-200 hover:bg-slate-100"
              } disabled:opacity-50`}
            >
              <ArrowUp size={16} />
              {t("in")}
            </button>
            <button
              type="button"
              onClick={() => setSelectedType("OUT")}
              disabled={mode === "view"}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                selectedType === "OUT"
                  ? "bg-red-100 text-red-700 border-2 border-red-300"
                  : "bg-slate-50 text-slate-600 border-2 border-slate-200 hover:bg-slate-100"
              } disabled:opacity-50`}
            >
              <ArrowDown size={16} />
              {t("out")}
            </button>
          </div>
          <input type="hidden" name="type" value={selectedType} />
        </div>

        {/* Miktar */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">{t("quantity")}</label>
          <input
            type="number"
            name="quantity"
            defaultValue={stockMovement?.quantity || ""}
            min="1"
            disabled={mode === "view"}
            required
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition disabled:bg-slate-50 disabled:text-slate-400"
          />
        </div>

        {/* Referans Tipi */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">{t("referenceType")}</label>
          <select
            name="referenceType"
            defaultValue={stockMovement?.referenceType || ""}
            disabled={mode === "view"}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition disabled:bg-slate-50 disabled:text-slate-400"
          >
            <option value="">{t("noReference")}</option>
            <option value="ORDER">{t("order")}</option>
            <option value="PURCHASE">{t("purchase")}</option>
            <option value="MANUAL">{t("manual")}</option>
            <option value="ADJUSTMENT">{t("adjustment")}</option>
          </select>
        </div>

        {/* Referans ID */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">{t("referenceId")}</label>
          <input
            type="text"
            name="referenceId"
            defaultValue={stockMovement?.referenceId || ""}
            disabled={mode === "view"}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition disabled:bg-slate-50 disabled:text-slate-400"
          />
        </div>
      </div>

      {/* Notlar */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">{t("notes")}</label>
        <textarea
          name="notes"
          defaultValue={stockMovement?.notes || ""}
          disabled={mode === "view"}
          rows={3}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition disabled:bg-slate-50 disabled:text-slate-400 resize-none"
        />
      </div>

      {/* Stok Bilgisi */}
      {mode === "view" && stockMovement && (
        <div className="rounded-xl bg-slate-50 p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <Package size={16} />
            {t("stockInformation")}
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-slate-500">{t("stockBefore")}: </span>
              <span className="font-medium text-slate-700">{stockMovement.stockBefore}</span>
            </div>
            <div>
              <span className="text-slate-500">{t("stockAfter")}: </span>
              <span className="font-medium text-slate-700">{stockMovement.stockAfter}</span>
            </div>
            <div>
              <span className="text-slate-500">{t("change")}: </span>
              <span className={`font-medium ${stockMovement.type === "IN" ? "text-emerald-600" : "text-red-600"}`}>
                {stockMovement.type === "IN" ? "+" : "-"}{stockMovement.quantity}
              </span>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      )}
    </form>
  );
}
