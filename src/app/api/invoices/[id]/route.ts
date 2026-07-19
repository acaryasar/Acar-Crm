import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-guard";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireRole(["ADMIN", "SUPERVISOR", "MANAGER"]);
    const { id } = await params;

    const invoice = await prisma.invoice.findFirst({
      where: {
        id,
        deletedAt: null,
      },
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

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    return NextResponse.json({ invoice });
  } catch (error) {
    console.error("Error fetching invoice:", error);
    return NextResponse.json({ error: "Failed to fetch invoice" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireRole(["ADMIN", "SUPERVISOR", "MANAGER"]);
    const { id } = await params;
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

    // Delete existing invoice items
    await prisma.invoiceItem.deleteMany({
      where: { invoiceId: id },
    });

    // Update invoice
    const invoice = await prisma.invoice.update({
      where: { id },
      data: {
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
        updatedBy: session.user.id,
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
    console.error("Error updating invoice:", error);
    return NextResponse.json({ error: "Failed to update invoice" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireRole(["ADMIN"]);
    const { id } = await params;

    await prisma.invoice.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        isDeleted: true,
        deletedBy: session.user.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting invoice:", error);
    return NextResponse.json({ error: "Failed to delete invoice" }, { status: 500 });
  }
}
