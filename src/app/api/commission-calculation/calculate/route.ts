import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { userId, period, ruleId } = body;

    if (!userId || !ruleId) {
      return NextResponse.json({ error: "User ID and Rule ID are required" }, { status: 400 });
    }

    // Fetch the commission rule with tiers
    const rule = await prisma.commissionRule.findUnique({
      where: { id: ruleId },
      include: {
        tiers: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!rule) {
      return NextResponse.json({ error: "Commission rule not found" }, { status: 404 });
    }

    // Calculate date range based on period
    let startDate: Date | undefined;
    let endDate: Date | undefined;

    if (period && period !== "all") {
      const [year, month] = period.split("-");
      startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59);
    }

    // Fetch sales data
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

    // Calculate total sales
    const totalSales = orders.reduce((sum, order) => sum + parseFloat(order.totalAmount), 0);

    // Calculate commission based on rule type
    let totalCommission = 0;
    let commissionDetails: any[] = [];

    if (rule.commissionType === "PERCENTAGE") {
      const rate = parseFloat(rule.commissionRate);
      totalCommission = totalSales * (rate / 100);
      commissionDetails = [
        {
          tier: "Tüm Satışlar",
          rate: `${rate}%`,
          amount: totalCommission,
        },
      ];
    } else if (rule.commissionType === "FIXED") {
      totalCommission = parseFloat(rule.fixedAmount);
      commissionDetails = [
        {
          tier: "Sabit Tutar",
          rate: "Sabit",
          amount: totalCommission,
        },
      ];
    } else if (rule.commissionType === "TIERED") {
      // Calculate tiered commission
      const tiers = rule.tiers.sort((a: any, b: any) => a.order - b.order);
      let remainingAmount = totalSales;

      for (const tier of tiers) {
        const minValue = parseFloat(tier.minValue);
        const maxValue = tier.maxValue ? parseFloat(tier.maxValue) : Infinity;
        const rate = parseFloat(tier.commissionRate);

        if (remainingAmount <= 0) break;

        const tierRange = maxValue - minValue;
        const amountInTier = Math.min(remainingAmount, tierRange);
        
        if (amountInTier > 0) {
          const tierCommission = amountInTier * (rate / 100);
          totalCommission += tierCommission;
          commissionDetails.push({
            tier: tier.maxValue ? `${minValue.toLocaleString()}-${maxValue.toLocaleString()}` : `${minValue.toLocaleString()}+`,
            rate: `${rate}%`,
            amount: tierCommission,
          });
          remainingAmount -= amountInTier;
        }
      }
    }

    // Prepare sales details
    const salesDetails = orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      date: order.orderDate,
      amount: parseFloat(order.totalAmount),
      customer: `${order.customer.firstName} ${order.customer.lastName}`,
    }));

    return NextResponse.json({
      data: {
        totalSales,
        totalCommission,
        salesDetails,
        commissionDetails,
        rule: {
          name: rule.name,
          type: rule.commissionType,
        },
      },
    });
  } catch (error) {
    console.error("Error calculating commission:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
