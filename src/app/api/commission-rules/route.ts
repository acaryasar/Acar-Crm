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
    const search = searchParams.get("search");

    const rules = await prisma.commissionRule.findMany({
      where: {
        deletedAt: null,
        ...(search
          ? {
              name: {
                contains: search,
              },
            }
          : {}),
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ data: rules });
  } catch (error) {
    console.error("Error fetching commission rules:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      description,
      commissionType,
      commissionRate,
      fixedAmount,
      productCategoryId,
      salesTarget,
      calculationPeriod,
      effectiveDate,
      expiryDate,
      isActive,
      tiers,
    } = body;

    const rule = await prisma.commissionRule.create({
      data: {
        name,
        description,
        commissionType,
        commissionRate: String(commissionRate || "0"),
        fixedAmount: String(fixedAmount || "0"),
        productCategoryId,
        salesTarget: String(salesTarget || "0"),
        calculationPeriod,
        effectiveDate: new Date(effectiveDate),
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        isActive: isActive !== undefined ? isActive : true,
        createdBy: session.user.id,
        tiers: tiers && tiers.length > 0 ? {
          create: tiers.map((tier: any) => ({
            minValue: String(tier.minValue || "0"),
            maxValue: tier.maxValue ? String(tier.maxValue) : null,
            commissionRate: String(tier.commissionRate || "0"),
            order: tier.order || 0,
          })),
        } : undefined,
      },
    });

    return NextResponse.json({ data: rule });
  } catch (error) {
    console.error("Error creating commission rule:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
