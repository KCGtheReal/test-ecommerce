"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  ShoppingCart,
  Check,
  Star,
  Eye,
  Package,
} from "lucide-react";
import { Product } from "@/types";
import { useCart } from "@/context/cart-context";

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

// Technical specs mapping for the 4 catalog products from លំហាត់អនុវត្ត.pdf
const PRODUCT_SPECS: Record<string, { specs: string; rating: number; reviews: number }> = {
  laptop: {
    specs: "16GB RAM // 512GB SSD // FHD IPS",
    rating: 4.9,
    reviews: 142,
  },
  mouse: {
    specs: "16,000 DPI // 2.4GHz // Silent Clicks",
    rating: 4.8,
    reviews: 89,
  },
  keyboard: {
    specs: "Blue Tactile // Hot-Swap // RGB Backlit",
    rating: 4.9,
    reviews: 210,
  },
  monitor: {
    specs: "3840x2160 // 144Hz 1ms // HDR400",
    rating: 4.9,
    reviews: 95,
  },
};

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const slugKey = product.slug?.toLowerCase() || product.name.toLowerCase();
  const meta = PRODUCT_SPECS[slugKey] || {
    specs: "Precision Hardware Component",
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
    <div className="group relative bg-[#0E1420] rounded-3xl border border-white/10 hover:border-blue-500/50 shadow-chamfer hover:shadow-chamfer-hover transition-all duration-300 flex flex-col overflow-hidden">
      {/* Hardware Viewport */}
      <div className="relative aspect-4/3 w-full bg-[#080B11] overflow-hidden border-b border-white/5">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-600">
            <Package className="w-12 h-12" />
          </div>
        )}

        {/* Top Left: Category Pill */}
        <div className="absolute top-3 left-3 z-10">
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider bg-[#080B11]/90 text-blue-400 border border-blue-500/30 backdrop-blur-md">
            {product.category?.name || "Hardware"}
          </span>
        </div>

        {/* Top Right: Live Pulsing Stock Radar */}
        <div className="absolute top-3 right-3 z-10">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-[#080B11]/90 text-emerald-400 border border-emerald-500/30 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>{product.stock} IN STOCK</span>
          </span>
        </div>

        {/* Hover Quick View HUD */}
        <div className="absolute inset-0 bg-[#080B11]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-xs z-20">
          <button
            onClick={() => onQuickView && onQuickView(product)}
            type="button"
            className="btn-tactile px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold border border-white/30 backdrop-blur-md flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5 text-blue-400" />
            <span>[ VIEW TELEMETRY ]</span>
          </button>
        </div>
      </div>

      {/* Card Data Body */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-amber-400 text-xs font-mono font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{meta.rating}</span>
              <span className="text-slate-500">({meta.reviews})</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
              EX-1 OFFICIAL
            </span>
          </div>

          <h3 className="font-black text-lg text-white tracking-tight group-hover:text-blue-400 transition-colors">
            {product.name}
          </h3>

          {/* Monospaced Technical Specs Readout */}
          <div className="bg-[#080B11] p-2 rounded-xl border border-white/5 font-mono text-[11px] text-slate-300">
            <code>{meta.specs}</code>
          </div>

          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {product.description || "Official hardware product from Exercise 1."}
          </p>
        </div>

        {/* Bottom Price & Tactile Button */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-mono text-slate-500 uppercase block tracking-wider">
              UNIT PRICE
            </span>
            <span className="text-2xl font-black font-mono text-white tracking-tight">
              ${product.price.toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleAdd}
            type="button"
            className={`btn-tactile px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all shadow-md flex items-center gap-1.5 ${
              isAdded
                ? "bg-emerald-500 text-slate-950 font-black shadow-glow-emerald"
                : "bg-blue-600 hover:bg-blue-500 text-white shadow-glow-blue"
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>[ ✓ LOADED ]</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5 text-blue-200" />
                <span>[ + ADD ]</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
