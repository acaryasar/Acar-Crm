import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { requireRole, isAdmin } from "@/lib/auth-guard";
import { cookies } from "next/headers";
import { LOCALE_STORAGE_KEY, isLocale, defaultLocale, messages } from "@/i18n/config";
import { BarChart3, Plus, ArrowLeft, Edit, Save } from "lucide-react";
import { StockTable } from "@/features/stock/components/stock-table";
import { StockForm } from "@/features/stock/components/stock-form";
import { StockSearch } from "@/features/stock/components/stock-search";
import { StockPageClient } from "@/features/stock/components/stock-page-client";

export default async function StockPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    page?: string;
    mode?: "create" | "edit" | "view";
    id?: string;
    productId?: string;
  }>;
}) {
  const session = await requireRole(["ADMIN", "SUPERVISOR", "MANAGER"]);
  const params = await searchParams;
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get(LOCALE_STORAGE_KEY);
  const locale = localeCookie && isLocale(localeCookie.value) ? localeCookie.value : defaultLocale;
  const t = (key: string) => messages[locale].stock[key as keyof typeof messages[typeof locale]["stock"]];

  const mode = params.mode || "list";
  const stockId = params.id;
  const productId = params.productId;

  let stockMovement = null;
  if ((mode === "edit" || mode === "view") && stockId) {
    stockMovement = await prisma.stockMovement.findUnique({
      where: { id: stockId },
      include: { product: true },
    });
  }

  // Get selected product if productId is provided
  let selectedProduct = null;
  if (productId) {
    selectedProduct = await prisma.product.findUnique({
      where: { id: productId },
      include: { category: true },
    });
  }

  if (mode !== "list") {
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between mb-6 shrink-0">
          <div className="flex items-center gap-3">
            <Link 
              href="/stock" 
              className="inline-flex items-center justify-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>            
            <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
              <BarChart3 size={20} className="text-slate-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                {mode === "create" ? t("newMovement") : mode === "edit" ? t("editMovement") : t("viewMovement")}
              </h1>
              <p className="text-sm text-slate-500">
                {mode === "create" ? t("createMovementDesc") : stockMovement?.product?.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {mode === "view" && stockMovement && (
              <Link 
                href={`/stock?mode=edit&id=${stockMovement.id}`}
                className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors shadow-sm"
              >
                <Edit size={16} />
                {t("edit")}
              </Link>
            )}
            {mode !== "view" && (
              <button 
                form="stock-form"
                type="submit"
                className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors shadow-sm min-w-[140px]"
              >
                <Save size={16} />
                {mode === "create" ? t("save") : t("save")}
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-auto">
          <StockForm 
            mode={mode} 
            stockMovement={stockMovement ? {
              id: stockMovement.id,
              productId: stockMovement.productId,
              type: stockMovement.type,
              quantity: stockMovement.quantity,
              stockBefore: stockMovement.stockBefore,
              stockAfter: stockMovement.stockAfter,
              referenceType: stockMovement.referenceType || undefined,
              referenceId: stockMovement.referenceId || undefined,
              notes: stockMovement.notes || undefined,
            } : undefined}
            selectedProduct={selectedProduct ? {
              id: selectedProduct.id,
              name: selectedProduct.name,
              code: selectedProduct.code,
              currentStock: selectedProduct.currentStock,
            } : undefined}
          />
        </div>
      </div>
    );
  }

  const searchQuery = params.search || "";

  const products = await prisma.product.findMany({
    where: {
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

  // Calculate stats for the cards
  const totalProducts = products.length;
  const totalStockValue = products.reduce((sum, product) => {
    const stockValue = product.currentStock * (parseFloat(product.purchasePrice || "0"));
    return sum + stockValue;
  }, 0);
  const criticalStock = products.filter(
    (product) => product.currentStock <= product.minStock
  ).length;
  const outOfStock = products.filter(
    (product) => product.currentStock === 0
  ).length;

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center">
            <BarChart3 size={20} className="text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{t("title")}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <StockSearch />
          <Link
            href="/stock?mode=create"
            className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors shadow-sm min-w-[140px]"
          >
            <Plus size={12} />
            {t("newMovement")}
          </Link>
        </div>
      </div>

      <StockPageClient
        allProducts={products}
        totalProducts={totalProducts}
        criticalStock={criticalStock}
        outOfStock={outOfStock}
        totalStockValue={totalStockValue}
      />
    </div>
  );
}
