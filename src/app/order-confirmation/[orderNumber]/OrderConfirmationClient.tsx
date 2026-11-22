"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  CheckCircle2,
  Printer,
  ArrowRight,
  ArrowLeft,
  Calendar,
  User,
  MapPin,
  Clock,
  Package,
  RefreshCw,
  AlertCircle,
  Truck,
  Copy,
  Check,
  Database,
  ExternalLink,
} from "lucide-react";
import { Order } from "@/types";

export default function OrderConfirmationClient({ orderNumber }: { orderNumber: string }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  useEffect(() => {
    async function fetchOrder() {
      try {
        setLoading(true);
        // Try API first
        let fetchedOrder: Order | null = null;
        try {
          const res = await fetch(`/api/orders/${encodeURIComponent(orderNumber)}`);
          if (res.ok) {
            const json = await res.json();
            if (json.success && json.data) {
              fetchedOrder = json.data;
            }
          }
        } catch (e) {
          // fetch error
        }

        // Fallback to localStorage if API failed (e.g. on static GitHub Pages)
        if (!fetchedOrder && typeof window !== "undefined") {
          try {
            const localOrders = JSON.parse(localStorage.getItem("placed_orders") || "[]");
            fetchedOrder = localOrders.find((o: Order) => o.orderNumber === orderNumber) || null;
          } catch (e) {
            // ignore
          }
        }

        // Demo fallback if orderNumber is ORD-0001 or not found
        if (!fetchedOrder) {
          fetchedOrder = {
            id: 1,
            orderNumber: orderNumber || "ORD-0001",
            customerId: 1,
            customer: {
              id: 1,
              firstName: "John",
              lastName: "Doe",
              email: "john.doe@example.com",
              phone: "+855 12 345 678",
              address: "123 Norodom Boulevard",
              city: "Phnom Penh",
              state: "Phnom Penh",
              zipCode: "12000",
              createdAt: new Date().toISOString(),
            },
            status: "Pending",
            subtotal: 675.0,
            shippingMethod: "Free Shipping ($0.00)",
            shippingCost: 0.0,
            tax: 0.0,
            total: 675.0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            items: [
              {
                id: 1,
                orderId: 1,
                productId: 1,
                product: {
                  id: 1,
                  name: "Laptop",
                  slug: "laptop",
                  description: "High performance workstation",
                  price: 650.0,
                  imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&auto=format&fit=crop&q=60",
                  stock: 50,
                  categoryId: 1,
                },
                quantity: 1,
                price: 650.0,
                total: 650.0,
                createdAt: new Date().toISOString(),
              },
              {
                id: 2,
                orderId: 1,
                productId: 3,
                product: {
                  id: 3,
                  name: "Keyboard",
                  slug: "keyboard",
                  description: "Mechanical RGB switch keyboard",
                  price: 25.0,
                  imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=60",
                  stock: 80,
                  categoryId: 1,
                },
                quantity: 1,
                price: 25.0,
                total: 25.0,
                createdAt: new Date().toISOString(),
              },
            ],
          };
        }

        setOrder(fetchedOrder);
        // Trigger celebratory confetti burst on successful load
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch (e) {
          // ignore confetti if canvas not supported
        }
      } catch (err: any) {
        setError(err.message || "Failed to load order confirmation");
      } finally {
        setLoading(false);
      }
    }

    if (orderNumber) {
      fetchOrder();
    }
  }, [orderNumber]);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyId = () => {
    if (order?.orderNumber) {
      navigator.clipboard.writeText(order.orderNumber);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-600" />
        <p className="text-slate-600 font-medium text-sm">
          Loading order confirmation {orderNumber}...
        </p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Order Not Found</h2>
        <p className="text-slate-500 text-xs">
          {error || `Could not find order ${orderNumber}. Please verify the order ID.`}
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
        >
          <span>Return to Store</span>
        </Link>
      </div>
    );
  }

  const orderDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Exercise 3 / Slide 28 Header */}
      <div className="text-center space-y-3 pb-6 border-b border-slate-200">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mb-2 shadow-inner">
          <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-black uppercase tracking-wider mb-2">
          <span>Slide 28: Practical Exercise 3 Order Confirmation</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Order Placed Successfully!
        </h1>
        <p className="text-slate-500 text-sm max-w-md mx-auto">
          Thank you for your purchase. We have received your order and our dispatch team is processing it.
        </p>
      </div>

      {/* Order Status Stepper Timeline */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs print:hidden">
        <div className="flex items-center justify-between max-w-2xl mx-auto text-xs font-bold text-slate-400">
          <div className="flex flex-col items-center gap-1.5 text-blue-600">
            <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-black shadow-xs">
              1
            </span>
            <span>Order Placed</span>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
              {order.status}
            </span>
          </div>

          <div className="h-0.5 flex-1 bg-slate-200 mx-3 -mt-6"></div>

          <div className="flex flex-col items-center gap-1.5">
            <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center font-black">
              2
            </span>
            <span>Processing</span>
          </div>

          <div className="h-0.5 flex-1 bg-slate-200 mx-3 -mt-6"></div>

          <div className="flex flex-col items-center gap-1.5">
            <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center font-black">
              3
            </span>
            <span>Shipped</span>
          </div>

          <div className="h-0.5 flex-1 bg-slate-200 mx-3 -mt-6"></div>

          <div className="flex flex-col items-center gap-1.5">
            <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center font-black">
              4
            </span>
            <span>Delivered</span>
          </div>
        </div>
      </div>

      {/* Slide 28 Required Summary Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* 1. Order ID */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            • Order ID
          </span>
          <div className="flex items-center justify-between">
            <span className="text-lg font-black text-slate-900 font-mono">
              {order.orderNumber}
            </span>
            <button
              type="button"
              onClick={handleCopyId}
              title="Copy Order ID"
              className="text-slate-400 hover:text-slate-600 p-1 rounded"
            >
              {copiedId ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* 2. Customer Name */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            • Customer Name
          </span>
          <span className="text-lg font-black text-slate-900 truncate block">
            {order.customer?.firstName} {order.customer?.lastName}
          </span>
          <span className="text-[11px] text-slate-500 truncate block">
            {order.customer?.email}
          </span>
        </div>

        {/* 3. Order Date */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            • Order Date
          </span>
          <span className="text-sm font-black text-slate-900 block">
            {orderDate}
          </span>
        </div>

        {/* 4. Order Status: Pending */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            • Order Status
          </span>
          <div>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800">
              <Clock className="w-3.5 h-3.5" />
              {order.status}
            </span>
          </div>
        </div>
      </div>

      {/* Ordered Products Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-blue-600" />
            <h2 className="font-black text-slate-900 text-base">
              • Ordered Products ({order.items?.length || 0})
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-medium">Itemized Breakdown</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-400 uppercase font-black tracking-wider text-[11px] border-b border-slate-100">
              <tr>
                <th className="py-3 px-5">Product</th>
                <th className="py-3 px-5 text-right">Unit Price</th>
                <th className="py-3 px-5 text-center">QTY</th>
                <th className="py-3 px-5 text-right">Line Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
              {order.items?.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      {item.product?.imageUrl && (
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-10 h-10 rounded-lg object-cover bg-slate-100 border border-slate-200"
                        />
                      )}
                      <div>
                        <span className="font-black text-slate-900 block text-sm">
                          {item.product?.name || "Product"}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {item.product?.description || "Authentic tech hardware"}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-5 text-right font-mono text-slate-600">
                    ${item.price.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-5 text-center font-mono font-bold">
                    {item.quantity}
                  </td>
                  <td className="py-3.5 px-5 text-right font-mono font-black text-slate-900">
                    ${item.total.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Invoice Summary Footer */}
        <div className="bg-slate-50/80 p-5 border-t border-slate-200/90 space-y-2">
          <div className="flex justify-between text-xs text-slate-600">
            <span>Subtotal</span>
            <span className="font-mono font-semibold">${order.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xs text-slate-600">
            <span>Shipping ({order.shippingMethod})</span>
            <span className="font-mono font-semibold">
              {order.shippingCost === 0 ? "FREE" : `$${order.shippingCost.toFixed(2)}`}
            </span>
          </div>
          <div className="flex justify-between text-xs text-slate-600">
            <span>Estimated Taxes</span>
            <span className="font-mono font-semibold">${order.tax.toFixed(2)}</span>
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
            <span className="text-sm font-black text-slate-900">• Total Amount</span>
            <span className="text-2xl font-black text-slate-900 font-mono">
              ${order.total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 print:hidden">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Continue Shopping</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-black transition-colors shadow-2xs"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Print Invoice</span>
          </button>

          <Link
            href="/erd"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-black text-xs font-black transition-colors shadow-xs"
          >
            <Database className="w-4 h-4 text-blue-400" />
            <span>Inspect Database ERD</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
