"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderNumber = params.orderNumber as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  useEffect(() => {
    async function fetchOrder() {
      try {
        setLoading(true);
        const res = await fetch(`/api/orders/${encodeURIComponent(orderNumber)}`);
        if (!res.ok) throw new Error(`Order ${orderNumber} not found`);
        const json = await res.json();
        setOrder(json.data || json.order);

        // Celebratory confetti burst on load
        try {
          confetti({
            particleCount: 90,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#2563EB", "#10B981", "#F59E0B", "#8B5CF6"],
          });
        } catch {
          // Ignore confetti fallback
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error fetching order");
      } finally {
        setLoading(false);
      }
    }

    if (orderNumber) {
      fetchOrder();
    }
  }, [orderNumber]);

  const handleCopyOrderId = () => {
    if (!order) return;
    navigator.clipboard.writeText(order.orderNumber);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return "Nov 22, 2026";
    const d = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(d);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-sm font-semibold text-slate-700">Loading Order Confirmation (Slide 28)...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-red-200 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-red-600 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900">Order Not Found</h2>
        <p className="text-xs text-slate-600">{error || "Could not retrieve order " + orderNumber}</p>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Store</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner (hidden on print) */}
      <div className="print:hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Storefront</span>
        </Link>

        <span className="text-xs font-medium text-slate-500">
          Slide 28 Presentation • Order Confirmation
        </span>
      </div>

      {/* Main Order Confirmation Presentation Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden print:shadow-none print:border-none">
        {/* Success Header (Slide 28) */}
        <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
              <CheckCircle2 className="w-8 h-8 text-white stroke-[2.5]" />
            </div>
            <div>
              <span className="text-emerald-200 text-xs font-black tracking-wider uppercase block">
                លំហាត់អនុវត្តទី៣ (Exercise 3 Result)
              </span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Order Placed Successfully!
              </h1>
              <p className="text-xs text-emerald-100 font-medium mt-1">
                ការបញ្ជាទិញទទួលបានជោគជ័យ! Thank you for your purchase.
              </p>
            </div>
          </div>

          {/* Print Button (hidden on print) */}
          <div className="print:hidden flex items-center gap-2">
            <button
              onClick={handlePrint}
              type="button"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs border border-white/20 transition-all backdrop-blur-xs shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Print Invoice</span>
            </button>
          </div>
        </div>

        {/* Stepper Status Timeline */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 print:hidden">
          <div className="flex items-center justify-between max-w-2xl mx-auto text-xs">
            <div className="flex items-center gap-2 font-black text-emerald-700">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-[11px] flex items-center justify-center">
                1
              </span>
              <span>Order Placed (Pending)</span>
            </div>
            <div className="h-0.5 flex-1 mx-3 bg-slate-200" />
            <div className="flex items-center gap-2 text-slate-400 font-medium">
              <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 text-[11px] flex items-center justify-center">
                2
              </span>
              <span>Processing</span>
            </div>
            <div className="h-0.5 flex-1 mx-3 bg-slate-200" />
            <div className="flex items-center gap-2 text-slate-400 font-medium">
              <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 text-[11px] flex items-center justify-center">
                3
              </span>
              <span>Delivered</span>
            </div>
          </div>
        </div>

        {/* Order Details Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Key Information Bento Grid matching Slide 28 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
            {/* Order ID Card */}
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Order ID
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-base font-mono font-black text-blue-600">
                  {order.orderNumber}
                </span>
                <button
                  onClick={handleCopyOrderId}
                  type="button"
                  className="p-1 rounded text-slate-400 hover:text-slate-600 transition-colors print:hidden"
                  title="Copy Order ID"
                >
                  {copiedId ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Customer Name */}
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Customer Name
              </span>
              <span className="text-sm font-bold text-slate-900 truncate block mt-0.5">
                {order.customerName ||
                  (order.customer
                    ? `${order.customer.firstName} ${order.customer.lastName}`
                    : "Customer")}
              </span>
            </div>

            {/* Order Date */}
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Order Date
              </span>
              <span className="text-xs font-semibold text-slate-800 block mt-0.5">
                {formatDate(order.createdAt)}
              </span>
            </div>

            {/* Status (Pending / Slide 28) */}
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Order Status
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-black text-amber-700 bg-amber-100/90 px-2.5 py-0.5 rounded-md mt-0.5 border border-amber-200">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                </span>
                <span>{order.status || "Pending"}</span>
              </span>
            </div>
          </div>

          {/* Customer & Shipping Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-100 text-xs">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Delivery Address
              </span>
              {order.customer && (
                <>
                  <p className="font-bold text-slate-900">
                    {order.customer.firstName} {order.customer.lastName}
                  </p>
                  <p className="text-slate-600">{order.customer.address}</p>
                  <p className="text-slate-600">
                    {order.customer.city}, {order.customer.state} {order.customer.zipCode}
                  </p>
                  <p className="text-slate-500 mt-1">Contact: {order.customer.phone}</p>
                </>
              )}
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Shipping Selection
              </span>
              <p className="font-bold text-slate-900 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-blue-600" />
                <span>{order.shippingMethod}</span>
              </p>
              <p className="text-slate-500">
                Shipping Fee: {order.shippingCost === 0 ? "FREE ($0.00)" : `$${order.shippingCost.toFixed(2)}`}
              </p>
            </div>
          </div>

          {/* Ordered Products Table (Exact Slide 28 structure) */}
          <div className="space-y-3">
            <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider">
              Ordered Products
            </h3>

            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                    <th className="py-3 px-4">Product Name</th>
                    <th className="py-3 px-4 text-center">Unit Price</th>
                    <th className="py-3 px-4 text-center">Quantity</th>
                    <th className="py-3 px-4 text-right">Line Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 font-bold text-slate-900">
                          {item.productName || item.name}
                        </td>
                        <td className="py-3 px-4 text-center text-slate-700 font-mono">
                          ${item.price.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-slate-900 font-mono">
                          {item.quantity}
                        </td>
                        <td className="py-3 px-4 text-right font-black text-slate-900 font-mono">
                          ${item.total.toFixed(2)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-slate-400">
                        No item records recorded
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-50/60 font-semibold text-slate-600 border-t border-slate-200">
                    <td colSpan={3} className="py-2.5 px-4 text-right">
                      Subtotal:
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono text-slate-900 font-bold">
                      ${order.subtotal.toFixed(2)}
                    </td>
                  </tr>
                  <tr className="bg-slate-50/60 font-semibold text-slate-600">
                    <td colSpan={3} className="py-2 px-4 text-right">
                      Shipping:
                    </td>
                    <td className="py-2 px-4 text-right font-mono text-slate-900 font-bold">
                      {order.shippingCost === 0 ? "FREE ($0.00)" : `$${order.shippingCost.toFixed(2)}`}
                    </td>
                  </tr>
                  <tr className="bg-slate-100 font-black text-slate-900 border-t border-slate-200">
                    <td colSpan={3} className="py-3.5 px-4 text-right text-sm">
                      Total Amount:
                    </td>
                    <td className="py-3.5 px-4 text-right text-base text-blue-600 font-mono font-black">
                      ${order.total.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Action Buttons Bar (hidden on print) */}
        <div className="p-6 sm:p-8 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
          <Link
            href="/"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs text-center transition-colors"
          >
            Continue Shopping
          </Link>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              href="/orders"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs text-center transition-colors shadow-sm"
            >
              View Order History
            </Link>

            <Link
              href="/erd"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs text-center transition-colors shadow-sm flex items-center justify-center gap-1.5"
            >
              <Database className="w-4 h-4" />
              <span>Inspect Database ERD</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
