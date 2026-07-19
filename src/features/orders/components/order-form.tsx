"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Plus, Trash2, Save, FileText, CheckCircle } from "lucide-react";

interface OrderItem {
  id?: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: string;
  taxRate: string;
  discount: string;
  subtotal: string;
  taxAmount: string;
  totalAmount: string;
}

interface Props {
  mode: "create" | "edit" | "view";
  order?: {
    id: string;
    orderNumber: string;
    customerId: string;
    orderDate: Date;
    deliveryDate?: Date;
    status: string;
    paymentStatus: string;
    subtotal: string;
    taxAmount: string;
    discountAmount: string;
    shippingCost: string;
    totalAmount: string;
    shippingAddress?: string;
    billingAddress?: string;
    notes?: string;
    orderItems: OrderItem[];
  };
}

export function OrderForm({ mode, order }: Props) {
  const t = useTranslations("orders");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>(order?.orderItems || []);
  const [selectedCustomerId, setSelectedCustomerId] = useState(order?.customerId || "");
  const [orderDate, setOrderDate] = useState(order?.orderDate ? new Date(order.orderDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
  const [deliveryDate, setDeliveryDate] = useState(order?.deliveryDate ? new Date(order.deliveryDate).toISOString().split('T')[0] : "");
  const [shippingAddress, setShippingAddress] = useState(order?.shippingAddress || "");
  const [billingAddress, setBillingAddress] = useState(order?.billingAddress || "");
  const [notes, setNotes] = useState(order?.notes || "");
  const [discountAmount, setDiscountAmount] = useState(order?.discountAmount || "0");
  const [shippingCost, setShippingCost] = useState(order?.shippingCost || "0");

  useEffect(() => {
    // Load customers and products
    Promise.all([
      fetch("/api/customers").then(res => res.json()).then(data => setCustomers(data.customers || [])),
      fetch("/api/products").then(res => res.json()).then(data => setProducts(data.products || [])),
    ]).catch(console.error);
  }, []);

  // Calculate totals
  const subtotal = orderItems.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);
  const taxAmount = orderItems.reduce((sum, item) => sum + parseFloat(item.taxAmount), 0);
  const totalAmount = subtotal + taxAmount + parseFloat(shippingCost) - parseFloat(discountAmount);

  function addOrderItem() {
    setOrderItems([...orderItems, {
      productId: "",
      productName: "",
      quantity: 1,
      unitPrice: "0",
      taxRate: "18",
      discount: "0",
      subtotal: "0",
      taxAmount: "0",
      totalAmount: "0",
    }]);
  }

  function removeOrderItem(index: number) {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  }

  function updateOrderItem(index: number, field: keyof OrderItem, value: any) {
    const updated = [...orderItems];
    updated[index] = { ...updated[index], [field]: value };

    // Recalculate item totals
    const item = updated[index];
    const qty = item.quantity || 0;
    const price = parseFloat(item.unitPrice) || 0;
    const taxRate = parseFloat(item.taxRate) || 0;
    const discount = parseFloat(item.discount) || 0;

    const itemSubtotal = qty * price;
    const itemTax = itemSubtotal * (taxRate / 100);
    const itemTotal = itemSubtotal + itemTax - discount;

    updated[index].subtotal = itemSubtotal.toFixed(2);
    updated[index].taxAmount = itemTax.toFixed(2);
    updated[index].totalAmount = itemTotal.toFixed(2);

    setOrderItems(updated);
  }

  async function handleSaveAsDraft() {
    await handleSubmit("DRAFT");
  }

  async function handleCreateOrder() {
    await handleSubmit("PENDING");
  }

  async function handleConfirmOrder() {
    await handleSubmit("CONFIRMED");
  }

  async function handleSubmit(status: string) {
    setLoading(true);

    const body: any = {
      customerId: selectedCustomerId,
      orderDate: orderDate,
      deliveryDate: deliveryDate || null,
      status,
      paymentStatus: "UNPAID",
      subtotal: subtotal.toFixed(2),
      taxAmount: taxAmount.toFixed(2),
      discountAmount: discountAmount,
      shippingCost: shippingCost,
      totalAmount: totalAmount.toFixed(2),
      shippingAddress: shippingAddress || null,
      billingAddress: billingAddress || null,
      notes: notes || null,
      orderItems: orderItems.map(item => ({
        productId: item.productId,
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
      const url = mode === "edit" ? `/api/orders/${order?.id}` : "/api/orders";
      const method = mode === "edit" ? "PUT" : "POST";
      
      await fetch(url, { 
        method, 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body) 
      });
      
      setLoading(false);
      router.push("/orders");
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  }

  return (
    <form className="space-y-6">
      {/* Customer Selection */}
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
          <label className="text-sm font-medium text-slate-700">{t("orderDate")}</label>
          <input
            type="date"
            value={orderDate}
            onChange={(e) => setOrderDate(e.target.value)}
            disabled={mode === "view"}
            required
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition disabled:bg-slate-50 disabled:text-slate-400"
          />
        </div>
      </div>

      {/* Order Items */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-slate-700">{t("orderItems")}</label>
          {mode !== "view" && (
            <button
              type="button"
              onClick={addOrderItem}
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
              {orderItems.map((item, index) => (
                <tr key={index}>
                  <td className="px-4 py-2">
                    <select
                      value={item.productId}
                      onChange={(e) => {
                        const product = products.find(p => p.id === e.target.value);
                        updateOrderItem(index, "productId", e.target.value);
                        updateOrderItem(index, "productName", product?.name || "");
                        updateOrderItem(index, "unitPrice", product?.salePrice || "0");
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
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateOrderItem(index, "quantity", parseInt(e.target.value) || 0)}
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
                      onChange={(e) => updateOrderItem(index, "unitPrice", e.target.value)}
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
                      onChange={(e) => updateOrderItem(index, "taxRate", e.target.value)}
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
                      onChange={(e) => updateOrderItem(index, "discount", e.target.value)}
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
                        onClick={() => removeOrderItem(index)}
                        className="inline-flex items-center justify-center text-slate-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
              {orderItems.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400 text-sm">
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
          <span className="text-slate-600">{t("shippingCost")}</span>
          <input
            type="number"
            step="0.01"
            value={shippingCost}
            onChange={(e) => setShippingCost(e.target.value)}
            disabled={mode === "view"}
            className="w-24 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-right outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition disabled:bg-slate-50 disabled:text-slate-400"
          />
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
      </div>

      {/* Addresses and Notes */}
      <div className="grid gap-6 md:grid-cols-2">
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

      {/* Action Buttons */}
      {mode !== "view" && (
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={handleSaveAsDraft}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium px-4 py-2.5 rounded-xl transition-colors shadow-sm disabled:opacity-50"
          >
            <FileText size={16} />
            {t("saveAsDraft")}
          </button>
          <button
            type="button"
            onClick={handleCreateOrder}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors shadow-sm disabled:opacity-50"
          >
            <ShoppingCart size={16} />
            {t("createOrder")}
          </button>
          <button
            type="button"
            onClick={handleConfirmOrder}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors shadow-sm disabled:opacity-50"
          >
            <CheckCircle size={16} />
            {t("confirmOrder")}
          </button>
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
