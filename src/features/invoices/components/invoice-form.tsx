"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Receipt, Plus, Trash2, Save, Mail, DollarSign, CheckCircle, Send } from "lucide-react";

interface InvoiceItem {
  id?: string;
  productId: string;
  productName: string;
  description: string;
  quantity: number;
  unitPrice: string;
  taxRate: string;
  discount: string;
  subtotal: string;
  taxAmount: string;
  totalAmount: string;
}

interface Payment {
  id?: string;
  paymentDate: Date;
  amount: string;
  paymentMethod: string;
  reference: string;
  notes: string;
}

interface Props {
  mode: "create" | "edit" | "view";
  selectedCustomer?: any;
  invoice?: {
    id: string;
    invoiceNumber: string;
    customerId: string;
    orderId?: string;
    invoiceDate: Date;
    dueDate?: Date;
    status: string;
    subtotal: string;
    taxAmount: string;
    discountAmount: string;
    totalAmount: string;
    paidAmount: string;
    remainingAmount: string;
    billingAddress?: string;
    shippingAddress?: string;
    notes?: string;
    emailSent: boolean;
    invoiceItems: InvoiceItem[];
    payments: Payment[];
  };
}

export function InvoiceForm({ mode, invoice, selectedCustomer }: Props) {
  const t = useTranslations("invoices");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>(invoice?.invoiceItems || []);
  const [payments, setPayments] = useState<Payment[]>(invoice?.payments || []);
  const [selectedCustomerId, setSelectedCustomerId] = useState(invoice?.customerId || selectedCustomer?.id || "");
  const [selectedOrderId, setSelectedOrderId] = useState(invoice?.orderId || "");
  const [invoiceDate, setInvoiceDate] = useState(invoice?.invoiceDate ? new Date(invoice.invoiceDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(invoice?.dueDate ? new Date(invoice.dueDate).toISOString().split('T')[0] : "");
  const [billingAddress, setBillingAddress] = useState(invoice?.billingAddress || "");
  const [shippingAddress, setShippingAddress] = useState(invoice?.shippingAddress || "");
  const [notes, setNotes] = useState(invoice?.notes || "");
  const [discountAmount, setDiscountAmount] = useState(invoice?.discountAmount || "0");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [newPayment, setNewPayment] = useState({
    amount: "",
    paymentMethod: "CASH",
    reference: "",
    notes: "",
  });

  useEffect(() => {
    // Load customers, orders, and products
    Promise.all([
      fetch("/api/customers").then(res => res.json()).then(data => {
        const customerList = data.data || data.customers || [];
        // Sort customers alphabetically by name
        customerList.sort((a: any, b: any) => 
          `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`)
        );
        setCustomers(customerList);
      }),
      fetch("/api/orders").then(res => res.json()).then(data => setOrders(data.data || data.orders || [])),
      fetch("/api/products").then(res => res.json()).then(data => setProducts(data.data || data.products || [])),
    ]).catch(console.error);
  }, []);

  // Calculate totals
  const subtotal = invoiceItems.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);
  const taxAmount = invoiceItems.reduce((sum, item) => sum + parseFloat(item.taxAmount), 0);
  const totalPaid = payments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0);
  const totalAmount = subtotal + taxAmount - parseFloat(discountAmount);
  const remainingAmount = totalAmount - totalPaid;

  function addInvoiceItem() {
    setInvoiceItems([...invoiceItems, {
      productId: "",
      productName: "",
      description: "",
      quantity: 1,
      unitPrice: "0",
      taxRate: "18",
      discount: "0",
      subtotal: "0",
      taxAmount: "0",
      totalAmount: "0",
    }]);
  }

  function removeInvoiceItem(index: number) {
    setInvoiceItems(invoiceItems.filter((_, i) => i !== index));
  }

  function updateInvoiceItem(index: number, field: keyof InvoiceItem, value: any) {
    const updated = [...invoiceItems];
    updated[index] = { ...updated[index], [field]: value };

    // Recalculate item totals
    const item = updated[index];
    const qty = parseFloat(item.quantity) || 0;
    const price = parseFloat(item.unitPrice) || 0;
    const taxRate = parseFloat(item.taxRate) || 0;
    const discount = parseFloat(item.discount) || 0;

    const itemSubtotal = qty * price;
    const itemTax = itemSubtotal * (taxRate / 100);
    const itemTotal = itemSubtotal + itemTax - discount;

    updated[index].subtotal = itemSubtotal.toFixed(2);
    updated[index].taxAmount = itemTax.toFixed(2);
    updated[index].totalAmount = itemTotal.toFixed(2);

    setInvoiceItems(updated);
  }

  async function handleSave() {
    await handleSubmit("DRAFT");
  }

  async function handleSend() {
    await handleSubmit("SENT");
  }

  async function handleSubmit(status: string) {
    setLoading(true);

    const body: any = {
      customerId: selectedCustomerId,
      orderId: selectedOrderId || null,
      invoiceDate: invoiceDate,
      dueDate: dueDate || null,
      status,
      subtotal: subtotal.toFixed(2),
      taxAmount: taxAmount.toFixed(2),
      discountAmount: discountAmount,
      totalAmount: totalAmount.toFixed(2),
      paidAmount: totalPaid.toFixed(2),
      remainingAmount: remainingAmount.toFixed(2),
      billingAddress: billingAddress || null,
      shippingAddress: shippingAddress || null,
      notes: notes || null,
      invoiceItems: invoiceItems.map(item => ({
        productId: item.productId,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        taxRate: item.taxRate,
        discount: item.discount,
        subtotal: item.subtotal,
        taxAmount: item.taxAmount,
        totalAmount: item.totalAmount,
      })),
    };

    try {
      const url = mode === "edit" ? `/api/invoices/${invoice?.id}` : "/api/invoices";
      const method = mode === "edit" ? "PUT" : "POST";
      
      await fetch(url, { 
        method, 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body) 
      });
      
      setLoading(false);
      router.push("/dashboard/invoices");
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  }

  async function handleAddPayment() {
    setLoading(true);

    const body: any = {
      invoiceId: invoice?.id,
      amount: newPayment.amount,
      paymentMethod: newPayment.paymentMethod,
      reference: newPayment.reference || null,
      notes: newPayment.notes || null,
    };

    try {
      await fetch("/api/payments", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body) 
      });
      
      setLoading(false);
      setShowPaymentModal(false);
      setNewPayment({ amount: "", paymentMethod: "CASH", reference: "", notes: "" });
      // Reload page to show updated payments
      router.refresh();
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  }

  async function handleSendEmail() {
    setLoading(true);

    try {
      await fetch(`/api/invoices/${invoice?.id}/send-email`, { 
        method: "POST" 
      });
      
      setLoading(false);
      alert(t("emailSentSuccess"));
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
      alert(t("emailSentError"));
    }
  }

  return (
    <form className="space-y-6">
      {/* Customer and Order Selection */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">{t("customer")}</label>
          <select
            value={selectedCustomerId}
            onChange={(e) => setSelectedCustomerId(e.target.value)}
            disabled={mode === "view"}
            required
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition disabled:bg-slate-50 disabled:text-slate-400"
          >
            <option value="">{t("selectCustomer")}</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.firstName} {customer.lastName}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">{t("order")}</label>
          <select
            value={selectedOrderId}
            onChange={(e) => setSelectedOrderId(e.target.value)}
            disabled={mode === "view"}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition disabled:bg-slate-50 disabled:text-slate-400"
          >
            <option value="">{t("noOrder")}</option>
            {orders.map((order) => (
              <option key={order.id} value={order.id}>
                {order.orderNumber}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">{t("invoiceDate")}</label>
          <input
            type="date"
            value={invoiceDate}
            onChange={(e) => setInvoiceDate(e.target.value)}
            disabled={mode === "view"}
            required
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition disabled:bg-slate-50 disabled:text-slate-400"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">{t("dueDate")}</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            disabled={mode === "view"}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition disabled:bg-slate-50 disabled:text-slate-400"
          />
        </div>
      </div>

      {/* Invoice Items */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-slate-700">{t("invoiceItems")}</label>
          {mode !== "view" && (
            <button
              type="button"
              onClick={addInvoiceItem}
              className="inline-flex items-center justify-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
            >
              <Plus size={14} />
              {t("addItem")}
            </button>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 py-2">
                  {t("product")}
                </th>
                <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 py-2">
                  {t("description")}
                </th>
                <th className="text-right text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 py-2">
                  {t("quantity")}
                </th>
                <th className="text-right text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 py-2">
                  {t("unitPrice")}
                </th>
                <th className="text-right text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 py-2">
                  {t("taxRate")}
                </th>
                <th className="text-right text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 py-2">
                  {t("discount")}
                </th>
                <th className="text-right text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 py-2">
                  {t("total")}
                </th>
                {mode !== "view" && (
                  <th className="w-10"></th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoiceItems.map((item, index) => (
                <tr key={index}>
                  <td className="px-4 py-2">
                    <select
                      value={item.productId}
                      onChange={(e) => {
                        const product = products.find(p => p.id === e.target.value);
                        updateInvoiceItem(index, "productId", e.target.value);
                        updateInvoiceItem(index, "productName", product?.name || "");
                        updateInvoiceItem(index, "description", product?.description || "");
                        updateInvoiceItem(index, "unitPrice", product?.salePrice || "0");
                      }}
                      disabled={mode === "view"}
                      required
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition disabled:bg-slate-50 disabled:text-slate-400"
                    >
                      <option value="">{t("selectProduct")}</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateInvoiceItem(index, "description", e.target.value)}
                      disabled={mode === "view"}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition disabled:bg-slate-50 disabled:text-slate-400"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateInvoiceItem(index, "quantity", parseInt(e.target.value) || 0)}
                      disabled={mode === "view"}
                      min="1"
                      required
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 text-right outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition disabled:bg-slate-50 disabled:text-slate-400"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => updateInvoiceItem(index, "unitPrice", e.target.value)}
                      disabled={mode === "view"}
                      required
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 text-right outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition disabled:bg-slate-50 disabled:text-slate-400"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      step="0.1"
                      value={item.taxRate}
                      onChange={(e) => updateInvoiceItem(index, "taxRate", e.target.value)}
                      disabled={mode === "view"}
                      required
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 text-right outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition disabled:bg-slate-50 disabled:text-slate-400"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      step="0.01"
                      value={item.discount}
                      onChange={(e) => updateInvoiceItem(index, "discount", e.target.value)}
                      disabled={mode === "view"}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 text-right outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition disabled:bg-slate-50 disabled:text-slate-400"
                    />
                  </td>
                  <td className="px-4 py-2 text-right">
                    <span className="text-sm font-medium text-slate-700">
                      {parseFloat(item.totalAmount).toFixed(2)} ₺
                    </span>
                  </td>
                  {mode !== "view" && (
                    <td className="px-4 py-2">
                      <button
                        type="button"
                        onClick={() => removeInvoiceItem(index)}
                        className="inline-flex items-center justify-center text-slate-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
              {invoiceItems.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-400 text-sm">
                    {t("noItems")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Totals */}
      <div className="rounded-xl bg-slate-50 p-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">{t("subtotal")}</span>
          <span className="font-medium text-slate-700">{subtotal.toFixed(2)} ₺</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">{t("taxAmount")}</span>
          <span className="font-medium text-slate-700">{taxAmount.toFixed(2)} ₺</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">{t("discount")}</span>
          <input
            type="number"
            step="0.01"
            value={discountAmount}
            onChange={(e) => setDiscountAmount(e.target.value)}
            disabled={mode === "view"}
            className="w-24 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-right outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition disabled:bg-slate-50 disabled:text-slate-400"
          />
        </div>
        <div className="flex justify-between text-base font-semibold pt-3 border-t border-slate-200">
          <span className="text-slate-700">{t("total")}</span>
          <span className="text-indigo-600">{totalAmount.toFixed(2)} ₺</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">{t("paidAmount")}</span>
          <span className="font-medium text-emerald-600">{totalPaid.toFixed(2)} ₺</span>
        </div>
        <div className="flex justify-between text-base font-semibold">
          <span className="text-slate-700">{t("remainingAmount")}</span>
          <span className={remainingAmount > 0 ? "text-amber-600" : "text-emerald-600"}>{remainingAmount.toFixed(2)} ₺</span>
        </div>
      </div>

      {/* Addresses and Notes */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">{t("billingAddress")}</label>
          <textarea
            value={billingAddress}
            onChange={(e) => setBillingAddress(e.target.value)}
            disabled={mode === "view"}
            rows={2}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition disabled:bg-slate-50 disabled:text-slate-400 resize-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">{t("shippingAddress")}</label>
          <textarea
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
            disabled={mode === "view"}
            rows={2}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition disabled:bg-slate-50 disabled:text-slate-400 resize-none"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">{t("notes")}</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          disabled={mode === "view"}
          rows={3}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition disabled:bg-slate-50 disabled:text-slate-400 resize-none"
        />
      </div>

      {/* Payment History */}
      {mode === "view" && payments.length > 0 && (
        <div className="space-y-4">
          <label className="text-sm font-medium text-slate-700">{t("paymentHistory")}</label>
          <div className="rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 py-2">
                    {t("paymentDate")}
                  </th>
                  <th className="text-right text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 py-2">
                    {t("amount")}
                  </th>
                  <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 py-2">
                    {t("paymentMethod")}
                  </th>
                  <th className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 py-2">
                    {t("reference")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map((payment, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 text-sm text-slate-600">
                      {new Date(payment.paymentDate).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-4 py-2 text-sm font-medium text-slate-700 text-right">
                      {parseFloat(payment.amount).toFixed(2)} ₺
                    </td>
                    <td className="px-4 py-2 text-sm text-slate-600">
                      {t(`paymentMethods.${payment.paymentMethod}`) || payment.paymentMethod}
                    </td>
                    <td className="px-4 py-2 text-sm text-slate-600">
                      {payment.reference || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {mode !== "view" && (
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium px-4 py-2.5 rounded-xl transition-colors shadow-sm disabled:opacity-50"
          >
            <Save size={16} />
            {t("saveAsDraft")}
          </button>
          <button
            type="button"
            onClick={handleSend}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors shadow-sm disabled:opacity-50"
          >
            <Send size={16} />
            {t("sendInvoice")}
          </button>
        </div>
      )}

      {mode === "view" && (
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={handleSendEmail}
            disabled={loading || invoice?.emailSent}
            className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors shadow-sm disabled:opacity-50"
          >
            <Mail size={16} />
            {invoice?.emailSent ? t("emailSent") : t("sendEmail")}
          </button>
          <button
            type="button"
            onClick={() => setShowPaymentModal(true)}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors shadow-sm disabled:opacity-50"
          >
            <DollarSign size={16} />
            {t("addPayment")}
          </button>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">{t("addPayment")}</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">{t("amount")}</label>
                <input
                  type="number"
                  step="0.01"
                  value={newPayment.amount}
                  onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">{t("paymentMethod")}</label>
                <select
                  value={newPayment.paymentMethod}
                  onChange={(e) => setNewPayment({ ...newPayment, paymentMethod: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
                >
                  <option value="CASH">{t("paymentMethods.CASH")}</option>
                  <option value="BANK_TRANSFER">{t("paymentMethods.BANK_TRANSFER")}</option>
                  <option value="CREDIT_CARD">{t("paymentMethods.CREDIT_CARD")}</option>
                  <option value="CHECK">{t("paymentMethods.CHECK")}</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">{t("reference")}</label>
                <input
                  type="text"
                  value={newPayment.reference}
                  onChange={(e) => setNewPayment({ ...newPayment, reference: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">{t("notes")}</label>
                <textarea
                  value={newPayment.notes}
                  onChange={(e) => setNewPayment({ ...newPayment, notes: e.target.value })}
                  rows={2}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition resize-none"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setShowPaymentModal(false)}
                className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
              >
                {t("cancel")}
              </button>
              <button
                type="button"
                onClick={handleAddPayment}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors disabled:opacity-50"
              >
                <CheckCircle size={16} />
                {t("confirm")}
              </button>
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
