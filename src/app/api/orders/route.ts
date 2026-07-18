import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-guard";

export async function GET(req: NextRequest) {
  try {
    const session = await requireRole(["ADMIN", "SUPERVISOR", "MANAGER"]);
    const companyId = session.user.companyId;

    const companyFilter = session.user.role === "ADMIN" ? {} : { companyId };

    const orders = await prisma.order.findMany({
      where: {
        ...companyFilter,
        isDeleted: false,
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

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireRole(["ADMIN", "SUPERVISOR", "MANAGER"]);
    const body = await req.json();
    const companyId = session.user.companyId;

    const {
      customerId,
      orderDate,
      deliveryDate,
      status,
      paymentStatus,
      subtotal,
      taxAmount,
      discountAmount,
      shippingCost,
      totalAmount,
      shippingAddress,
      billingAddress,
      notes,
      orderItems,
    } = body;

    // Generate order number
    const lastOrder = await prisma.order.findFirst({
      where: { companyId },
      orderBy: { orderNumber: "desc" },
    });

    const lastNumber = lastOrder ? parseInt(lastOrder.orderNumber.replace("ORD-", "")) : 0;
    const orderNumber = `ORD-${String(lastNumber + 1).padStart(5, "0")}`;

    const order = await prisma.order.create({
      data: {
        companyId,
        orderNumber,
        customerId,
        orderDate: new Date(orderDate),
        deliveryDate: deliveryDate ? new Date(deliveryDate) : null,
        status,
        paymentStatus,
        subtotal,
        taxAmount,
        discountAmount,
        shippingCost,
        totalAmount,
        shippingAddress,
        billingAddress,
        notes,
        createdBy: session.user.id,
      },
    });

    // Create order items
    for (const item of orderItems) {
      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          productId: item.productId,
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

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
