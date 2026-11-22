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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-mono">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
            Order Record & Confirmation Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-0.5 font-sans">
            Submitted Orders Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-sans">
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
            className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-white/10 bg-[#080B11] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
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
            className={`btn-tactile px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
              statusFilter === tab
                ? "bg-[#151D2C] text-blue-400 border border-blue-500/40 shadow-inner"
                : "bg-[#0E1420] text-slate-400 hover:text-white border border-white/5"
            }`}
          >
            {tab === "all" ? `All Orders (${orders.length})` : tab}
          </button>
        ))}
      </div>

      {/* Orders List Content */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center space-y-3 font-mono">
          <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
          <p className="text-xs text-slate-400">[ QUERYING ORDERS DATABASE... ]</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="p-12 text-center bg-[#0E1420] rounded-3xl border border-white/10 space-y-4 font-mono shadow-chamfer">
          <div className="w-16 h-16 bg-[#080B11] text-blue-400 border border-white/10 rounded-2xl flex items-center justify-center mx-auto">
            <Receipt className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-sans">No matching orders located</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 font-sans">
              {searchQuery
                ? `No orders matching "${searchQuery}".`
                : "No customer orders have been placed yet."}
            </p>
          </div>
          <Link
            href="/"
            className="btn-tactile inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-glow-blue"
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
              className="bg-[#0E1420] p-5 sm:p-6 rounded-3xl border border-white/10 shadow-chamfer hover:border-blue-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-3">
                  <span className="font-black text-base text-blue-400">
                    {order.orderNumber}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-amber-400 bg-amber-500/20 border border-amber-500/30 px-2.5 py-0.5 rounded-md">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>{order.status || "Pending"}</span>
                  </span>
                  <span className="text-[11px] font-bold text-slate-500">
                    • {order.shippingMethod}
                  </span>
                </div>

                <p className="text-xs text-slate-400 flex flex-wrap items-center gap-x-4 gap-y-1 font-sans">
                  <span>
                    Customer: <strong className="text-white">{order.customerName || "Customer"}</strong>
                  </span>
                  {order.email && <span className="text-slate-500 font-mono">({order.email})</span>}
                  <span>Date: {formatDate(order.createdAt)}</span>
                </p>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10">
                <div className="text-right">
                  <span className="text-xl font-black text-white block">
                    ${order.total.toFixed(2)}
                  </span>
                  <span className="text-[11px] text-slate-500">Grand Total</span>
                </div>

                <Link
                  href={`/order-confirmation/${order.orderNumber}`}
                  className="btn-tactile inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-glow-blue transition-all"
                >
                  <span>Slide 28 Receipt</span>
                  <ArrowRight className="w-4 h-4 text-blue-200" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
