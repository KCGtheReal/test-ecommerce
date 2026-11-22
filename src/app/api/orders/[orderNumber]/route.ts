import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: { orderNumber: string } }
) {
  try {
    const rawParam = params.orderNumber;
    const numericId = parseInt(rawParam, 10);

    const order = await prisma.order.findFirst({
      where: isNaN(numericId)
        ? { orderNumber: rawParam }
        : { OR: [{ orderNumber: rawParam }, { id: numericId }] },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          error: `Order ${rawParam} not found`,
        },
        { status: 404 }
      );
    }

    const customerFullName = `${order.customer.firstName} ${order.customer.lastName}`.trim();
    const formattedData = {
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      createdAt: order.createdAt,
      customerName: customerFullName,
      customer: {
        id: order.customer.id,
        firstName: order.customer.firstName,
        lastName: order.customer.lastName,
        email: order.customer.email,
        phone: order.customer.phone,
        address: `${order.customer.address}, ${order.customer.city}, ${order.customer.state} ${order.customer.zipCode}`.trim(),
        streetAddress: order.customer.address,
        city: order.customer.city,
        state: order.customer.state,
        zipCode: order.customer.zipCode,
      },
      shippingMethod: order.shippingMethod,
      shippingCost: order.shippingCost,
      subtotal: order.subtotal,
      tax: order.tax,
      total: order.total,
      items: order.items.map((item) => ({
        id: item.id,
        productId: item.productId,
        name: item.product?.name || "Product",
        productName: item.product?.name || "Product",
        imageUrl: item.product?.imageUrl || null,
        price: item.price,
        quantity: item.quantity,
        total: item.total,
      })),
    };

    return NextResponse.json(
      {
        success: true,
        data: formattedData,
        order: formattedData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/orders/[orderNumber] error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch order",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
