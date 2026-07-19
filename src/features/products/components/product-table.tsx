"use client";

import { useTranslations } from "next-intl";
import { EntityActions } from "@/components/shared/entity/entity-actions";
import { ViewButton } from "@/components/shared/entity/view-button";
import { useEntityDelete } from "@/hooks/use-entity-delete";
import { toggleEntityStatus } from "@/features/shared/actions/toggle-status";
import { useEntityToggleStatus } from "@/hooks/use-entity-toggle-status";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface Product {
  id: string;
  code: string;
  name: string;
  description: string | null;
  categoryId: string | null;
  category: { id: string; name: string } | null;
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
  deletedAt: Date | null;
  createdAt: Date;
}

type Props = {
  products: Product[];
};

export function ProductTable({ products }: Props) {
  const t = useTranslations("products");
  const { data: session } = useSession();
  const { handleDelete, deleteId, confirmDelete, cancelDelete } = useEntityDelete(() => Promise.resolve());
  const { handleToggleStatus } = useEntityToggleStatus((id) => toggleEntityStatus({ entityType: "PRODUCT" as any, entityId: id, revalidatePath: "/products" }));
  const userRole = session?.user?.role;

  if (!products.length) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 text-center">
        <div className="text-slate-400 text-4xl mb-3">📦</div>
        <p className="text-slate-500 font-medium">{t("noProductsFound")}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-slate-50 z-10">
            <tr className="border-b border-slate-100">
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {t("code")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {t("name")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {t("category")}
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {t("unit")}
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {t("salePrice")}
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {t("stock")}
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {t("status")}
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {t("actions")}
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {products.map((product) => {
              const statusText = product?.deletedAt ? t("deleted") : product?.isActive ? t("active") : t("passive");
              const badgeColor = product?.deletedAt
                ? "bg-red-50 text-red-700 border-red-200"
                : product?.isActive
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-slate-50 text-slate-600 border-slate-200";

              return (
                <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-slate-700">{product.code}</span>
                  </td>

                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-700">{product.name}</span>
                  </td>

                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600">{product.category?.name || "—"}</span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <span className="text-sm text-slate-600">{product.unit}</span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-medium text-slate-700">
                      {parseFloat(product.salePrice).toFixed(2)} ₺
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <span className={`text-sm font-medium ${
                      product.currentStock <= product.minStock 
                        ? 'text-red-600' 
                        : 'text-emerald-600'
                    }`}>
                      {product.currentStock}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${badgeColor}`}>
                      {statusText}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <ViewButton href={`/products?mode=view&id=${product.id}`} />
                      <EntityActions
                        entityType="PRODUCT"
                        entityId={product.id}
                        isActive={!product.deletedAt && product.isActive}
                        onDelete={handleDelete}
                        onToggleStatus={handleToggleStatus}
                        deleteId={deleteId}
                        confirmDelete={confirmDelete}
                        cancelDelete={cancelDelete}
                        userRole={userRole}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
