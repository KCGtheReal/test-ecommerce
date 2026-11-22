import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database for Exercise 1, 2, 3 & 4...");

  // 1. Seed Category
  const category = await prisma.category.upsert({
    where: { slug: "computers-peripherals" },
    update: {},
    create: {
      name: "Computers & Peripherals",
      slug: "computers-peripherals",
      description: "Desktop computers, laptops, input devices, and display peripherals.",
    },
  });

  // 2. Seed the 4 Products from Exercise 1
  const products = [
    {
      name: "Laptop",
      slug: "laptop",
      description: "High performance laptop with ultra-fast processor and crystal clear display.",
      price: 650.0,
      imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80",
      stock: 50,
      categoryId: category.id,
    },
    {
      name: "Mouse",
      slug: "mouse",
      description: "Ergonomic precision optical wireless mouse with silent clicks.",
      price: 15.0,
      imageUrl: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80",
      stock: 120,
      categoryId: category.id,
    },
    {
      name: "Keyboard",
      slug: "keyboard",
      description: "Mechanical tactile RGB gaming keyboard with customizable switches.",
      price: 25.0,
      imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",
      stock: 80,
      categoryId: category.id,
    },
    {
      name: "Monitor",
      slug: "monitor",
      description: "27-inch 4K IPS bezel-less display with 144Hz refresh rate.",
      price: 120.0,
      imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80",
      stock: 35,
      categoryId: category.id,
    },
  ];

  for (const prod of products) {
    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: prod,
      create: prod,
    });
  }

  // 3. Seed Initial Customer
  await prisma.customer.upsert({
    where: { email: "john@example.com" },
    update: {},
    create: {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      phone: "+1 (555) 123-4567",
      address: "123 Main Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
    },
  });

  const productCount = await prisma.product.count();
  const customerCount = await prisma.customer.count();
  console.log(`Seeding complete: ${productCount} products, ${customerCount} customers.`);
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
