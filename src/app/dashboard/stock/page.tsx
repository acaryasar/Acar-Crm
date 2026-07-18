import { prisma } from "@/lib/prisma";
import { requireRole, isAdmin } from "@/lib/auth-guard";
import { cookies } from "next/headers";
import { LOCALE_STORAGE_KEY, isLocale, defaultLocale, messages } from "@/i18n/config";
import { BarChart3, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";

export default async function StockPage() {
  const session = await requireRole(["ADMIN", "SUPERVISOR", "MANAGER"]);
  const companyId = session.user.companyId;
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get(LOCALE_STORAGE_KEY);
  const locale = localeCookie && isLocale(localeCookie.value) ? localeCookie.value : defaultLocale;
  const t = (key: string) => messages[locale].sidebar[key as keyof typeof messages[typeof locale]["sidebar"]];

  const companyFilter = isAdmin(session) ? {} : { companyId };

  // Stok durumu
  // @ts-expect-error - Product model newly added
  const products = await prisma.product.findMany({
    where: {
      ...companyFilter,
      deletedAt: null,
    },
    include: {
      category: true,
    },
    orderBy: { currentStock: "asc" },
  });

  // Son stok hareketleri
  // @ts-expect-error - StockMovement model newly added
  const recentMovements = await prisma.stockMovement.findMany({
    where: companyFilter,
    include: {
      product: true,
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  // Kritik stok uyarıları
  const lowStockProducts = products.filter((p: any) => p.currentStock <= p.minStock);

  // İstatistikler
  const totalProducts = products.length;
  const totalStockValue = products.reduce((sum: number, p: any) => {
    return sum + (p.currentStock * parseFloat(p.salePrice));
  }, 0);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center">
            <BarChart3 size={20} className="text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{t("stock")}</h1>
            <p className="text-sm text-slate-500">{t("stockDescription")}</p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-6 shrink-0">
        <div className="rounded-xl bg-white px-5 py-4 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Toplam Ürün</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">{totalProducts}</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-indigo-100 flex items-center justify-center">
              <BarChart3 size={18} className="text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white px-5 py-4 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Stok Değeri</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">{totalStockValue.toFixed(0)} ₺</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <TrendingUp size={18} className="text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white px-5 py-4 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Kritik Stok</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{lowStockProducts.length}</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-red-100 flex items-center justify-center">
              <AlertCircle size={18} className="text-red-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-auto grid gap-4 lg:grid-cols-2">
        {/* Stok Durumu */}
        <div className="rounded-xl bg-white shadow-sm border border-slate-100 flex flex-col">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-700">Stok Durumu</h3>
          </div>
          <div className="flex-1 overflow-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100 sticky top-0">
                <tr>
                  <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 py-3">
                    Ürün
                  </th>
                  <th className="text-right text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 py-3">
                    Stok
                  </th>
                  <th className="text-right text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 py-3">
                    Min
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.slice(0, 20).map((product: any) => (
                  <tr key={product.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-slate-700">{product.name}</div>
                      <div className="text-xs text-slate-500">{product.code}</div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`text-sm font-medium ${
                        product.currentStock <= product.minStock 
                          ? 'text-red-600' 
                          : 'text-emerald-600'
                      }`}>
                        {product.currentStock}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-sm text-slate-600">{product.minStock}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Son Hareketler */}
        <div className="rounded-xl bg-white shadow-sm border border-slate-100 flex flex-col">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-700">Son Hareketler</h3>
          </div>
          <div className="flex-1 overflow-auto">
            {recentMovements.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <TrendingDown size={32} className="text-slate-300 mb-2" />
                <p className="text-sm text-slate-400">Henüz stok hareketi yok</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentMovements.map((movement: any) => (
                  <div key={movement.id} className="px-4 py-3 hover:bg-slate-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-slate-700 truncate">
                          {movement.product.name}
                        </div>
                        <div className="text-xs text-slate-500">
                          {new Date(movement.createdAt).toLocaleDateString('tr-TR')} - {movement.type}
                        </div>
                      </div>
                      <div className="ml-3 flex items-center gap-2">
                        <span className={`text-sm font-medium ${
                          movement.type === 'IN' ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                          {movement.type === 'IN' ? '+' : '-'}{movement.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
