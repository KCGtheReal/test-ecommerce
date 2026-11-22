"use client";

import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart,
  Check,
  Package,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Layers,
  RefreshCw,
  Search,
  Truck,
  Star,
  X,
  Plus,
  Minus,
  Cpu,
} from "lucide-react";
import { Product } from "@/types";
import { useCart } from "@/context/cart-context";
import ProductCard from "@/components/product-card";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Quick View Modal
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [modalQty, setModalQty] = useState(1);
  const [modalAdded, setModalAdded] = useState(false);

  const { addItem, itemCount } = useCart();

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Failed to load products");
        const data = await res.json();
        setProducts(data.data || data.products || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error fetching products");
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  // Filtered products list
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory !== "All") {
      result = result.filter(
        (p) => p.category?.name?.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q))
      );
    }

    return result;
  }, [products, selectedCategory, searchQuery]);

  const handleOpenQuickView = (product: Product) => {
    setQuickViewProduct(product);
    setModalQty(1);
    setModalAdded(false);
  };

  const handleModalAddToCart = () => {
    if (!quickViewProduct) return;
    addItem(quickViewProduct, modalQty);
    setModalAdded(true);
    setTimeout(() => {
      setModalAdded(false);
    }, 1500);
  };

  return (
    <div className="space-y-10 pb-20">
      {/* VIEW 1: HARDWARE CATALOG HERO (EXERCISE 1 / SLIDE 26) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10">
        <div className="relative rounded-3xl bg-[#0E1420] border border-white/10 p-8 sm:p-12 overflow-hidden shadow-chamfer">
          {/* Subtle atmospheric glow */}
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>លំហាត់អនុវត្តទី១៖ ៤ មុខទំនិញ (4 Official Products)</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Cyber-Tactile Industrial Hardware. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300">
                Engineered with Precision.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-sans">
              The four official hardware components from <strong>លំហាត់អនុវត្ត.pdf</strong>:{" "}
              <strong className="text-white">Laptop ($650.00)</strong>,{" "}
              <strong className="text-white">Mouse ($15.00)</strong>,{" "}
              <strong className="text-white">Keyboard ($25.00)</strong>, and{" "}
              <strong className="text-white">Monitor ($120.00)</strong>. Experience mechanical tactile
              button feedback, real-time stock pulse radar, and instant cart synchronization.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                href="/cart"
                className="btn-tactile px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold shadow-glow-blue flex items-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Open Cart Deck ({itemCount} items)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/erd"
                className="btn-tactile px-5 py-3 rounded-xl bg-[#151D2C] hover:bg-[#1E293B] border border-white/10 text-slate-300 font-mono text-xs font-bold flex items-center gap-2"
              >
                <Layers className="w-4 h-4 text-blue-400" />
                <span>Exercise 4: 5-Table ERD</span>
              </Link>
            </div>

            {/* 3 Value Proposition Telemetry Cards */}
            <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-white/10 text-left font-mono">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#080B11] border border-white/5">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Official Warranty
                  </h4>
                  <p className="text-[11px] text-slate-400 font-sans">1-Year hardware replacement</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#080B11] border border-white/5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Express Dispatch
                  </h4>
                  <p className="text-[11px] text-slate-400 font-sans">Free ($0) or Priority ($9)</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#080B11] border border-white/5">
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/20">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    3NF Architecture
                  </h4>
                  <p className="text-[11px] text-slate-400 font-sans">SQLite relational engine</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Search & Category Filter Toolbar */}
        <div className="bg-[#0E1420] rounded-2xl border border-white/10 shadow-chamfer p-4 sm:p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 font-mono">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="SEARCH HARDWARE (e.g. Laptop, Mouse, Keyboard, Monitor)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-[#080B11] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all font-mono"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-white"
              >
                [CLEAR]
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {["All", "Computers", "Accessories", "Displays"].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  selectedCategory === cat
                    ? "bg-[#151D2C] text-blue-400 border-blue-500/40 shadow-inner"
                    : "bg-[#080B11] text-slate-400 border-white/5 hover:text-white hover:bg-white/5"
                }`}
              >
                {cat === "All" ? "ALL HARDWARE (4)" : cat.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Catalog Grid State */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center space-y-3 font-mono">
            <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
            <p className="text-xs text-slate-400">[ INITIALIZING HARDWARE INVENTORY... ]</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center bg-rose-500/10 rounded-2xl border border-rose-500/30 space-y-3 font-mono">
            <p className="text-xs font-bold text-rose-400">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-tactile px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold"
            >
              [ RETRY TELEMETRY ]
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center bg-[#0E1420] rounded-3xl border border-white/10 space-y-3 font-mono">
            <h3 className="font-bold text-white text-base">NO MATCHING HARDWARE LOCATED</h3>
            <p className="text-xs text-slate-400">
              No components matching query &ldquo;{searchQuery}&rdquo;.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="btn-tactile px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
            >
              [ RESET FILTERS ]
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={handleOpenQuickView}
              />
            ))}
          </div>
        )}
      </section>

      {/* Interactive Quick View Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div
            onClick={() => setQuickViewProduct(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
          />

          <div className="relative bg-[#0E1420] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-white/10 z-10 space-y-6 animate-in zoom-in-95 duration-200 font-mono">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                TELEMETRY INSPECTION // {quickViewProduct.slug?.toUpperCase() || quickViewProduct.name.toUpperCase()}
              </span>
              <button
                onClick={() => setQuickViewProduct(null)}
                type="button"
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              {/* Product Photo */}
              <div className="relative aspect-4/3 w-full bg-[#080B11] rounded-2xl overflow-hidden border border-white/10 shadow-inner">
                {quickViewProduct.imageUrl ? (
                  <Image
                    src={quickViewProduct.imageUrl}
                    alt={quickViewProduct.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-600">
                    <Package className="w-12 h-12" />
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[#080B11]/90 text-blue-400 border border-blue-500/30">
                    {quickViewProduct.category?.name || "Hardware"}
                  </span>
                </div>
              </div>

              {/* Info & Purchase */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-black text-2xl text-white font-sans">
                    {quickViewProduct.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-xs">
                    <div className="flex items-center text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                    <span className="font-bold text-slate-200">4.9</span>
                    <span className="text-slate-500">• {quickViewProduct.stock} IN STOCK</span>
                  </div>
                </div>

                <div className="text-3xl font-black text-white font-mono">
                  ${quickViewProduct.price.toFixed(2)}
                </div>

                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  {quickViewProduct.description}
                </p>

                {/* Quantity and Add CTA */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-slate-400">QUANTITY:</span>
                    <div className="flex items-center border border-white/10 rounded-xl bg-[#080B11] overflow-hidden">
                      <button
                        onClick={() => setModalQty((q) => Math.max(1, q - 1))}
                        type="button"
                        className="p-2 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold text-white">{modalQty}</span>
                      <button
                        onClick={() => setModalQty((q) => q + 1)}
                        type="button"
                        className="p-2 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleModalAddToCart}
                    type="button"
                    className={`btn-tactile w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-mono font-bold text-xs transition-all shadow-md ${
                      modalAdded
                        ? "bg-emerald-500 text-slate-950 font-black shadow-glow-emerald"
                        : "bg-blue-600 hover:bg-blue-500 text-white shadow-glow-blue"
                    }`}
                  >
                    {modalAdded ? (
                      <>
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>[ ✓ LOADED {modalQty} TO CART ]</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4 text-blue-200" />
                        <span>
                          [ + ADD {modalQty} TO CART • ${(quickViewProduct.price * modalQty).toFixed(2)} ]
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
