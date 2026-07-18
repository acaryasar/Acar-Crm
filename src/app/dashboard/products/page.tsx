import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { requireRole, isAdmin } from "@/lib/auth-guard";
import { cookies } from "next/headers";
import { LOCALE_STORAGE_KEY, isLocale, defaultLocale, messages } from "@/i18n/config";
import { Package, Plus, ArrowLeft, Edit, Save } from "lucide-react";
import { ProductTable } from "@/features/products/components/product-table";
import { ProductForm } from "@/features/products/components/product-form";
import { ProductSearch } from "@/features/products/components/product-search";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    page?: string;
    mode?: "create" | "edit" | "view";
    id?: string;
  }>;
}) {
  const session = await requireRole(["ADMIN", "SUPERVISOR", "MANAGER"]);
  const companyId = session.user.companyId;
  const params = await searchParams;
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get(LOCALE_STORAGE_KEY);
  const locale = localeCookie && isLocale(localeCookie.value) ? localeCookie.value : defaultLocale;
  const t = (key: string) => messages[locale].products[key as keyof typeof messages[typeof locale]["products"]];

  const mode = params.mode || "list";
  const productId = params.id;

  let product = null;
  if ((mode === "edit" || mode === "view") && productId) {
    product = await prisma.product.findUnique({
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
              href="/dashboard/products" 
              className="inline-flex items-center justify-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>            
            <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
              <Package size={20} className="text-slate-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                {mode === "create" ? t("newProduct") : mode === "edit" ? t("editProduct") : t("viewProduct")}
              </h1>
              <p className="text-sm text-slate-500">
                {mode === "create" ? t("createProductDesc") : product?.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {mode === "view" && product && (
              <Link 
                href={`/dashboard/products?mode=edit&id=${product.id}`}
                className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors shadow-sm"
              >
                <Edit size={16} />
                {t("edit")}
              </Link>
            )}
            {mode !== "view" && (
              <button 
                form="product-form"
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
          <ProductForm 
            mode={mode} 
            product={product ? {
              id: product.id,
              code: product.code,
              name: product.name,
              description: product.description,
              categoryId: product.categoryId,
              unit: product.unit,
              purchasePrice: product.purchasePrice,
              salePrice: product.salePrice,
              taxRate: product.taxRate,
              currentStock: product.currentStock,
              minStock: product.minStock,
              maxStock: product.maxStock,
              barcode: product.barcode,
              imageUrl: product.imageUrl,
              isActive: product.isActive,
            } : undefined}
          />
        </div>
      </div>
    );
  }

  const companyFilter = isAdmin(session) ? {} : { companyId };
  const searchQuery = params.search || "";

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
            <h1 className="text-2xl font-bold text-slate-800">{t("title")}</h1>
            <p className="text-sm text-slate-500">{products.length} {t("title").toLowerCase()}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ProductSearch />
          <Link
            href="/dashboard/products?mode=create"
            className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors shadow-sm min-w-[140px]"
          >
            <Plus size={12} />
            {t("new")}
          </Link>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <ProductTable products={products} />
      </div>
    </div>
  );
}
