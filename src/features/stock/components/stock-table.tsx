"use client";

import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ArrowUp, ArrowDown, AlertTriangle, Package } from "lucide-react";
import { useEntityDelete } from "@/hooks/use-entity-delete";
import { useEntityToggleStatus } from "@/hooks/use-entity-toggle-status";

interface Props {
  products: any[];
}

export function StockTable({ products }: Props) {
  const t = useTranslations("stock");
  const { data: session } = useSession();
  const { handleDelete, deleteId, confirmDelete, cancelDelete } = useEntityDelete(() => Promise.resolve());
  const userRole = session?.user?.role;

  return (
    <div className="rounded-xl bg-white shadow-sm border border-slate-100 overflow-hidden">
      <table className="w-full">
        <thead className="bg-slate-50 border-b border-slate-100">
          <tr>
            <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 py-3">
              {t("product")}
            </th>
            <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 py-3">
              {t("category")}
            </th>
            <th className="text-right text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 py-3">
              {t("currentStock")}
            </th>
            <th className="text-right text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 py-3">
              {t("minStock")}
            </th>
            <th className="text-right text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 py-3">
              {t("maxStock")}
            </th>
            <th className="text-right text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 py-3">
              {t("status")}
            </th>
            <th className="text-right text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 py-3">
              {t("actions")}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {products.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                {t("noProductsFound")}
              </td>
            </tr>
          ) : (
            products.map((product) => {
              const isLowStock = product.currentStock <= product.minStock;
              const isHighStock = product.maxStock && product.currentStock >= product.maxStock;
              
              return (
                <tr key={product.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center">
                        <Package size={16} className="text-slate-500" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-700">{product.name}</div>
                        <div className="text-xs text-slate-500">{product.code}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-slate-600">{product.category?.name || "-"}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={`text-sm font-medium ${
                      isLowStock ? 'text-red-600' : isHighStock ? 'text-amber-600' : 'text-emerald-600'
                    }`}>
                      {product.currentStock}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm text-slate-600">{product.minStock}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm text-slate-600">{product.maxStock || "-"}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {isLowStock ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
                        <AlertTriangle size={12} />
                        {t("lowStock")}
                      </span>
                    ) : isHighStock ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                        <ArrowUp size={12} />
                        {t("highStock")}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                        <ArrowDown size={12} />
                        {t("normal")}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/stock?mode=create&productId=${product.id}`}
                        className="inline-flex items-center justify-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2 py-1.5 rounded-lg transition-colors"
                      >
                        <ArrowDown size={12} />
                        {t("movement")}
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
