import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { requireRole, isAdmin } from "@/lib/auth-guard";
import { cookies } from "next/headers";
import { LOCALE_STORAGE_KEY, isLocale, defaultLocale, messages } from "@/i18n/config";
import { ShoppingCart, Plus, UserRound, ArrowLeft, Edit, Save } from "lucide-react";
import { OrderTable } from "@/features/orders/components/order-table";
import { OrderForm } from "@/features/orders/components/order-form";
import { OrderSearch } from "@/features/orders/components/order-search";

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    status?: string;
    page?: string;
    mode?: "create" | "edit" | "view";
    id?: string;
  }>;
}) {
  const session = await requireRole(["ADMIN", "SUPERVISOR", "MANAGER"]);
  const params = await searchParams;
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get(LOCALE_STORAGE_KEY);
  const locale = localeCookie && isLocale(localeCookie.value) ? localeCookie.value : defaultLocale;
  const t = (key: string) => messages[locale].orders[key as keyof typeof messages[typeof locale]["orders"]];

  const mode = params.mode || "list";
  const orderId = params.id;

  let order = null;
  if ((mode === "edit" || mode === "view") && orderId) {
    order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        customer: true,
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  if (mode !== "list") {
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between mb-6 shrink-0">
          <div className="flex items-center gap-3">
            <Link 
              href="/orders" 
              className="inline-flex items-center justify-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>            
            <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
              <ShoppingCart size={20} className="text-slate-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                {mode === "create" ? String(t("newOrder")) : mode === "edit" ? String(t("editOrder")) : String(t("viewOrder"))}
              </h1>
              <p className="text-sm text-slate-500">
                {mode === "create" ? String(t("createOrderDesc")) : order?.orderNumber}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {mode === "view" && order && (
              <Link 
                href={`/orders?mode=edit&id=${order.id}`}
                className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors shadow-sm"
              >
                <Edit size={16} />
                {String(t("edit"))}
              </Link>
            )}
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-auto">
          <OrderForm 
            mode={mode} 
            order={order ? {
              id: order.id,
              orderNumber: order.orderNumber,
              customerId: order.customerId,
              orderDate: order.orderDate,
              deliveryDate: order.deliveryDate || undefined,
              status: order.status,
              paymentStatus: order.paymentStatus,
              subtotal: order.subtotal,
              taxAmount: order.taxAmount,
              discountAmount: order.discountAmount,
              shippingCost: order.shippingCost,
              totalAmount: order.totalAmount,
              shippingAddress: order.shippingAddress || undefined,
              billingAddress: order.billingAddress || undefined,
              notes: order.notes || undefined,
              orderItems: order.orderItems.map(item => ({
                id: item.id,
                productId: item.productId,
                productName: item.product.name,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                taxRate: item.taxRate,
                discount: item.discount,
                subtotal: item.subtotal,
                taxAmount: item.taxAmount,
                totalAmount: item.totalAmount,
              })),
            } : undefined}
          />
        </div>
      </div>
    );
  }

  const statusFilter = params.status ? { status: params.status as any } : {};
  const searchQuery = params.search || "";

  const orders = await prisma.order.findMany({
    where: {
      ...statusFilter,
      deletedAt: null,
      OR: searchQuery ? [
        { orderNumber: { contains: searchQuery } },
      ] : undefined,
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

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <ShoppingCart size={20} className="text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{String(t("title"))}</h1>
            <p className="text-sm text-slate-500">{orders.length} {String(t("orders")).toLowerCase()}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <OrderSearch />
          <Link
            href="/orders?mode=create"
            className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors shadow-sm min-w-[140px]"
          >
            <Plus size={12} />
            {String(t("newOrder"))}
          </Link>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <OrderTable orders={orders} />
      </div>
    </div>
  );
}
