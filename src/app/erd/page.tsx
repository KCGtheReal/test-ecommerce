"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Database,
  Table as TableIcon,
  Key,
  Layers,
  ArrowRight,
  RefreshCw,
  Share2,
  Code2,
  Copy,
  Check,
  Server,
  FileText,
  Sparkles,
  Download,
  ExternalLink,
} from "lucide-react";
import { SchemaResponse, SchemaTable } from "@/types";

const PRISMA_SCHEMA_CODE = `// schema.prisma - 3NF Relational Database Design
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Customer {
  id        Int      @id @default(autoincrement())
  firstName String
  lastName  String
  email     String   @unique
  phone     String
  address   String
  city      String
  state     String
  zipCode   String
  orders    Order[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("customers")
}

model Category {
  id          Int       @id @default(autoincrement())
  name        String    @unique
  slug        String    @unique
  description String?
  products    Product[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@map("categories")
}

model Product {
  id          Int         @id @default(autoincrement())
  name        String
  slug        String      @unique
  description String?
  price       Float
  imageUrl    String?
  stock       Int         @default(50)
  categoryId  Int
  category    Category    @relation(fields: [categoryId], references: [id])
  orderItems  OrderItem[]
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  @@map("products")
}

model Order {
  id             Int         @id @default(autoincrement())
  orderNumber    String      @unique
  customerId     Int
  customer       Customer    @relation(fields: [customerId], references: [id])
  status         String      @default("Pending")
  subtotal       Float
  shippingMethod String      @default("free")
  shippingCost   Float       @default(0.0)
  tax            Float       @default(0.0)
  total          Float
  items          OrderItem[]
  createdAt      DateTime    @default(now())
  updatedAt      DateTime    @updatedAt

  @@map("orders")
}

model OrderItem {
  id        Int      @id @default(autoincrement())
  orderId   Int
  order     Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productId Int
  product   Product  @relation(fields: [productId], references: [id])
  quantity  Int
  price     Float    // Historical Snapshot
  total     Float
  createdAt DateTime @default(now())

  @@map("order_items")
}`;

const SQL_DDL_CODE = `-- SQLite SQL DDL Schema (Practical Exercise 4)
CREATE TABLE "customers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "categories" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL UNIQUE,
    "slug" TEXT NOT NULL UNIQUE,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "products" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL UNIQUE,
    "description" TEXT,
    "price" REAL NOT NULL,
    "imageUrl" TEXT,
    "stock" INTEGER NOT NULL DEFAULT 50,
    "categoryId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("categoryId") REFERENCES "categories" ("id") ON DELETE RESTRICT
);

CREATE TABLE "orders" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "orderNumber" TEXT NOT NULL UNIQUE,
    "customerId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "subtotal" REAL NOT NULL,
    "shippingMethod" TEXT NOT NULL DEFAULT 'free',
    "shippingCost" REAL NOT NULL DEFAULT 0.0,
    "tax" REAL NOT NULL DEFAULT 0.0,
    "total" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("customerId") REFERENCES "customers" ("id") ON DELETE RESTRICT
);

CREATE TABLE "order_items" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "orderId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    "total" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("orderId") REFERENCES "orders" ("id") ON DELETE CASCADE,
    FOREIGN KEY ("productId") REFERENCES "products" ("id") ON DELETE RESTRICT
);`;

const MERMAID_CODE = `erDiagram
    CUSTOMERS ||--o{ ORDERS : "places (1:N)"
    CATEGORIES ||--o{ PRODUCTS : "categorizes (1:N)"
    ORDERS ||--|{ ORDER_ITEMS : "contains (1:N)"
    PRODUCTS ||--o{ ORDER_ITEMS : "ordered_in (1:N)"

    CUSTOMERS {
        int id PK
        string firstName
        string lastName
        string email UK
        string phone
        string address
        string city
        string state
        string zipCode
    }

    CATEGORIES {
        int id PK
        string name UK
        string slug UK
        string description
    }

    PRODUCTS {
        int id PK
        string name
        string slug UK
        decimal price
        int stock
        int categoryId FK
    }

    ORDERS {
        int id PK
        string orderNumber UK
        int customerId FK
        string status
        decimal subtotal
        string shippingMethod
        decimal shippingCost
        decimal total
    }

    ORDER_ITEMS {
        int id PK
        int orderId FK
        int productId FK
        int quantity
        decimal price
        decimal total
    }`;

export default function ErdPage() {
  const [schemaData, setSchemaData] = useState<SchemaResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"erd" | "dictionary" | "code" | "records" | "drawio">("erd");
  const [copiedMermaid, setCopiedMermaid] = useState(false);
  const [selectedTable, setSelectedTable] = useState<string>("customers");
  const [copiedCode, setCopiedCode] = useState(false);
  const [codeType, setCodeType] = useState<"prisma" | "sql">("prisma");

  useEffect(() => {
    async function fetchSchema() {
      try {
        setLoading(true);
        const res = await fetch("/api/schema");
        if (!res.ok) throw new Error("Failed to load schema");
        const json = await res.json();
        setSchemaData(json);
      } catch (err) {
        console.error("Error fetching schema", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSchema();
  }, []);

  const tablesList: SchemaTable[] = schemaData?.tables || [];
  const currentTable = tablesList.find((t) => t.name === selectedTable) || tablesList[0];

  const handleCopyCode = () => {
    const code = codeType === "prisma" ? PRISMA_SCHEMA_CODE : SQL_DDL_CODE;
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Title & Header */}
      <div className="pb-6 border-b border-slate-200">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-blue-600" />
            លំហាត់អនុវត្តទី៤ (Exercise 4: Database Design & ERD)
          </span>
          <span className="text-xs font-medium text-slate-500">
            Relational 3NF Schema • SQLite & Prisma
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Relational Database Design & Entity Relationship Diagram
        </h1>

        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl leading-relaxed">
          Interactive viewer for the 5 relational tables implementing Practical Exercise 4:{" "}
          <strong>customers</strong>, <strong>categories</strong>, <strong>products</strong>,{" "}
          <strong>orders</strong>, and <strong>order_items</strong>. Inspect entities, foreign keys, and live records.
        </p>
      </div>

      {/* Live Database Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {[
          { label: "Customers", count: schemaData?.stats?.customers ?? 0, tag: "1:N Orders" },
          { label: "Categories", count: schemaData?.stats?.categories ?? 0, tag: "1:N Products" },
          { label: "Products", count: schemaData?.stats?.products ?? 0, tag: "4 Seeded items" },
          { label: "Orders", count: schemaData?.stats?.orders ?? 0, tag: "1:N Items" },
          { label: "Order Items", count: schemaData?.stats?.orderItems ?? 0, tag: "Snapshots" },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1 hover:border-blue-300 transition-colors"
          >
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              {stat.label}
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-slate-900 font-mono">
                {loading ? "..." : stat.count}
              </span>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                {stat.tag}
              </span>
            </div>
            <span className="text-[10px] text-slate-500">Live database rows</span>
          </div>
        ))}
      </div>

      {/* 5 Interactive Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
        {[
          { id: "erd", label: "1. Visual ERD Diagram", icon: Share2 },
          { id: "dictionary", label: "2. Data Dictionary", icon: TableIcon },
          { id: "code", label: "3. Prisma & SQL DDL", icon: Code2 },
          { id: "records", label: "4. Live Records & Rules", icon: Server },
          { id: "drawio", label: "5. diagrams.net (draw.io)", icon: ExternalLink },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              type="button"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap ${
                isActive
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-blue-400" : "text-slate-400"}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Visual Interactive ERD Diagram */}
      {activeTab === "erd" && (
        <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl border border-slate-800 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Share2 className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-black text-white tracking-wide">
                Entity Relationship Diagram (ERD) Architecture
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              3rd Normal Form (3NF) • Foreign Key Cascades
            </span>
          </div>

          {/* ERD Diagram Grid Cards with Connectors */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Customers */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 hover:border-blue-500/50 transition-colors">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <span className="font-mono font-bold text-sm text-blue-400">CUSTOMERS</span>
                <span className="text-[10px] font-bold bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded">
                  PK: id
                </span>
              </div>
              <ul className="text-xs font-mono text-slate-300 space-y-1.5">
                <li className="text-amber-400 font-bold">🔑 id (INTEGER PK)</li>
                <li>firstName (TEXT)</li>
                <li>lastName (TEXT)</li>
                <li className="text-indigo-300 font-semibold">email (TEXT UNIQUE)</li>
                <li>phone (TEXT)</li>
                <li>address, city, state, zipCode</li>
              </ul>
              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Places Orders</span>
                <span className="font-bold text-blue-400">1 : N (One-to-Many)</span>
              </div>
            </div>

            {/* Card 2: Orders (Central Pivot) */}
            <div className="bg-slate-900 border-2 border-blue-500/60 rounded-2xl p-5 space-y-3 relative shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <span className="font-mono font-bold text-sm text-blue-300">ORDERS</span>
                <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">
                  ORD-0001
                </span>
              </div>
              <ul className="text-xs font-mono text-slate-300 space-y-1.5">
                <li className="text-amber-400 font-bold">🔑 id (INTEGER PK)</li>
                <li className="text-indigo-300 font-bold">orderNumber (TEXT UNIQUE)</li>
                <li className="text-emerald-400 font-bold">🔗 customerId (FK -&gt; customers)</li>
                <li className="text-amber-300">status (&apos;Pending&apos; / Slide 28)</li>
                <li>subtotal, shippingCost, tax, total</li>
                <li>shippingMethod (&apos;free&apos; / &apos;express&apos;)</li>
              </ul>
              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Contains Line Items</span>
                <span className="font-bold text-blue-400">1 : N (One-to-Many)</span>
              </div>
            </div>

            {/* Card 3: Order_Items (Bridge) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 hover:border-blue-500/50 transition-colors">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <span className="font-mono font-bold text-sm text-blue-400">ORDER_ITEMS</span>
                <span className="text-[10px] font-bold bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded">
                  Bridge
                </span>
              </div>
              <ul className="text-xs font-mono text-slate-300 space-y-1.5">
                <li className="text-amber-400 font-bold">🔑 id (INTEGER PK)</li>
                <li className="text-emerald-400 font-bold">🔗 orderId (FK -&gt; orders CASCADE)</li>
                <li className="text-emerald-400 font-bold">🔗 productId (FK -&gt; products)</li>
                <li>quantity (INTEGER)</li>
                <li className="text-amber-300 font-bold">price (REAL Snapshot)</li>
                <li>total (REAL)</li>
              </ul>
              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span>References Products</span>
                <span className="font-bold text-blue-400">N : 1 (Many-to-One)</span>
              </div>
            </div>
          </div>

          {/* Lower Row: Categories & Products */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Categories */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <span className="font-mono font-bold text-sm text-blue-400">CATEGORIES</span>
                <span className="text-[10px] font-bold bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded">
                  PK: id
                </span>
              </div>
              <ul className="text-xs font-mono text-slate-300 space-y-1.5">
                <li className="text-amber-400 font-bold">🔑 id (INTEGER PK)</li>
                <li className="text-indigo-300 font-semibold">name (TEXT UNIQUE)</li>
                <li className="text-indigo-300">slug (TEXT UNIQUE)</li>
                <li>description (TEXT)</li>
              </ul>
              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Categorizes Products</span>
                <span className="font-bold text-blue-400">1 : N (One-to-Many)</span>
              </div>
            </div>

            {/* Products */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <span className="font-mono font-bold text-sm text-blue-400">PRODUCTS</span>
                <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">
                  4 Seeded Items
                </span>
              </div>
              <ul className="text-xs font-mono text-slate-300 space-y-1.5">
                <li className="text-amber-400 font-bold">🔑 id (INTEGER PK)</li>
                <li>name (Laptop, Mouse, Keyboard, Monitor)</li>
                <li className="text-indigo-300">slug (TEXT UNIQUE)</li>
                <li className="text-emerald-400 font-bold">🔗 categoryId (FK -&gt; categories)</li>
                <li>price ($650, $15, $25, $120)</li>
                <li>stock (INTEGER)</li>
              </ul>
              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Included in Order Items</span>
                <span className="font-bold text-blue-400">1 : N (One-to-Many)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Data Dictionary */}
      {activeTab === "dictionary" && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-black text-slate-900">
                Data Dictionary & Field Specifications
              </h2>
              <p className="text-xs text-slate-500">
                Detailed table definitions, column types, constraints, and descriptions.
              </p>
            </div>

            {/* Table Selector Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {tablesList.map((tbl) => (
                <button
                  key={tbl.name}
                  type="button"
                  onClick={() => setSelectedTable(tbl.name)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all ${
                    (currentTable?.name || selectedTable) === tbl.name
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {tbl.name}
                </button>
              ))}
            </div>
          </div>

          {currentTable && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 font-mono flex items-center gap-2">
                    <TableIcon className="w-4 h-4 text-blue-600" />
                    <span>Table: {currentTable.name} ({currentTable.label})</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">{currentTable.description}</p>
                </div>
                <span className="text-xs font-mono font-bold text-slate-700 bg-white px-3 py-1 rounded-xl border border-slate-200">
                  {currentTable.rowCount} records stored
                </span>
              </div>

              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                      <th className="py-2.5 px-3">Column Name</th>
                      <th className="py-2.5 px-3">Data Type</th>
                      <th className="py-2.5 px-3 text-center">Constraint</th>
                      <th className="py-2.5 px-3 text-center">Nullable</th>
                      <th className="py-2.5 px-3">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {currentTable.columns.map((col) => (
                      <tr key={col.name} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                          {col.name}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-blue-600 font-semibold">
                          {col.type}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          {col.pk ? (
                            <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-mono font-bold text-[10px]">
                              PK
                            </span>
                          ) : col.fk ? (
                            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-bold text-[10px]">
                              FK: {col.fk}
                            </span>
                          ) : col.unique ? (
                            <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-mono font-bold text-[10px]">
                              UNIQUE
                            </span>
                          ) : (
                            <span className="text-slate-400 font-mono">-</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-center text-slate-500 font-mono">
                          {col.nullable ? "YES" : "NO"}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">{col.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Prisma Schema & SQL DDL */}
      {activeTab === "code" && (
        <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl border border-slate-800 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setCodeType("prisma")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  codeType === "prisma"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                Prisma Schema (.prisma)
              </button>
              <button
                type="button"
                onClick={() => setCodeType("sql")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  codeType === "sql"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                SQLite DDL (.sql)
              </button>
            </div>

            <button
              onClick={handleCopyCode}
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition-all"
            >
              {copiedCode ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          <pre className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto max-h-[500px] leading-relaxed">
            <code>{codeType === "prisma" ? PRISMA_SCHEMA_CODE : SQL_DDL_CODE}</code>
          </pre>
        </div>
      )}

      {/* Tab 4: Live Records & Integrity Rules */}
      {activeTab === "records" && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
          <h2 className="text-base font-black text-slate-900">
            Relational Integrity & 3NF Normalization Principles
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-extrabold text-slate-900 text-sm">
                1. Historical Price Snapshot Integrity
              </h4>
              <p className="leading-relaxed">
                When an order is created, the unit price of each product is snapshotted into <code>order_items.price</code>.
                Any subsequent price modifications to catalog items (e.g. changing Laptop from $650 to $700) will never alter
                historical invoice receipts or financial records.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-extrabold text-slate-900 text-sm">
                2. Foreign Key Cascades & Referential Integrity
              </h4>
              <p className="leading-relaxed">
                The schema enforces <code>ON DELETE CASCADE</code> on <code>order_items.orderId</code>. When an order record
                is removed, its dependent line items are automatically pruned to prevent orphaned data.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-extrabold text-slate-900 text-sm">
                3. Customer Deduplication by Email
              </h4>
              <p className="leading-relaxed">
                Customers placing multiple orders with the same email address are deduplicated.
                Subsequent checkout submissions automatically link to the existing Customer record via 1:N relations.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-extrabold text-slate-900 text-sm">
                4. Third Normal Form (3NF) Compliance
              </h4>
              <p className="leading-relaxed">
                Every non-key attribute is non-transitively dependent on the primary key.
                Customer shipping details, product categories, and order payments are modularized across distinct tables.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: diagrams.net (draw.io) Integration */}
      {activeTab === "drawio" && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-8 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-700 text-xs font-black uppercase">
                  app.diagrams.net (draw.io)
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Ready-to-Open Native Diagram
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Open & Edit this ERD in diagrams.net
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                We have generated a ready-to-open <code>ecommerce_erd.drawio</code> file with styled swimlanes, PK/FK indicators, and crow&apos;s foot 1:N connectors.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <a
                href="/ecommerce_erd.drawio"
                download="ecommerce_erd.drawio"
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download .drawio File</span>
              </a>

              <a
                href="https://app.diagrams.net/"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-all"
              >
                <span>Launch app.diagrams.net</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            </div>
          </div>

          {/* 3 Quick Step Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Method 1 */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative hover:border-blue-400 transition-colors">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 font-black text-sm flex items-center justify-center">
                1
              </div>
              <h4 className="font-black text-slate-900 text-sm">
                Method A: Open .drawio File (Recommended)
              </h4>
              <ol className="text-xs text-slate-600 space-y-1.5 list-decimal list-inside leading-relaxed">
                <li>Download <strong>ecommerce_erd.drawio</strong> using the button above.</li>
                <li>Go to <a href="https://app.diagrams.net/" target="_blank" rel="noreferrer" className="text-blue-600 underline font-semibold">app.diagrams.net</a>.</li>
                <li>Click <strong>File &gt; Open From &gt; Device</strong> (or simply drag and drop the file into the diagrams.net window).</li>
                <li>The diagram immediately opens with full colors, labels, and crow&apos;s foot lines!</li>
              </ol>
            </div>

            {/* Method 2 */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative hover:border-emerald-400 transition-colors">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 font-black text-sm flex items-center justify-center">
                2
              </div>
              <h4 className="font-black text-slate-900 text-sm">
                Method B: Import via SQL DDL
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                diagrams.net can auto-generate table shapes from standard SQL schema:
              </p>
              <ol className="text-xs text-slate-600 space-y-1.5 list-decimal list-inside leading-relaxed">
                <li>In diagrams.net, click <strong>Arrange &gt; Insert &gt; Advanced &gt; SQL...</strong></li>
                <li>Paste the SQL DDL schema below.</li>
                <li>Click <strong>Insert</strong> to generate all 5 table shapes automatically.</li>
              </ol>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(SQL_DDL_CODE);
                  setCopiedCode(true);
                  setTimeout(() => setCopiedCode(false), 2000);
                }}
                className="w-full mt-2 py-2 px-3 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? "Copied SQL!" : "Copy SQL DDL"}</span>
              </button>
            </div>

            {/* Method 3 */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative hover:border-indigo-400 transition-colors">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 font-black text-sm flex items-center justify-center">
                3
              </div>
              <h4 className="font-black text-slate-900 text-sm">
                Method C: Import via Mermaid
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                diagrams.net has native Mermaid.js support:
              </p>
              <ol className="text-xs text-slate-600 space-y-1.5 list-decimal list-inside leading-relaxed">
                <li>In diagrams.net, click <strong>Arrange &gt; Insert &gt; Advanced &gt; Mermaid...</strong></li>
                <li>Paste the Mermaid ERD code below.</li>
                <li>Click <strong>Insert</strong> to render the entities and connectors.</li>
              </ol>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(MERMAID_CODE);
                  setCopiedMermaid(true);
                  setTimeout(() => setCopiedMermaid(false), 2000);
                }}
                className="w-full mt-2 py-2 px-3 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                {copiedMermaid ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedMermaid ? "Copied Mermaid!" : "Copy Mermaid ERD"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Footer */}
      <div className="flex items-center justify-between text-xs pt-4 border-t border-slate-200">
        <Link
          href="/"
          className="text-blue-600 hover:text-blue-700 font-bold inline-flex items-center gap-1"
        >
          <span>← Back to Products Catalog (Exercise 1)</span>
        </Link>
        <Link
          href="/orders"
          className="text-slate-700 hover:text-slate-900 font-bold inline-flex items-center gap-1"
        >
          <span>View Submitted Orders →</span>
        </Link>
      </div>
    </div>
  );
}
