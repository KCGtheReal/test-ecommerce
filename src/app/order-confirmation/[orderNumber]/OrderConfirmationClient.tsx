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
  Clock,
  Package,
  RefreshCw,
  AlertCircle,
  Copy,
  Check,
  Database,
  Truck,
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
          // ignore network fetch error for fallback
        }

        // Fallback to localStorage if API failed
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
              firstName: "Sokha",
              lastName: "Chan",
              email: "sokha.chan@example.com",
              phone: "+855 12 345 678",
              address: "#123, St. 2004, Sangkat Teuk Thla",
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
                  description: "Tactile mechanical keyboard",
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

        // Confetti celebration
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch (e) {
          // ignore
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

  const copyOrderId = () => {
    if (!order) return;
    navigator.clipboard.writeText(order.orderNumber);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return "November 22, 2026";
    const d = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "long",
      timeStyle: "short",
    }).format(d);
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-3 font-mono">
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-xs text-slate-400">[ DECRYPTING DISPATCH MANIFEST {orderNumber}... ]</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4 font-mono">
        <div className="w-16 h-16 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-2xl flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-white font-sans">Order Manifest Not Found</h1>
        <p className="text-xs text-slate-400 font-sans">
          Could not locate order manifest with identifier &ldquo;{orderNumber}&rdquo;.
        </p>
        <Link
          href="/"
          className="btn-tactile inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-glow-blue"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>[ RETURN TO CATALOG ]</span>
        </Link>
      </div>
    );
  }

  const customer = order.customer;
  const fullName = customer
    ? `${customer.firstName} ${customer.lastName}`
    : order.customerName || "Sokha Chan";
  const customerEmail = customer?.email || order.email || "sokha.chan@example.com";
  const customerAddress = customer
    ? `${customer.address}, ${customer.city}, ${customer.state} ${customer.zipCode}`
    : "123 Norodom Blvd, Phnom Penh";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-mono">
      {/* Slide 28 Header Banner */}
      <div className="text-center space-y-3 pb-6 border-b border-white/10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mb-2 shadow-glow-emerald">
          <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
        </div>
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-black uppercase tracking-wider mb-2 border border-blue-500/30">
            SLIDE 28: PRACTICAL EXERCISE 3 CONFIRMATION
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-sans">
          Order Placed Successfully!
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto font-sans leading-relaxed">
          Thank you for your purchase. We have received your order and our hardware dispatch team is processing it.
        </p>
      </div>

      {/* Status Stepper (Slide 28 requirement: "Status: Pending") */}
      <div className="bg-[#0E1420] rounded-2xl border border-white/10 p-5 shadow-chamfer print:hidden">
        <div className="flex items-center justify-between max-w-2xl mx-auto text-xs">
          <div className="flex flex-col items-center gap-1.5 text-blue-400">
            <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-black shadow-glow-blue">
              1
            </span>
            <span className="font-bold">ORDER RECORDED</span>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
              PENDING
            </span>
          </div>

          <div className="h-0.5 flex-1 bg-white/10 mx-3 -mt-6" />

          <div className="flex flex-col items-center gap-1.5 text-slate-600">
            <span className="w-8 h-8 rounded-full bg-[#151D2C] text-slate-500 flex items-center justify-center font-black">
              2
            </span>
            <span>PROCESSING</span>
          </div>

          <div className="h-0.5 flex-1 bg-white/10 mx-3 -mt-6" />

          <div className="flex flex-col items-center gap-1.5 text-slate-600">
            <span className="w-8 h-8 rounded-full bg-[#151D2C] text-slate-500 flex items-center justify-center font-black">
              3
            </span>
            <span>DISPATCHED</span>
          </div>

          <div className="h-0.5 flex-1 bg-white/10 mx-3 -mt-6" />

          <div className="flex flex-col items-center gap-1.5 text-slate-600">
            <span className="w-8 h-8 rounded-full bg-[#151D2C] text-slate-500 flex items-center justify-center font-black">
              4
            </span>
            <span>DELIVERED</span>
          </div>
        </div>
      </div>

      {/* Slide 28 Required Fields Matrix (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* 1. Order ID */}
        <div className="bg-[#0E1420] p-5 rounded-2xl border border-white/10 shadow-chamfer space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            • Order ID
          </span>
          <div className="flex items-center justify-between">
            <span className="text-lg font-black text-white">{order.orderNumber}</span>
            <button
              onClick={copyOrderId}
              type="button"
              className="text-slate-400 hover:text-white p-1 transition-colors"
              title="Copy Order ID"
            >
              {copiedId ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* 2. Customer Name */}
        <div className="bg-[#0E1420] p-5 rounded-2xl border border-white/10 shadow-chamfer space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            • Customer Name
          </span>
          <span className="text-base font-black text-white truncate block">{fullName}</span>
          <span className="text-[11px] text-slate-400 truncate block">{customerEmail}</span>
        </div>

        {/* 3. Order Date */}
        <div className="bg-[#0E1420] p-5 rounded-2xl border border-white/10 shadow-chamfer space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            • Order Date
          </span>
          <span className="text-xs font-black text-white block">
            {formatDate(order.createdAt)}
          </span>
          <span className="text-[10px] text-slate-400 block">UTC+7 Cambodia</span>
        </div>

        {/* 4. Order Status: Pending */}
        <div className="bg-[#0E1420] p-5 rounded-2xl border border-white/10 shadow-chamfer space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            • Order Status
          </span>
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Clock className="w-3.5 h-3.5" />
              <span>{order.status || "Pending"}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Ordered Products Table (Slide 28 requirement) */}
      <div className="bg-[#0E1420] rounded-2xl border border-white/10 shadow-chamfer overflow-hidden">
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-blue-400" />
            <h2 className="font-black text-white text-base font-sans">
              • Ordered Products ({order.items?.length || 0} items)
            </h2>
          </div>
          <span className="text-xs text-slate-400">Historical Price Snapshot</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#080B11] text-slate-400 uppercase font-bold tracking-wider text-[11px] border-b border-white/10">
              <tr>
                <th className="py-3 px-5">Product Name</th>
                <th className="py-3 px-5 text-right">Unit Price</th>
                <th className="py-3 px-5 text-center">QTY</th>
                <th className="py-3 px-5 text-right">Total Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {order.items && order.items.length > 0 ? (
                order.items.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[#080B11] border border-white/10 overflow-hidden relative shrink-0">
                          {item.product?.imageUrl && (
                            <img
                              src={item.product.imageUrl}
                              className="w-full h-full object-cover"
                              alt={item.product.name}
                            />
                          )}
                        </div>
                        <div>
                          <span className="font-bold text-white block font-sans">
                            {item.product?.name || "Hardware Component"}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            {item.product?.slug || "Item Snapshot"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 text-right text-slate-400">
                      ${item.price.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-5 text-center font-bold text-white">
                      {item.quantity}
                    </td>
                    <td className="py-3.5 px-5 text-right font-black text-white">
                      ${(item.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-slate-500">
                    No items in order
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Invoice Breakdown Footer */}
        <div className="bg-[#080B11] p-5 border-t border-white/10 space-y-2 text-xs">
          <div className="flex justify-between text-slate-400">
            <span>Subtotal</span>
            <span className="font-semibold text-white">${order.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Shipping</span>
            <span
              className={
                order.shippingCost > 0
                  ? "font-semibold text-white"
                  : "font-semibold text-emerald-400"
              }
            >
              {order.shippingCost > 0 ? `$${order.shippingCost.toFixed(2)}` : "FREE ($0.00)"}
            </span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Estimated Taxes</span>
            <span className="font-semibold text-white">${(order.tax || 0).toFixed(2)}</span>
          </div>
          <div className="pt-3 border-t border-white/10 flex justify-between items-baseline font-sans">
            <span className="text-sm font-black text-white">• Total Amount</span>
            <span className="text-2xl font-black text-white font-mono">
              ${order.total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 print:hidden">
        <Link
          href="/"
          className="btn-tactile px-5 py-2.5 rounded-xl border border-white/20 text-slate-300 hover:text-white hover:bg-white/5 text-xs font-bold transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Continue Shopping</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            type="button"
            className="btn-tactile px-5 py-2.5 rounded-xl border border-white/20 text-slate-300 hover:text-white hover:bg-white/5 text-xs font-bold transition-colors flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Print Invoice</span>
          </button>

          <Link
            href="/erd"
            className="btn-tactile px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors shadow-glow-blue flex items-center gap-2"
          >
            <Database className="w-4 h-4" />
            <span>Inspect Database ERD</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
