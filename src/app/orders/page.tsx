"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  CheckCircle2,
  Clock,
  ArrowRight,
  Package,
  Calendar,
  User,
  RefreshCw,
  Receipt,
  ArrowLeft,
  Truck,
  Database,
} from "lucide-react";
import { Order } from "@/types";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    async function loadOrders() {
      try {
        setLoading(true);
        const res = await fetch("/api/orders");
        if (res.ok) {
          const json = await res.json();
          setOrders(json.data || json.orders || []);
        }
      } catch (err) {
        console.error("Failed to load orders:", err);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return "Nov 22, 2026";
    const d = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(d);
  };

  const filteredOrders = orders.filter((o) => {
    const matchesFilter =
      statusFilter === "all" || o.status.toLowerCase() === statusFilter.toLowerCase();
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      o.orderNumber.toLowerCase().includes(q) ||
      (o.customerName && o.customerName.toLowerCase().includes(q)) ||
      (o.email && o.email.toLowerCase().includes(q));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
            Order Record & Confirmation Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
            Submitted Orders Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Inspect all customer orders stored in the SQLite database and access their Slide 28 confirmation invoices.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ORD-0001 or name..."
            className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {["all", "pending", "completed"].map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            type="button"
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
              statusFilter === tab
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            {tab === "all" ? `All Orders (${orders.length})` : tab}
          </button>
        ))}
      </div>

      {/* Orders List Content */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center space-y-3">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-xs font-semibold text-slate-600">Loading orders database...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-4">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
            <Receipt className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">No matching orders found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              {searchQuery
                ? `No orders matching "${searchQuery}".`
                : "No customer orders have been placed yet."}
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-black text-white font-bold text-xs shadow-md transition-all active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Place First Order</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm hover:border-blue-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-black text-base text-blue-600">
                    {order.orderNumber}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-black text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-md">
                    <Clock className="w-3 h-3 text-amber-600" />
                    <span>{order.status || "Pending"}</span>
                  </span>
                  <span className="text-[11px] font-bold text-slate-400">
                    • {order.shippingMethod}
                  </span>
                </div>

                <p className="text-xs text-slate-600 flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span>
                    Customer: <strong>{order.customerName || "Customer"}</strong>
                  </span>
                  {order.email && <span className="text-slate-400 font-mono">({order.email})</span>}
                  <span>Date: {formatDate(order.createdAt)}</span>
                </p>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <div className="text-right">
                  <span className="text-xl font-black text-slate-900 block font-mono">
                    ${order.total.toFixed(2)}
                  </span>
                  <span className="text-[11px] text-slate-400">Grand Total</span>
                </div>

                <Link
                  href={`/order-confirmation/${order.orderNumber}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-black text-white font-bold text-xs shadow-md transition-all active:scale-95"
                >
                  <span>Slide 28 Receipt</span>
                  <ArrowRight className="w-4 h-4 text-blue-400" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
