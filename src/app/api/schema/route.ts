import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [customerCount, categoryCount, productCount, orderCount, orderItemCount] =
      await Promise.all([
        prisma.customer.count(),
        prisma.category.count(),
        prisma.product.count(),
        prisma.order.count(),
        prisma.orderItem.count(),
      ]);

    const schemaMetadata = {
      success: true,
      stats: {
        customers: customerCount,
        categories: categoryCount,
        products: productCount,
        orders: orderCount,
        orderItems: orderItemCount,
      },
      tables: [
        {
          name: "customers",
          label: "Customers",
          description: "Customer personal and delivery shipping information captured during checkout.",
          rowCount: customerCount,
          columns: [
            { name: "id", type: "INTEGER", pk: true, nullable: false, description: "Primary Key (Auto Increment)" },
            { name: "firstName", type: "TEXT", nullable: false, description: "Customer First Name" },
            { name: "lastName", type: "TEXT", nullable: false, description: "Customer Last Name" },
            { name: "email", type: "TEXT", unique: true, nullable: false, description: "Customer Email Address (Unique)" },
            { name: "phone", type: "TEXT", nullable: false, description: "Contact Phone Number" },
            { name: "address", type: "TEXT", nullable: false, description: "Street Address" },
            { name: "city", type: "TEXT", nullable: false, description: "City" },
            { name: "state", type: "TEXT", nullable: false, description: "State / Province" },
            { name: "zipCode", type: "TEXT", nullable: false, description: "Postal / Zip Code" },
            { name: "createdAt", type: "DATETIME", nullable: false, description: "Record Creation Timestamp" },
            { name: "updatedAt", type: "DATETIME", nullable: false, description: "Last Updated Timestamp" },
          ],
        },
        {
          name: "categories",
          label: "Categories",
          description: "Product categories organizing the catalog.",
          rowCount: categoryCount,
          columns: [
            { name: "id", type: "INTEGER", pk: true, nullable: false, description: "Primary Key (Auto Increment)" },
            { name: "name", type: "TEXT", unique: true, nullable: false, description: "Category Name" },
            { name: "slug", type: "TEXT", unique: true, nullable: false, description: "URL-Friendly Slug" },
            { name: "description", type: "TEXT", nullable: true, description: "Category Description" },
            { name: "createdAt", type: "DATETIME", nullable: false, description: "Creation Timestamp" },
            { name: "updatedAt", type: "DATETIME", nullable: false, description: "Last Updated Timestamp" },
          ],
        },
        {
          name: "products",
          label: "Products",
          description: "Catalog products (Laptop, Mouse, Keyboard, Monitor) available for ordering.",
          rowCount: productCount,
          columns: [
            { name: "id", type: "INTEGER", pk: true, nullable: false, description: "Primary Key (Auto Increment)" },
            { name: "name", type: "TEXT", nullable: false, description: "Product Name" },
            { name: "slug", type: "TEXT", unique: true, nullable: false, description: "Product Unique Slug" },
            { name: "description", type: "TEXT", nullable: true, description: "Product Description" },
            { name: "price", type: "REAL", nullable: false, description: "Unit Price in USD" },
            { name: "imageUrl", type: "TEXT", nullable: true, description: "Image Asset URL" },
            { name: "stock", type: "INTEGER", nullable: false, description: "Available Inventory Stock" },
            { name: "categoryId", type: "INTEGER", fk: "categories.id", nullable: false, description: "FK -> categories(id)" },
            { name: "createdAt", type: "DATETIME", nullable: false, description: "Creation Timestamp" },
            { name: "updatedAt", type: "DATETIME", nullable: false, description: "Last Updated Timestamp" },
          ],
        },
        {
          name: "orders",
          label: "Orders",
          description: "Customer purchase orders with calculated totals and shipping selection.",
          rowCount: orderCount,
          columns: [
            { name: "id", type: "INTEGER", pk: true, nullable: false, description: "Primary Key (Auto Increment)" },
            { name: "orderNumber", type: "TEXT", unique: true, nullable: false, description: "User-Facing Order Reference (e.g. ORD-0001)" },
            { name: "customerId", type: "INTEGER", fk: "customers.id", nullable: false, description: "FK -> customers(id)" },
            { name: "status", type: "TEXT", nullable: false, description: "Order Status (Default: 'Pending')" },
            { name: "subtotal", type: "REAL", nullable: false, description: "Sum of Item Totals" },
            { name: "shippingMethod", type: "TEXT", nullable: false, description: "Selected Shipping Option" },
            { name: "shippingCost", type: "REAL", nullable: false, description: "Applied Shipping Fee ($0 or $9)" },
            { name: "tax", type: "REAL", nullable: false, description: "Sales Tax Amount" },
            { name: "total", type: "REAL", nullable: false, description: "Grand Total = subtotal + shipping + tax" },
            { name: "createdAt", type: "DATETIME", nullable: false, description: "Submission Timestamp" },
            { name: "updatedAt", type: "DATETIME", nullable: false, description: "Last Updated Timestamp" },
          ],
        },
        {
          name: "order_items",
          label: "Order Items",
          description: "Purchased line items linking orders with catalog products, capturing price snapshots.",
          rowCount: orderItemCount,
          columns: [
            { name: "id", type: "INTEGER", pk: true, nullable: false, description: "Primary Key (Auto Increment)" },
            { name: "orderId", type: "INTEGER", fk: "orders.id", nullable: false, description: "FK -> orders(id) ON DELETE CASCADE" },
            { name: "productId", type: "INTEGER", fk: "products.id", nullable: false, description: "FK -> products(id)" },
            { name: "quantity", type: "INTEGER", nullable: false, description: "Units Ordered (> 0)" },
            { name: "price", type: "REAL", nullable: false, description: "Snapshot Unit Price at Purchase" },
            { name: "total", type: "REAL", nullable: false, description: "Line Total = quantity * price" },
            { name: "createdAt", type: "DATETIME", nullable: false, description: "Creation Timestamp" },
          ],
        },
      ],
      relationships: [
        { from: "products.categoryId", to: "categories.id", type: "1:N", label: "categorizes" },
        { from: "orders.customerId", to: "customers.id", type: "1:N", label: "places" },
        { from: "order_items.orderId", to: "orders.id", type: "1:N", label: "contains", cascade: true },
        { from: "order_items.productId", to: "products.id", type: "1:N", label: "ordered_in" },
      ],
    };

    return NextResponse.json(schemaMetadata, { status: 200 });
  } catch (error) {
    console.error("GET /api/schema error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch schema metadata",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
