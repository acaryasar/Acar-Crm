import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-guard";

export async function GET(req: NextRequest) {
  try {
    const session = await requireRole(["ADMIN", "SUPERVISOR", "MANAGER"]);

    const invoices = await prisma.invoice.findMany({
      where: {
        deletedAt: null,
      },
      include: {
        customer: true,
        order: true,
        payments: true,
      },
      orderBy: { invoiceDate: "desc" },
      take: 100,
    });

    return NextResponse.json({ invoices });
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireRole(["ADMIN", "SUPERVISOR", "MANAGER"]);
    const body = await req.json();

    const {
      customerId,
      orderId,
      invoiceDate,
      dueDate,
      status,
      subtotal,
      taxAmount,
      discountAmount,
      totalAmount,
      paidAmount,
      remainingAmount,
      billingAddress,
      shippingAddress,
      notes,
      invoiceItems,
    } = body;

    // Generate invoice number
    const lastInvoice = await prisma.invoice.findFirst({
      orderBy: { invoiceNumber: "desc" },
    });

    const lastNumber = lastInvoice ? parseInt(lastInvoice.invoiceNumber.replace("INV-", "")) : 0;
    const invoiceNumber = `INV-${String(lastNumber + 1).padStart(6, "0")}`;

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        customerId,
        orderId: orderId || null,
        invoiceDate: new Date(invoiceDate),
        dueDate: dueDate ? new Date(dueDate) : null,
        status,
        subtotal,
        taxAmount,
        discountAmount,
        totalAmount,
        paidAmount,
        remainingAmount,
        billingAddress,
        shippingAddress,
        notes,
        createdBy: session.user.id,
      },
    });

    // Create invoice items
    for (const item of invoiceItems) {
      await prisma.invoiceItem.create({
        data: {
          invoiceId: invoice.id,
          productId: item.productId,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          taxRate: item.taxRate,
          discount: item.discount,
          subtotal: item.subtotal,
          taxAmount: item.taxAmount,
          totalAmount: item.totalAmount,
        },
      });
    }

    return NextResponse.json({ invoice });
  } catch (error) {
    console.error("Error creating invoice:", error);
    return NextResponse.json({ error: "Failed to create invoice" }, { status: 500 });
  }
}
