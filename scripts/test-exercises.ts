import { NextRequest } from "next/server";
import { GET as getProducts } from "../src/app/api/products/route";
import { GET as getProductById } from "../src/app/api/products/[id]/route";
import { GET as getOrders, POST as createOrder } from "../src/app/api/orders/route";
import { GET as getOrderByNumber } from "../src/app/api/orders/[orderNumber]/route";
import { GET as getSchema } from "../src/app/api/schema/route";
import { prisma } from "../src/lib/prisma";

async function runTests() {
  console.log("=================================================");
  console.log("  Testing Practical Exercises 1, 2, 3 & 4 Backend");
  console.log("=================================================\n");

  try {
    // 1. Test GET /api/products (Exercise 1)
    console.log("1. Testing GET /api/products...");
    const productsRes = await getProducts();
    const productsData = await productsRes.json();
    console.log("   Status:", productsRes.status);
    console.log("   Success:", productsData.success);
    console.log("   Total Products:", productsData.data.length);
    console.assert(productsRes.status === 200, "Must return status 200");
    console.assert(productsData.data.length === 4, "Must return exactly 4 products");

    const names = productsData.data.map((p: { name: string; price: number }) => `${p.name} ($${p.price})`);
    console.log("   Catalog Items:", names.join(", "));
    console.assert(productsData.data.some((p: { name: string }) => p.name === "Laptop"), "Must contain Laptop");
    console.assert(productsData.data.some((p: { name: string }) => p.name === "Mouse"), "Must contain Mouse");
    console.assert(productsData.data.some((p: { name: string }) => p.name === "Keyboard"), "Must contain Keyboard");
    console.assert(productsData.data.some((p: { name: string }) => p.name === "Monitor"), "Must contain Monitor");

    // 2. Test GET /api/products/[id]
    console.log("\n2. Testing GET /api/products/1 and /api/products/laptop...");
    const p1Req = new NextRequest("http://localhost:3000/api/products/1");
    const p1Res = await getProductById(p1Req, { params: { id: "1" } });
    const p1Data = await p1Res.json();
    console.log("   Product 1:", p1Data.data.name, "Category:", p1Data.data.category?.name);
    console.assert(p1Data.data.name === "Laptop", "Product 1 must be Laptop");

    // 3. Test POST /api/orders (Exercise 2 Checkout Form Submission)
    console.log("\n3. Testing POST /api/orders (Placing Order with Express Shipping)...");
    const checkoutReq = new NextRequest("http://localhost:3000/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer: {
          firstName: "Sokha",
          lastName: "Chan",
          email: "sokha.chan@example.com",
          phone: "+855 12 345 678",
          address: "#123, St. 2004",
          city: "Phnom Penh",
          state: "Phnom Penh",
          zipCode: "12000",
        },
        shippingMethod: "express",
        items: [
          { productId: 1, quantity: 1 }, // Laptop: $650
          { productId: 2, quantity: 2 }, // Mouse: $15 * 2 = $30
        ],
      }),
    });

    const checkoutRes = await createOrder(checkoutReq);
    const checkoutData = await checkoutRes.json();
    console.log("   Checkout Status:", checkoutRes.status);
    console.log("   Order Number:", checkoutData.data.orderNumber);
    console.log("   Status:", checkoutData.data.status);
    console.log("   Subtotal:", checkoutData.data.subtotal);
    console.log("   Shipping:", checkoutData.data.shippingMethod, `$${checkoutData.data.shippingCost}`);
    console.log("   Grand Total:", checkoutData.data.total);

    console.assert(checkoutRes.status === 201, "Order creation must return 201");
    console.assert(/^ORD-\d{4}$/.test(checkoutData.data.orderNumber), "Order number must match ORD-XXXX format");
    console.assert(checkoutData.data.status === "Pending", "Order status must be 'Pending'");
    console.assert(checkoutData.data.subtotal === 680.0, "Subtotal must be 650 + 30 = 680");
    console.assert(checkoutData.data.shippingCost === 9.0, "Express shipping must be 9.0");
    console.assert(checkoutData.data.total === 689.0, "Grand total must be 689.0");

    const orderNumber = checkoutData.data.orderNumber;

    // 4. Test GET /api/orders/:orderNumber (Exercise 3 Confirmation Details)
    console.log("\n4. Testing GET /api/orders/:orderNumber (Confirmation Page)...");
    const orderDetailsReq = new NextRequest(`http://localhost:3000/api/orders/${orderNumber}`);
    const orderDetailsRes = await getOrderByNumber(orderDetailsReq, { params: { orderNumber } });
    const orderDetails = await orderDetailsRes.json();
    console.log("   Fetch Status:", orderDetailsRes.status);
    console.log("   Customer Name:", orderDetails.data.customerName);
    console.log("   Delivery Address:", orderDetails.data.customer.address);
    console.log("   Items Count:", orderDetails.data.items.length);
    console.assert(orderDetailsRes.status === 200, "Must return 200");
    console.assert(orderDetails.data.customerName === "Sokha Chan", "Customer name must match");
    console.assert(orderDetails.data.items.length === 2, "Items count must be 2");

    // 5. Test GET /api/orders (Listing Orders)
    console.log("\n5. Testing GET /api/orders...");
    const ordersRes = await getOrders();
    const ordersData = await ordersRes.json();
    console.log("   Orders list count:", ordersData.data.length);
    console.assert(ordersRes.status === 200, "Must return 200");
    console.assert(ordersData.data.length >= 1, "Must contain at least 1 order");

    // 6. Test Sequential Order Number (ORD-0002)
    console.log("\n6. Testing Sequential Order Number Generation (ORD-0002 with Free Shipping)...");
    const order2Req = new NextRequest("http://localhost:3000/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer: {
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          phone: "+1 555 123 4567",
          address: "123 Main St",
          city: "New York",
          state: "NY",
          zipCode: "10001",
        },
        shippingMethod: "free",
        items: [{ productId: 4, quantity: 1 }], // Monitor $120
      }),
    });
    const order2Res = await createOrder(order2Req);
    const order2Data = await order2Res.json();
    console.log("   Second Order Number:", order2Data.data.orderNumber);
    console.log("   Second Order Total:", order2Data.data.total);
    console.assert(/^ORD-\d{4}$/.test(order2Data.data.orderNumber), "Second order must match ORD-XXXX format");
    console.assert(order2Data.data.shippingCost === 0.0, "Free shipping must be 0");
    console.assert(order2Data.data.total === 120.0, "Total must be 120.0");

    // 7. Test Validation Rejection (Bad Request)
    console.log("\n7. Testing POST /api/orders Validation (Missing fields)...");
    const badReq = new NextRequest("http://localhost:3000/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customer: { firstName: "" }, items: [] }),
    });
    const badRes = await createOrder(badReq);
    const badData = await badRes.json();
    console.log("   Bad request status:", badRes.status);
    console.log("   Validation details count:", badData.details?.length);
    console.assert(badRes.status === 400, "Invalid payload must return 400");

    // 7b. Test Fractional Quantity Validation Rejection
    console.log("\n7b. Testing Fractional Quantity Rejection (quantity: 2.5)...");
    const fracReq = new NextRequest("http://localhost:3000/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer: {
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          phone: "+1 555 123 4567",
          address: "123 Main St",
          city: "New York",
          state: "NY",
          zipCode: "10001",
        },
        shippingMethod: "free",
        items: [{ productId: 1, quantity: 2.5 }],
      }),
    });
    const fracRes = await createOrder(fracReq);
    const fracData = await fracRes.json();
    console.log("   Fractional quantity status:", fracRes.status);
    console.log("   Fractional quantity details:", fracData.details);
    console.assert(fracRes.status === 400, "Fractional quantity must return 400");

    // 8. Test GET /api/schema (Exercise 4 ERD Metadata)
    console.log("\n8. Testing GET /api/schema (ERD Metadata)...");
    const schemaRes = await getSchema();
    const schemaData = await schemaRes.json();
    console.log("   Schema tables count:", schemaData.tables.length);
    console.log("   Tables:", schemaData.tables.map((t: { name: string }) => t.name).join(", "));
    console.log("   Live DB row counts:", schemaData.stats);
    console.assert(schemaRes.status === 200, "Schema must return 200");
    console.assert(schemaData.tables.length === 5, "Must define 5 relational tables");
    console.assert(schemaData.relationships.length === 4, "Must define 4 relationships");

    console.log("\n=================================================");
    console.log("🎉 ALL TESTS PASSED! BACKEND READY FOR FRONTEND 🎉");
    console.log("=================================================\n");
  } catch (error) {
    console.error("❌ Test failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runTests();
