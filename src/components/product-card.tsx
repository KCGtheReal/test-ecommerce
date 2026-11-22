"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  ShoppingCart,
  Check,
  Star,
  Eye,
  ShieldCheck,
  Zap,
  Package,
} from "lucide-react";
import { Product } from "@/types";
import { useCart } from "@/context/cart-context";

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

// Tech specs mapping for the 4 catalog products
const PRODUCT_SPECS: Record<string, { specs: string; rating: number; reviews: number }> = {
  laptop: {
    specs: "16GB RAM • 512GB NVMe SSD • 15.6\" FHD IPS",
    rating: 4.9,
    reviews: 142,
  },
  mouse: {
    specs: "16,000 DPI Optical • Wireless 2.4GHz • Silent Clicks",
    rating: 4.8,
    reviews: 89,
  },
  keyboard: {
    specs: "Mechanical RGB • Tactile Blue Switches • Hot-Swap",
    rating: 4.9,
    reviews: 210,
  },
  monitor: {
    specs: "27-inch 4K UHD IPS • 144Hz 1ms • HDR400 FreeSync",
    rating: 4.9,
    reviews: 95,
  },
};

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const slugKey = product.slug?.toLowerCase() || product.name.toLowerCase();
  const meta = PRODUCT_SPECS[slugKey] || {
    specs: "High Performance Hardware",
    rating: 4.9,
    reviews: 120,
  };

  const handleAdd = () => {
    addItem(product, 1);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  return (
    <div className="group bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-blue-400/80 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Image Container */}
      <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover group-hover:scale-108 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            <Package className="w-12 h-12" />
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/95 text-slate-800 backdrop-blur-md shadow-xs border border-slate-200/70">
            {product.category?.name || "Computers"}
          </span>
        </div>

        {/* Live Stock Indicator with pulsing green dot */}
        <div className="absolute top-3 right-3 z-10">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-950/80 text-white backdrop-blur-md shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>{product.stock} in stock</span>
          </span>
        </div>

        {/* Hover Quick View Trigger */}
        <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center z-20 backdrop-blur-[2px]">
          <button
            onClick={() => onQuickView && onQuickView(product)}
            type="button"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-slate-900 text-xs font-bold shadow-lg hover:scale-105 active:scale-95 transition-all"
          >
            <Eye className="w-4 h-4 text-blue-600" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Details Body */}
      <div className="p-5 flex flex-col flex-1">
        {/* Rating & Reviews */}
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{meta.rating}</span>
            <span className="text-slate-400 font-normal">({meta.reviews})</span>
          </div>
          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
            Exercise 1 Item
          </span>
        </div>

        {/* Product Title */}
        <h3 className="font-black text-lg text-slate-900 group-hover:text-blue-600 transition-colors mb-1">
          {product.name}
        </h3>

        {/* Tech Specs Badge Pill */}
        <div className="mb-3">
          <span className="inline-block text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
            {meta.specs}
          </span>
        </div>

        {/* Description Excerpt */}
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4 flex-1">
          {product.description || "Hardware product from Exercise 1."}
        </p>

        {/* Price & Add to Cart Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Unit Price
            </span>
            <span className="text-2xl font-black text-slate-900 tracking-tight font-mono">
              ${product.price.toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleAdd}
            type="button"
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm active:scale-95 duration-200 ${
              isAdded
                ? "bg-emerald-600 text-white shadow-emerald-500/25 scale-95"
                : "bg-slate-900 hover:bg-black text-white shadow-slate-900/20 hover:scale-[1.02]"
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4 animate-in zoom-in-50 stroke-[3]" />
                <span>Added!</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 text-blue-400" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
