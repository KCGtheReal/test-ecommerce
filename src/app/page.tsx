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
  Laptop,
  RefreshCw,
  Search,
  Truck,
  Star,
  X,
  Plus,
  Minus,
  CheckCircle2,
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

  const { addItem, itemCount, subtotal } = useCart();

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
    <div className="space-y-12 pb-20">
      {/* Hero Presentation Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        {/* Ambient background glow circles */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider border border-blue-500/30">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>លំហាត់អនុវត្តទី១ (Exercise 1: 4 Products & Cart)</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            High-Performance Computer Hardware, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300">
              Clean E-Commerce Flow
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            The four official hardware products from <strong>លំហាត់អនុវត្ត.pdf</strong>:{" "}
            <strong>Laptop ($650)</strong>, <strong>Mouse ($15)</strong>, <strong>Keyboard ($25)</strong>, and{" "}
            <strong>Monitor ($120)</strong>. Experience seamless cart updates, address checkout, and order confirmation.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/cart"
              className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-xl shadow-blue-500/25 transition-all flex items-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Review Shopping Cart ({itemCount} items)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/erd"
              className="px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold text-xs sm:text-sm border border-white/20 transition-all flex items-center gap-2 backdrop-blur-xs"
            >
              <Layers className="w-4 h-4 text-blue-400" />
              <span>Exercise 4: 5-Table ERD</span>
            </Link>
          </div>

          {/* 3 Trust Badges Row */}
          <div className="pt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto border-t border-slate-800 text-left">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">1-Year Official Warranty</h4>
                <p className="text-[11px] text-slate-400">Guaranteed authentic components</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Fast Courier Delivery</h4>
                <p className="text-[11px] text-slate-400">Free ($0) or Priority Express ($9)</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Relational 3NF Architecture</h4>
                <p className="text-[11px] text-slate-400">SQLite schema with foreign keys</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Search & Category Filter Toolbar */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 sm:p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter products (e.g. Laptop, Mouse, Keyboard, Monitor)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {["All", "Computers", "Accessories", "Displays"].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat === "All" ? "All Hardware (4)" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Catalog Grid State */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-sm font-semibold text-slate-600">Loading catalog items...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center bg-red-50 rounded-2xl border border-red-200 space-y-3">
            <p className="text-sm font-bold text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold"
            >
              Try Again
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
            <h3 className="font-bold text-slate-800 text-base">No matching products</h3>
            <p className="text-xs text-slate-500">
              No products found matching &ldquo;{searchQuery}&rdquo;.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
            >
              Reset Filters
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
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
          />

          <div className="relative bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 z-10 space-y-6 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Quick Product Overview
              </span>
              <button
                onClick={() => setQuickViewProduct(null)}
                type="button"
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              {/* Product Photo */}
              <div className="relative aspect-4/3 w-full bg-slate-100 rounded-2xl overflow-hidden shadow-inner">
                {quickViewProduct.imageUrl ? (
                  <Image
                    src={quickViewProduct.imageUrl}
                    alt={quickViewProduct.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <Package className="w-12 h-12" />
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white text-slate-800 shadow-xs">
                    {quickViewProduct.category?.name || "Hardware"}
                  </span>
                </div>
              </div>

              {/* Info & Purchase */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-black text-2xl text-slate-900">
                    {quickViewProduct.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-slate-700">4.9</span>
                    <span className="text-xs text-slate-400">• In Stock ({quickViewProduct.stock})</span>
                  </div>
                </div>

                <div className="text-3xl font-black text-slate-900 font-mono">
                  ${quickViewProduct.price.toFixed(2)}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {quickViewProduct.description}
                </p>

                {/* Quantity and Add CTA */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-slate-600">Quantity:</span>
                    <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
                      <button
                        onClick={() => setModalQty((q) => Math.max(1, q - 1))}
                        type="button"
                        className="p-1.5 hover:bg-white text-slate-600 hover:text-slate-900 transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold text-slate-900">{modalQty}</span>
                      <button
                        onClick={() => setModalQty((q) => q + 1)}
                        type="button"
                        className="p-1.5 hover:bg-white text-slate-600 hover:text-slate-900 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleModalAddToCart}
                    type="button"
                    className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs transition-all shadow-md active:scale-95 ${
                      modalAdded
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-900 hover:bg-black text-white"
                    }`}
                  >
                    {modalAdded ? (
                      <>
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>Added {modalQty} to Cart!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4 text-blue-400" />
                        <span>Add {modalQty} to Cart • ${(quickViewProduct.price * modalQty).toFixed(2)}</span>
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
