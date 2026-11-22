"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Package,
  Truck,
  Sparkles,
  Tag,
  Check,
} from "lucide-react";
import { useCart } from "@/context/cart-context";

// Technical specs mapping for cart items
const PRODUCT_SPECS: Record<string, string> = {
  laptop: "16GB RAM // 512GB SSD // FHD IPS",
  mouse: "16,000 DPI // 2.4GHz // Silent Clicks",
  keyboard: "Blue Tactile // Hot-Swap // RGB Backlit",
  monitor: "3840x2160 // 144Hz 1ms // HDR400",
};

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, itemCount, subtotal } = useCart();

  // Promo code state
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);

  const freeThreshold = 50.0;
  const isFreeStandard = subtotal >= freeThreshold || subtotal === 0;
  const amountToFree = Math.max(0, freeThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / freeThreshold) * 100));

  // Promo discount calculation (10% off with TECH10)
  const discountRate = appliedPromo === "TECH10" ? 0.1 : 0.0;
  const discountAmount = subtotal * discountRate;
  const deliveryFee = 0.0; // Standard free delivery preview
  const grandTotal = Math.max(0, subtotal - discountAmount + deliveryFee);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError(null);
    if (!promoCode.trim()) return;

    if (promoCode.trim().toUpperCase() === "TECH10") {
      setAppliedPromo("TECH10");
      setPromoCode("");
    } else {
      setPromoError("Invalid code. Use 'TECH10' for 10% off.");
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6 font-mono">
        <div className="w-20 h-20 bg-[#0E1420] text-blue-400 border border-white/10 rounded-3xl flex items-center justify-center mx-auto shadow-chamfer">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-sans">
            Shopping Cart Deck is Empty
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto font-sans">
            No components loaded into dispatch queue. Explore our 4 catalog hardware products from Exercise 1.
          </p>
        </div>
        <Link
          href="/"
          className="btn-tactile inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-glow-blue"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>[ RETURN TO CATALOG ]</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-mono">
      {/* Title & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Link href="/" className="hover:text-blue-400 transition-colors">
              01. CATALOG
            </Link>
            <span>/</span>
            <span className="text-blue-400 font-bold">02. SHOPPING CART MATRIX</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3 font-sans">
            <span>Hardware Dispatch Cart</span>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
              {itemCount} {itemCount === 1 ? "ITEM" : "ITEMS"} LOADED
            </span>
          </h1>
        </div>
        <button
          onClick={clearCart}
          type="button"
          className="self-start sm:self-auto text-xs font-bold text-rose-400 hover:text-rose-300 transition-colors"
        >
          [ PURGE CART ]
        </button>
      </div>

      {/* Free Shipping Unlock Meter */}
      <div className="bg-[#0E1420] rounded-2xl border border-white/10 p-5 shadow-chamfer space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Truck className="w-4 h-4 text-blue-400" />
            {isFreeStandard ? (
              <span className="text-emerald-400 font-bold">
                🎉 [ ✓ FREE EXPRESS DISPATCH UNLOCKED ON ORDERS &gt; $50 ]
              </span>
            ) : (
              <span>
                ADD <strong className="text-white font-bold">${amountToFree.toFixed(2)}</strong> MORE TO UNLOCK FREE SHIPPING
              </span>
            )}
          </div>
          <span className="font-black text-blue-400">{progressPercent}%</span>
        </div>
        <div className="w-full bg-[#080B11] h-2.5 rounded-full overflow-hidden border border-white/5">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-emerald-400 transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Cart Grid (Table + Sticky Summary) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Cart Table (Col 8) */}
        <div className="lg:col-span-8 bg-[#0E1420] rounded-3xl border border-white/10 shadow-chamfer overflow-hidden">
          {/* Table Header (Desktop) */}
          <div className="p-4 sm:p-5 border-b border-white/10 hidden sm:grid grid-cols-12 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <span className="col-span-6">Component Specification</span>
            <span className="col-span-2 text-center">Unit Price</span>
            <span className="col-span-2 text-center">Quantity</span>
            <span className="col-span-2 text-right">Line Total</span>
          </div>

          <div className="divide-y divide-white/5">
            {items.map((item) => {
              const lineTotal = item.product.price * item.quantity;
              const slugKey = item.product.slug?.toLowerCase() || item.product.name.toLowerCase();
              const specs = PRODUCT_SPECS[slugKey] || "High Performance Hardware";

              return (
                <div
                  key={item.product.id}
                  className="p-4 sm:p-5 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                    {/* Item Info (Col 6) */}
                    <div className="sm:col-span-6 flex items-center gap-3.5">
                      <div className="relative w-16 h-16 rounded-xl bg-[#080B11] border border-white/10 overflow-hidden shrink-0">
                        {item.product.imageUrl ? (
                          <Image
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-600">
                            <Package className="w-6 h-6" />
                          </div>
                        )}
                      </div>

                      <div className="space-y-1 min-w-0">
                        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                          {item.product.category?.name || "HARDWARE"}
                        </span>
                        <h3 className="font-bold text-sm text-white font-sans truncate">
                          {item.product.name}
                        </h3>
                        <div className="text-[10px] text-slate-400 truncate">
                          <code>{specs}</code>
                        </div>
                      </div>
                    </div>

                    {/* Unit Price (Col 2) */}
                    <div className="sm:col-span-2 text-left sm:text-center">
                      <span className="sm:hidden text-[10px] text-slate-500 uppercase mr-2">
                        PRICE:
                      </span>
                      <span className="text-xs font-bold text-slate-300">
                        ${item.product.price.toFixed(2)}
                      </span>
                    </div>

                    {/* Quantity Stepper (Col 2) */}
                    <div className="sm:col-span-2 flex items-center sm:justify-center gap-1.5">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        type="button"
                        aria-label="Decrease quantity"
                        className="btn-tactile w-7 h-7 rounded-lg bg-[#080B11] border border-white/10 hover:border-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>

                      <span className="w-8 text-center text-xs font-black text-white">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        type="button"
                        aria-label="Increase quantity"
                        className="btn-tactile w-7 h-7 rounded-lg bg-[#080B11] border border-white/10 hover:border-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Line Total & Remove (Col 2) */}
                    <div className="sm:col-span-2 flex items-center justify-between sm:justify-end gap-3">
                      <span className="text-sm font-black text-white">
                        ${lineTotal.toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        type="button"
                        title="Remove component"
                        className="text-slate-500 hover:text-rose-400 p-1.5 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Table Toolbar */}
          <div className="p-4 sm:p-5 bg-[#080B11] border-t border-white/10 flex items-center justify-between">
            <Link
              href="/"
              className="btn-tactile px-4 py-2 rounded-xl bg-[#151D2C] hover:bg-[#1E293B] text-slate-300 font-mono text-xs font-bold flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Hardware Catalog</span>
            </Link>
            <span className="text-xs text-slate-500 hidden sm:inline">
              Exercise 1 Shopping Cart Spec
            </span>
          </div>
        </div>

        {/* Right Column: Sticky Manifest Summary (Col 4) */}
        <div className="lg:col-span-4 bg-[#0E1420] rounded-3xl border border-white/10 shadow-chamfer p-6 space-y-6 sticky top-24">
          <div className="pb-3 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-base font-black text-white uppercase tracking-wide">
              Dispatch Manifest
            </h2>
            <span className="text-xs text-blue-400 font-bold">[ ACTIVE ]</span>
          </div>

          {/* Promo Code Input */}
          <form onSubmit={handleApplyPromo} className="space-y-2">
            <label className="block text-[10px] text-slate-400 uppercase tracking-wider">
              PROMO CODE / COUPON
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="ENTER 'TECH10'"
                className="w-full px-3 py-2 rounded-xl bg-[#080B11] border border-white/10 text-xs text-white placeholder-slate-600 uppercase focus:border-blue-500 focus:outline-none"
              />
              <button
                type="submit"
                className="btn-tactile px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
              >
                APPLY
              </button>
            </div>
            {appliedPromo && (
              <div className="text-[11px] text-emerald-400 flex items-center gap-1.5 pt-1">
                <Check className="w-3.5 h-3.5" />
                <span>[ ✓ PROMO &apos;TECH10&apos; APPLIED: -10% OFF ]</span>
              </div>
            )}
            {promoError && (
              <div className="text-[11px] text-rose-400 pt-1">
                [ ⚠ {promoError} ]
              </div>
            )}
          </form>

          {/* Price Telemetry Breakdown */}
          <div className="space-y-3 text-xs border-t border-white/10 pt-4">
            <div className="flex items-center justify-between text-slate-400">
              <span>ITEMS SUBTOTAL:</span>
              <span className="font-bold text-white">${subtotal.toFixed(2)}</span>
            </div>

            {appliedPromo && (
              <div className="flex items-center justify-between text-emerald-400 font-bold">
                <span>PROMO DISCOUNT (10%):</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex items-center justify-between text-slate-400">
              <span>ESTIMATED DELIVERY:</span>
              <span className="text-emerald-400 font-bold">FREE ($0.00)</span>
            </div>

            <div className="flex items-center justify-between text-slate-400">
              <span>ESTIMATED TAX:</span>
              <span className="font-bold text-slate-300">$0.00</span>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-baseline justify-between text-sm">
              <span className="font-black text-white text-base">ESTIMATED TOTAL:</span>
              <div className="text-right">
                <span className="text-2xl font-black text-white tracking-tight">
                  ${grandTotal.toFixed(2)}
                </span>
                <span className="block text-[10px] text-slate-500">
                  + Optional Express on next step
                </span>
              </div>
            </div>
          </div>

          {/* Proceed to Checkout CTA */}
          <Link
            href="/checkout"
            className="btn-tactile w-full py-4 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm shadow-glow-blue flex items-center justify-center gap-2 tracking-wide"
          >
            <span>PROCEED TO CHECKOUT</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <div className="flex items-center justify-center gap-2 text-xs text-slate-500 pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>EXERCISE 2 CHECKOUT READY</span>
          </div>
        </div>
      </div>
    </div>
  );
}
