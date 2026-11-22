import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formattedOrders = orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: `${order.customer.firstName} ${order.customer.lastName}`.trim(),
      email: order.customer.email,
      total: order.total,
      itemCount: order.items.reduce((acc, i) => acc + i.quantity, 0),
      status: order.status,
      createdAt: order.createdAt,
      shippingMethod: order.shippingMethod,
      items: order.items.map((item) => ({
        id: item.id,
        productId: item.productId,
        productName: item.product?.name || "Product",
        price: item.price,
        quantity: item.quantity,
        total: item.total,
      })),
    }));

    return NextResponse.json(
      {
        success: true,
        data: formattedOrders,
        orders: formattedOrders,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/orders error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to retrieve orders",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Extract and Validate Customer Data
    const customerInput = body.customer || {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone,
      address: body.address,
      city: body.city,
      state: body.state,
      zipCode: body.zipCode,
    };

    const details: string[] = [];
    if (!customerInput?.firstName?.trim()) details.push("First name is required");
    if (!customerInput?.lastName?.trim()) details.push("Last name is required");
    if (!customerInput?.email?.trim() || !customerInput.email.includes("@")) {
      details.push("Valid email is required");
    }
    if (!customerInput?.phone?.trim()) details.push("Phone number is required");
    if (!customerInput?.address?.trim()) details.push("Address is required");
    if (!customerInput?.city?.trim()) details.push("City is required");
    if (!customerInput?.state?.trim()) details.push("State is required");
    if (!customerInput?.zipCode?.trim()) details.push("Zip code is required");

    // 2. Validate Items
    const rawItems = body.items;
    if (!rawItems || !Array.isArray(rawItems) || rawItems.length === 0) {
      details.push("At least one item is required in the order");
    }

    if (details.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details,
        },
        { status: 400 }
      );
    }

    const itemMap = new Map<number, number>();
    for (const item of rawItems) {
      const pId = parseInt(item.productId, 10);
      const rawQty = item.quantity;
      const isInt =
        typeof rawQty === "number"
          ? Number.isInteger(rawQty)
          : typeof rawQty === "string" && /^\d+$/.test(rawQty.trim());
      const numQty = typeof rawQty === "number" ? rawQty : parseInt(rawQty, 10);

      if (isNaN(pId) || !isInt || isNaN(numQty) || numQty <= 0) {
        return NextResponse.json(
          {
            success: false,
            error: "Validation failed",
            details: ["Each item must have a valid productId and a positive integer quantity"],
          },
          { status: 400 }
        );
      }
      itemMap.set(pId, (itemMap.get(pId) || 0) + numQty);
    }

    // 3. Database Transaction
    const orderResult = await prisma.$transaction(async (tx) => {
      // Upsert Customer
      const normalizedEmail = customerInput.email.trim().toLowerCase();
      const customer = await tx.customer.upsert({
        where: { email: normalizedEmail },
        update: {
          firstName: customerInput.firstName.trim(),
          lastName: customerInput.lastName.trim(),
          phone: customerInput.phone.trim(),
          address: customerInput.address.trim(),
          city: customerInput.city.trim(),
          state: customerInput.state.trim(),
          zipCode: customerInput.zipCode.trim(),
        },
        create: {
          firstName: customerInput.firstName.trim(),
          lastName: customerInput.lastName.trim(),
          email: normalizedEmail,
          phone: customerInput.phone.trim(),
          address: customerInput.address.trim(),
          city: customerInput.city.trim(),
          state: customerInput.state.trim(),
          zipCode: customerInput.zipCode.trim(),
        },
      });

      // Fetch Products
      const productIds = Array.from(itemMap.keys());
      const products = await tx.product.findMany({
        where: { id: { in: productIds } },
      });

      if (products.length !== productIds.length) {
        throw new Error("One or more ordered products were not found in the catalog");
      }

      // Calculate Subtotal and Item Data
      let subtotal = 0;
      const orderItemsData = products.map((product) => {
        const quantity = itemMap.get(product.id) || 1;
        const lineTotal = product.price * quantity;
        subtotal += lineTotal;
        return {
          productId: product.id,
          quantity,
          price: product.price,
          total: parseFloat(lineTotal.toFixed(2)),
        };
      });

      // Shipping and Total
      const shippingMethodInput = (body.shippingMethod || "free").toString().toLowerCase();
      const isExpress = shippingMethodInput.includes("express");
      const shippingMethodName = isExpress ? "Express Shipping ($9)" : "Free Shipping ($0)";
      const shippingCost = isExpress ? 9.0 : 0.0;
      const tax = 0.0;
      const total = parseFloat((subtotal + shippingCost + tax).toFixed(2));

      // Generate Sequential Order Number (ORD-0001, ORD-0002, ...)
      const lastOrder = await tx.order.findFirst({
        orderBy: { id: "desc" },
        select: { id: true, orderNumber: true },
      });

      let nextSeq = 1;
      if (lastOrder) {
        const match = lastOrder.orderNumber.match(/ORD-(\d+)/);
        if (match) {
          nextSeq = parseInt(match[1], 10) + 1;
        } else {
          nextSeq = lastOrder.id + 1;
        }
      }
      const orderNumber = `ORD-${nextSeq.toString().padStart(4, "0")}`;

      // Create Order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          customerId: customer.id,
          status: "Pending", // Required by Exercise 2 / Slide 28
          subtotal: parseFloat(subtotal.toFixed(2)),
          shippingMethod: shippingMethodName,
          shippingCost,
          tax,
          total,
          items: {
            create: orderItemsData,
          },
        },
        include: {
          customer: true,
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      // Decrement Inventory Stock
      for (const item of orderItemsData) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return newOrder;
    });

    return NextResponse.json(
      {
        success: true,
        message: "Order Placed Successfully!",
        data: {
          id: orderResult.id,
          orderNumber: orderResult.orderNumber,
          customer: orderResult.customer,
          status: orderResult.status,
          subtotal: orderResult.subtotal,
          shippingMethod: orderResult.shippingMethod,
          shippingCost: orderResult.shippingCost,
          tax: orderResult.tax,
          total: orderResult.total,
          items: orderResult.items.map((item) => ({
            id: item.id,
            productId: item.productId,
            productName: item.product?.name || "Product",
            price: item.price,
            quantity: item.quantity,
            total: item.total,
          })),
          createdAt: orderResult.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/orders error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create order",
        details: [error instanceof Error ? error.message : "Unknown error"],
      },
      { status: 500 }
    );
  }
}
