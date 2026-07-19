import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { requireRole, isAdmin } from "@/lib/auth-guard";
import { cookies } from "next/headers";
import { LOCALE_STORAGE_KEY, isLocale, defaultLocale, messages } from "@/i18n/config";
import { Receipt, Plus, ArrowLeft, Edit, Mail, DollarSign } from "lucide-react";
import { InvoiceTable } from "@/features/invoices/components/invoice-table";
import { InvoiceForm } from "@/features/invoices/components/invoice-form";
import { InvoiceSearch } from "@/features/invoices/components/invoice-search";

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    status?: string;
    page?: string;
    mode?: "create" | "edit" | "view";
    id?: string;
    customerId?: string;
  }>;
}) {
  const session = await requireRole(["ADMIN", "SUPERVISOR", "MANAGER"]);
  const params = await searchParams;
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get(LOCALE_STORAGE_KEY);
  const locale = localeCookie && isLocale(localeCookie.value) ? localeCookie.value : defaultLocale;
  const t = (key: string) => messages[locale].invoices[key as keyof typeof messages[typeof locale]["invoices"]];

  const mode = params.mode || "list";
  const invoiceId = params.id;
  const customerId = params.customerId;

  let invoice = null;
  if ((mode === "edit" || mode === "view") && invoiceId) {
    invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        customer: true,
        order: true,
        invoiceItems: {
          include: {
            product: true,
          },
        },
        payments: true,
      },
    });
  }

  // Get selected customer if customerId is provided
  let selectedCustomer = null;
  if (customerId) {
    selectedCustomer = await prisma.customer.findUnique({
      where: { id: customerId },
    });
  }

  if (mode !== "list") {
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between mb-6 shrink-0">
          <div className="flex items-center gap-3">
            <Link 
              href="/invoices" 
              className="inline-flex items-center justify-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>            
            <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <Receipt size={20} className="text-amber-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                {mode === "create" ? String(t("newInvoice")) : mode === "edit" ? String(t("editInvoice")) : String(t("viewInvoice"))}
              </h1>
              <p className="text-sm text-slate-500">
                {mode === "create" ? String(t("createInvoiceDesc")) : invoice?.invoiceNumber}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {mode === "view" && invoice && (
              <>
                <button className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors shadow-sm">
                  <Mail size={16} />
                  {String(t("sendEmail"))}
                </button>
                <button className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors shadow-sm">
                  <DollarSign size={16} />
                  {String(t("addPayment"))}
                </button>
                <Link 
                  href={`/invoices?mode=edit&id=${invoice.id}`}
                  className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium px-4 py-2.5 rounded-xl transition-colors shadow-sm"
                >
                  <Edit size={16} />
                  {String(t("edit"))}
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-auto">
          <InvoiceForm 
            mode={mode} 
            selectedCustomer={selectedCustomer}
            invoice={invoice ? {
              id: invoice.id,
              invoiceNumber: invoice.invoiceNumber,
              customerId: invoice.customerId,
              orderId: invoice.orderId || undefined,
              invoiceDate: invoice.invoiceDate,
              dueDate: invoice.dueDate || undefined,
              status: invoice.status,
              subtotal: invoice.subtotal,
              taxAmount: invoice.taxAmount,
              discountAmount: invoice.discountAmount,
              totalAmount: invoice.totalAmount,
              paidAmount: invoice.paidAmount,
              remainingAmount: invoice.remainingAmount,
              billingAddress: invoice.billingAddress || undefined,
              shippingAddress: invoice.shippingAddress || undefined,
              notes: invoice.notes || undefined,
              emailSent: invoice.emailSent,
              invoiceItems: invoice.invoiceItems.map((item: any) => ({
                id: item.id,
                productId: item.productId,
                productName: item.product.name,
                description: item.description,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                taxRate: item.taxRate,
                discount: item.discount,
                subtotal: item.subtotal,
                taxAmount: item.taxAmount,
                totalAmount: item.totalAmount,
              })),
              payments: invoice.payments.map((payment: any) => ({
                id: payment.id,
                paymentDate: payment.paymentDate,
                amount: payment.amount,
                paymentMethod: payment.paymentMethod,
                reference: payment.reference || undefined,
                notes: payment.notes || undefined,
              })),
            } : undefined}
          />
        </div>
      </div>
    );
  }

  const statusFilter = params.status ? { status: params.status as any } : {};
  const searchQuery = params.search || "";

  const invoices = await prisma.invoice.findMany({
    where: {
      ...statusFilter,
      deletedAt: null,
      OR: searchQuery ? [
        { invoiceNumber: { contains: searchQuery } },
      ] : undefined,
    },
    include: {
      customer: true,
      order: true,
      payments: true,
    },
    orderBy: { invoiceDate: "desc" },
    take: 100,
  });

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center">
            <Receipt size={20} className="text-amber-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{String(t("title"))}</h1>
            <p className="text-sm text-slate-500">{invoices.length} {String(t("invoices")).toLowerCase()}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <InvoiceSearch />
          <Link
            href="/invoices?mode=create"
            className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors shadow-sm min-w-[140px]"
          >
            <Plus size={12} />
            {String(t("newInvoice"))}
          </Link>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <InvoiceTable invoices={invoices} />
      </div>
    </div>
  );
}
