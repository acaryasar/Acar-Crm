import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const rule = await prisma.commissionRule.findUnique({
      where: { id },
    });

    if (!rule) {
      return NextResponse.json({ error: "Commission rule not found" }, { status: 404 });
    }

    return NextResponse.json({ data: rule });
  } catch (error) {
    console.error("Error fetching commission rule:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
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
    } = body;

    const rule = await prisma.commissionRule.update({
      where: { id },
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
        updatedBy: session.user.id,
      },
    });

    revalidatePath("/dashboard/commission-rules");

    return NextResponse.json({ data: rule });
  } catch (error) {
    console.error("Error updating commission rule:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await prisma.commissionRule.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        isDeleted: true,
        deletedBy: session.user.id,
      },
    });

    revalidatePath("/dashboard/commission-rules");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting commission rule:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
