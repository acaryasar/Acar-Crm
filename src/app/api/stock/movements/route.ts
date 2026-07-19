import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { StockMovementType } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const session = await requireRole(["ADMIN", "SUPERVISOR", "MANAGER"]);

    const body = await request.json();
    const { productId, type, quantity, referenceType, referenceId, notes } = body;

    // Validate required fields
    if (!productId || !type || !quantity) {
      return NextResponse.json(
        { error: "Missing required fields: productId, type, quantity" },
        { status: 400 }
      );
    }

    // Validate type
    if (!["IN", "OUT"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid type. Must be IN or OUT" },
        { status: 400 }
      );
    }

    // Validate quantity
    if (quantity <= 0) {
      return NextResponse.json(
        { error: "Quantity must be greater than 0" },
        { status: 400 }
      );
    }

    // Get the product
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Calculate stock before and after
    const stockBefore = product.currentStock;
    let stockAfter: number;

    if (type === "IN") {
      stockAfter = stockBefore + quantity;
    } else {
      // OUT
      if (stockBefore < quantity) {
        return NextResponse.json(
          { error: "Insufficient stock" },
          { status: 400 }
        );
      }
      stockAfter = stockBefore - quantity;
    }

    // Create stock movement
    const stockMovement = await prisma.stockMovement.create({
      data: {
        productId,
        type: type as StockMovementType,
        quantity,
        stockBefore,
        stockAfter,
        referenceType: referenceType || null,
        referenceId: referenceId || null,
        notes: notes || null,
        createdBy: (session.user as any).id,
      } as any,
      include: {
        product: true,
      },
    });

    // Update product stock
    await prisma.product.update({
      where: { id: productId },
      data: {
        currentStock: stockAfter,
      },
    });

    return NextResponse.json({ stockMovement });
  } catch (error) {
    console.error("Error creating stock movement:", error);
    return NextResponse.json(
      { error: "Failed to create stock movement" },
      { status: 500 }
    );
  }
}
