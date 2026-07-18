import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { requireRole, isAdmin } from "@/lib/auth-guard";
import { cookies } from "next/headers";
import { LOCALE_STORAGE_KEY, isLocale, defaultLocale, messages } from "@/i18n/config";
import { ShoppingCart, Plus, UserRound } from "lucide-react";

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    status?: string;
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
  const statusFilter = params.status ? { status: params.status } : {};

  // @ts-expect-error - Order model newly added
  const orders = await prisma.order.findMany({
    where: {
      ...companyFilter,
      ...statusFilter,
      deletedAt: null,
    },
    include: {
      customer: true,
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: { orderDate: "desc" },
    take: 100,
  });

  // İstatistikler
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.totalAmount), 0);
  const pendingOrders = orders.filter(o => o.status === 'PENDING').length;

  const statusColors: Record<string, string> = {
    DRAFT: 'bg-slate-100 text-slate-600',
    PENDING: 'bg-amber-100 text-amber-700',
    CONFIRMED: 'bg-blue-100 text-blue-700',
    PROCESSING: 'bg-indigo-100 text-indigo-700',
    SHIPPED: 'bg-purple-100 text-purple-700',
    DELIVERED: 'bg-emerald-100 text-emerald-700',
    COMPLETED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700',
  };

  const statusLabels: Record<string, string> = {
    DRAFT: 'Taslak',
    PENDING: 'Beklemede',
    CONFIRMED: 'Onaylandı',
    PROCESSING: 'İşleniyor',
    SHIPPED: 'Kargoya Verildi',
    DELIVERED: 'Teslim Edildi',
    COMPLETED: 'Tamamlandı',
    CANCELLED: 'İptal Edildi',
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <ShoppingCart size={20} className="text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{t("orders")}</h1>
            <p className="text-sm text-slate-500">{t("ordersDescription")}</p>
          </div>
        </div>

        <Link
          href="/dashboard/orders?mode=create"
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors shadow-sm"
        >
          <Plus size={16} />
          Yeni Sipariş
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-6 shrink-0">
        <div className="rounded-xl bg-white px-5 py-4 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Toplam Sipariş</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">{totalOrders}</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <ShoppingCart size={18} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white px-5 py-4 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Toplam Ciro</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">{totalRevenue.toFixed(0)} ₺</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <ShoppingCart size={18} className="text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white px-5 py-4 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Bekleyen</p>
              <p className="text-2xl font-bold text-amber-600 mt-1">{pendingOrders}</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <ShoppingCart size={18} className="text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-auto">
        <div className="rounded-xl bg-white shadow-sm border border-slate-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-3">
                    Sipariş No
                  </th>
                  <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-3">
                    Müşteri
                  </th>
                  <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-3">
                    Tarih
                  </th>
                  <th className="text-right text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-3">
                    Ürün Sayısı
                  </th>
                  <th className="text-right text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-3">
                    Tutar
                  </th>
                  <th className="text-center text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-3">
                    Durum
                  </th>
                  <th className="text-center text-xs font-semibold text-slate-600 uppercase tracking-wider px-6 py-3">
                    Ödeme
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <ShoppingCart size={32} className="text-slate-300 mb-2" />
                        <p className="text-sm text-slate-400">Henüz sipariş bulunmuyor</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-slate-700">{order.orderNumber}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <UserRound size={14} className="text-slate-400" />
                          <span className="text-sm text-slate-700">
                            {order.customer.firstName} {order.customer.lastName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-600">
                          {new Date(order.orderDate).toLocaleDateString('tr-TR')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm text-slate-600">{order.orderItems.length}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm font-medium text-slate-700">
                          {parseFloat(order.totalAmount).toFixed(2)} ₺
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          statusColors[order.status] || 'bg-slate-100 text-slate-600'
                        }`}>
                          {statusLabels[order.status] || order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          order.paymentStatus === 'PAID' 
                            ? 'bg-emerald-100 text-emerald-700'
                            : order.paymentStatus === 'PARTIAL'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {order.paymentStatus === 'PAID' ? 'Ödendi' :
                           order.paymentStatus === 'PARTIAL' ? 'Kısmi' : 'Ödenmedi'}
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
