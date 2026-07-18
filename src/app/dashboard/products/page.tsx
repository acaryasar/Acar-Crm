import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { requireRole, isAdmin } from "@/lib/auth-guard";
import { cookies } from "next/headers";
import { LOCALE_STORAGE_KEY, isLocale, defaultLocale, messages } from "@/i18n/config";
import { Package, Plus } from "lucide-react";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    page?: string;
  }>;
}) {
  const session = await requireRole(["ADMIN", "SUPERVISOR", "MANAGER"]);
  const companyId = session.user.companyId;
  const params = await searchParams;
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get(LOCALE_STORAGE_KEY);
  const locale = localeCookie && isLocale(localeCookie.value) ? localeCookie.value : defaultLocale;
  const t = (key: string) => messages[locale].sidebar[key as keyof typeof messages[typeof locale]["sidebar"]];

  const companyFilter = isAdmin(session) ? {} : { companyId };
  const searchQuery = params.search || "";

  // @ts-expect-error - Product model newly added
  const products = await prisma.product.findMany({
    where: {
      ...companyFilter,
      deletedAt: null,
      OR: searchQuery ? [
        { name: { contains: searchQuery } },
        { code: { contains: searchQuery } },
        { barcode: { contains: searchQuery } },
      ] : undefined,
    },
    include: {
      category: true,
    },
    orderBy: { name: "asc" },
    take: 100,
  });

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-100 flex items-center justify-center">
            <Package size={20} className="text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{t("products")}</h1>
            <p className="text-sm text-slate-500">{t("productsDescription")}</p>
          </div>
        </div>

        <Link
          href="/dashboard/products?mode=create"
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors shadow-sm"
        >
          <Plus size={16} />
          Yeni Ürün
        </Link>
      </div>

      <div className="flex-1 min-h-0 overflow-auto">
        <div className="rounded-xl bg-white shadow-sm border border-slate-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-3">
                    Ürün Kodu
                  </th>
                  <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-3">
                    Ürün Adı
                  </th>
                  <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-3">
                    Kategori
                  </th>
                  <th className="text-right text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-3">
                    Birim
                  </th>
                  <th className="text-right text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-3">
                    Satış Fiyatı
                  </th>
                  <th className="text-right text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-3">
                    Stok
                  </th>
                  <th className="text-center text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-3">
                    Durum
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <Package size={32} className="text-slate-300 mb-2" />
                        <p className="text-sm text-slate-400">Henüz ürün bulunmuyor</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-slate-700">{product.code}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-700">{product.name}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-600">{product.category?.name || "-"}</span>
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
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          product.isActive 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {product.isActive ? 'Aktif' : 'Pasif'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
