import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// Helper function to calculate commission details
function calculateCommissionDetails(rule: any, totalSales: number, totalCommission: number) {
  let commissionDetails: any[] = [];

  if (rule.commissionType === "PERCENTAGE") {
    const rate = parseFloat(rule.commissionRate);
    commissionDetails = [
      {
        tier: "Tüm Satışlar",
        rate: `${rate}%`,
        amount: totalCommission,
      },
    ];
  } else if (rule.commissionType === "FIXED") {
    commissionDetails = [
      {
        tier: "Sabit Tutar",
        rate: "Sabit",
        amount: totalCommission,
      },
    ];
  } else if (rule.commissionType === "TIERED") {
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
        commissionDetails.push({
          tier: tier.maxValue ? `${minValue.toLocaleString()}-${maxValue.toLocaleString()}` : `${minValue.toLocaleString()}+`,
          rate: `${rate}%`,
          amount: tierCommission,
        });
        remainingAmount -= amountInTier;
      }
    }
  }

  return commissionDetails;
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { userId, period, ruleId } = body;

    if (!ruleId) {
      return NextResponse.json({ error: "Rule ID is required" }, { status: 400 });
    }

    // Fetch the commission rule with tiers
    const rule = await prisma.commissionRule.findUnique({
      where: { id: ruleId },
      include: {
        tiers: {
          orderBy: { order: "asc" },
        },
      },
    } as any);

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

    // If userId is "all", calculate for all users
    if (userId === "all") {
      // Fetch all users based on role
      const userRole = session.user.role;
      const userCompanyId = session.user.companyId;
      
      let users;
      if (userRole === "ADMIN") {
        users = await prisma.user.findMany({
          where: { deletedAt: null },
          select: { id: true, firstName: true, lastName: true },
          orderBy: { firstName: "asc" },
        });
      } else {
        users = await prisma.user.findMany({
          where: { deletedAt: null, companyId: userCompanyId },
          select: { id: true, firstName: true, lastName: true },
          orderBy: { firstName: "asc" },
        });
      }

      // Calculate commission for each user
      const userCommissions = [];
      let totalCommissionSum = 0;
      let totalSalesSum = 0;

      for (const user of users) {
        // Fetch customers where this user is the responsible person
        const responsibleCustomers = await prisma.customer.findMany({
          where: {
            responsiblePerson: user.id,
            deletedAt: null,
          } as any,
          select: {
            id: true,
          },
        });

        const customerIds = responsibleCustomers.map(c => c.id);

        // Fetch sales data for this user's responsible customers
        const whereClause: any = {
          deletedAt: null,
          customerId: {
            in: customerIds,
          },
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

        const userOrders = orders;

        const totalSales = userOrders.reduce((sum, order) => sum + parseFloat(order.totalAmount), 0);
        totalSalesSum += totalSales;

        // Calculate commission for this user
        let userCommission = 0;

        if (rule.commissionType === "PERCENTAGE") {
          const rate = parseFloat(rule.commissionRate);
          userCommission = totalSales * (rate / 100);
        } else if (rule.commissionType === "FIXED") {
          userCommission = parseFloat(rule.fixedAmount);
        } else if (rule.commissionType === "TIERED") {
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
              userCommission += tierCommission;
              remainingAmount -= amountInTier;
            }
          }
        }

        totalCommissionSum += userCommission;
        userCommissions.push({
          userId: user.id,
          userName: `${user.firstName} ${user.lastName}`,
          totalSales,
          commission: userCommission,
          salesDetails: orders.map((order) => ({
            id: order.id,
            orderNumber: order.orderNumber,
            date: order.orderDate,
            amount: parseFloat(order.totalAmount),
            customer: `${order.customer.firstName} ${order.customer.lastName}`,
          })),
          commissionDetails: calculateCommissionDetails(rule, totalSales, userCommission),
        });
      }

      // Calculate average commission
      const averageCommission = users.length > 0 ? totalCommissionSum / users.length : 0;
      const averageSales = users.length > 0 ? totalSalesSum / users.length : 0;

      return NextResponse.json({
        data: {
          isAllUsers: true,
          averageSales,
          averageCommission,
          totalUsers: users.length,
          userCommissions,
          rule: {
            name: rule.name,
            type: rule.commissionType,
          },
        },
      });
    }

    // Fetch customers where the selected user is the responsible person
    const responsibleCustomers = await prisma.customer.findMany({
      where: {
        responsiblePerson: userId,
        deletedAt: null,
      } as any,
      select: {
        id: true,
      },
    });

    const customerIds = responsibleCustomers.map(c => c.id);

    // Fetch sales data for the user's responsible customers
    const whereClause: any = {
      deletedAt: null,
      status: "COMPLETED",
      customerId: {
        in: customerIds,
      },
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
