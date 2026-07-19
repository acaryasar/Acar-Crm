import { prisma } from "@/lib/prisma";
import { success, failure } from "@/lib/api-utils";
import { auth } from "@/auth";
import { logActivity } from "@/lib/entity/activity-log";
import { createNotification } from "@/lib/notification";
import { CreateCustomerSchema, UpdateCustomerSchema } from "@/features/customers/validations/customer.schema";


export async function GET(request: Request) {
  const session = await auth();

  if (!session) {
    return failure("Unauthorized", 401);
  }

  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 20;
  const skip = (page - 1) * limit;

  const whereClause: any = {};

  if (session.user.role === "ADMIN") {
    // Admin sees all customers
  } else {
    // Supervisor/Manager/Employee see all customers
  }

  const customers = await prisma.customer.findMany({
    where: whereClause,
    skip,
    take: limit,
    orderBy: { createdAt: "desc" },
  });

  return success(customers);
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session) {
      return failure("Unauthorized", 401);
    }

    const body = await request.json();
    const { action, id, ...data } = body;

    if (action === "update" && id) {
      const customer = await prisma.customer.update({
        where: { id },
        data: UpdateCustomerSchema.parse(data),
      });

      await logActivity({ 
        action: "CUSTOMER_UPDATED", 
        entityType: "CUSTOMER", 
        entityId: id,
        metadata: { changes: data }
      });

      return success(customer);
    }

    if (action === "delete" && id) {
      await prisma.customer.update({
        where: { id },
        data: {
          deletedAt: new Date(),
          is_active: false,
        },
      });

      await logActivity({ action: "CUSTOMER_DELETED", entityType: "CUSTOMER", entityId: id });

      return success({ success: true });
    }

    const customer = await prisma.customer.create({
      data: CreateCustomerSchema.parse(data),
    });

    await logActivity({ action: "CUSTOMER_CREATED", entityType: "CUSTOMER", entityId: customer.id });
    await createNotification({
      title: "New Customer",
      message: customer.firstName,
      type: "SUCCESS",
      entityType: "CUSTOMER",
      entityId: customer.id,
    });

    return success(customer);
  } catch {
    return failure("Invalid request");
  }
}