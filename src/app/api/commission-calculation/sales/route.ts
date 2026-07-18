import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const period = searchParams.get("period"); // Format: "all" or "2026-01"

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    let startDate: Date | undefined;
    let endDate: Date | undefined;

    if (period && period !== "all") {
      const [year, month] = period.split("-");
      startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59);
    }

    const whereClause: any = {
      deletedAt: null,
      status: "COMPLETED",
    };

    if (startDate && endDate) {
      whereClause.orderDate = {
        gte: startDate,
        lte: endDate,
      };
    }

    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        orderDate: "desc",
      },
    });

    // Filter orders by user (assuming orders have a createdBy field or similar)
    // For now, we'll return all orders and filter on the frontend
    // In a real implementation, you'd need to track which user made which sale

    const salesData = orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      date: order.orderDate,
      amount: parseFloat(order.totalAmount),
      customer: `${order.customer.firstName} ${order.customer.lastName}`,
    }));

    return NextResponse.json({ data: salesData });
  } catch (error) {
    console.error("Error fetching sales data:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
