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
  Heart,
  Tag,
  Check,
  Truck,
  Sparkles,
} from "lucide-react";
import { useCart } from "@/context/cart-context";

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, itemCount, subtotal } = useCart();

  // Promo code state
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [wishlistMap, setWishlistMap] = useState<Record<number, boolean>>({});

  const freeThreshold = 50.0;
  const isFreeStandard = subtotal >= freeThreshold || subtotal === 0;
  const amountToFree = Math.max(0, freeThreshold - subtotal);
  const progressPercent = Math.min(100, (subtotal / freeThreshold) * 100);

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

  const toggleWishlist = (productId: number) => {
    setWishlistMap((prev) => ({ ...prev, [productId]: !prev[productId] }));
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Your Shopping Cart is Empty
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            You haven&apos;t added any items to your cart yet. Explore our 4 catalog hardware products from Exercise 1.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-black text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Explore Products Catalog</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Title & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-1">
            <Link href="/" className="hover:text-blue-600 transition-colors">
              Store
            </Link>
            <span>/</span>
            <span className="text-blue-600">Shopping Cart (Exercise 1)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Shopping Cart ({itemCount} {itemCount === 1 ? "item" : "items"})
          </h1>
        </div>
        <button
          onClick={clearCart}
          type="button"
          className="self-start sm:self-auto text-xs font-bold text-slate-400 hover:text-rose-600 transition-colors"
        >
          Clear Cart
        </button>
      </div>

      {/* Free Shipping Progress Meter */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 sm:p-5 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-800 flex items-center gap-2">
            <Truck className="w-4 h-4 text-blue-600" />
            {isFreeStandard ? (
              <span className="text-emerald-600 font-bold">
                🎉 Congratulations! Your order qualifies for Free Standard Delivery.
              </span>
            ) : (
              <span>
                Add <strong>${amountToFree.toFixed(2)}</strong> more to unlock Free Standard Shipping!
              </span>
            )}
          </span>
          <span className="font-mono font-bold text-slate-500">{Math.round(progressPercent)}%</span>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Cart Items Table (Col 8) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
          {/* Table Header (hidden on mobile) */}
          <div className="p-4 sm:p-6 border-b border-slate-100 hidden sm:grid grid-cols-12 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span className="col-span-6">Product Details</span>
            <span className="col-span-2 text-center">Unit Price</span>
            <span className="col-span-2 text-center">Quantity</span>
            <span className="col-span-2 text-right">Total</span>
          </div>

          <div className="divide-y divide-slate-100">
            {items.map((item) => {
              const lineTotal = item.product.price * item.quantity;
              const isWishlisted = !!wishlistMap[item.product.id];

              return (
                <div
                  key={item.product.id}
                  className="p-4 sm:p-6 flex flex-col sm:grid sm:grid-cols-12 sm:items-center gap-4 hover:bg-slate-50/50 transition-colors"
                >
                  {/* Product Details (Col 6) */}
                  <div className="sm:col-span-6 flex items-center gap-4">
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200/60 shadow-2xs">
                      {item.product.imageUrl ? (
                        <Image
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <Package className="w-8 h-8" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
                        {item.product.category?.name || "Computers"}
                      </span>
                      <h3 className="font-extrabold text-base text-slate-900 truncate">
                        {item.product.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                        {item.product.description}
                      </p>

                      {/* Mobile action buttons */}
                      <div className="sm:hidden flex items-center gap-3 mt-2">
                        <button
                          onClick={() => removeItem(item.product.id)}
                          type="button"
                          className="text-xs text-rose-600 font-bold inline-flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                        <button
                          onClick={() => toggleWishlist(item.product.id)}
                          type="button"
                          className={`text-xs font-bold inline-flex items-center gap-1 ${
                            isWishlisted ? "text-rose-500" : "text-slate-400"
                          }`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? "fill-rose-500" : ""}`} />
                          <span>Wishlist</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Unit Price (Col 2) */}
                  <div className="sm:col-span-2 text-left sm:text-center">
                    <span className="sm:hidden text-xs text-slate-400 font-medium mr-2">Unit Price:</span>
                    <span className="text-sm font-bold text-slate-800 font-mono">
                      ${item.product.price.toFixed(2)}
                    </span>
                  </div>

                  {/* Quantity Stepper (Col 2) */}
                  <div className="sm:col-span-2 flex items-center justify-between sm:justify-center">
                    <div className="flex items-center border border-slate-200 rounded-2xl bg-slate-50 overflow-hidden shadow-2xs">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        type="button"
                        className="p-1.5 hover:bg-white text-slate-600 hover:text-slate-900 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-extrabold text-slate-900 font-mono">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        type="button"
                        className="p-1.5 hover:bg-white text-slate-600 hover:text-slate-900 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Action buttons (desktop) */}
                    <div className="hidden sm:flex items-center gap-1 ml-2">
                      <button
                        onClick={() => toggleWishlist(item.product.id)}
                        type="button"
                        className={`p-1.5 rounded-lg transition-colors ${
                          isWishlisted ? "text-rose-500 bg-rose-50" : "text-slate-400 hover:text-slate-600"
                        }`}
                        title="Save to wishlist"
                      >
                        <Heart className={`w-4 h-4 ${isWishlisted ? "fill-rose-500" : ""}`} />
                      </button>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        type="button"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Total Amount (Col 2) */}
                  <div className="sm:col-span-2 text-right">
                    <span className="sm:hidden text-xs text-slate-400 font-medium mr-2">Total:</span>
                    <span className="text-base font-black text-slate-900 font-mono">
                      ${lineTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Table Footer */}
          <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 font-bold text-xs text-slate-700 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Continue Shopping</span>
            </Link>

            <span className="text-xs text-slate-500 font-medium">
              Tax calculated transparently at checkout
            </span>
          </div>
        </div>

        {/* Right Column: Sticky Order Summary Card (Col 4) */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-6 sticky top-24">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900">Order Summary</h2>
            <span className="text-xs font-bold text-slate-500">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </span>
          </div>

          {/* Promo Code Input Bar */}
          <form onSubmit={handleApplyPromo} className="space-y-2">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Promo Code
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Enter 'TECH10' for 10% off"
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 uppercase focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                />
              </div>
              <button
                type="submit"
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition-all shadow-xs"
              >
                Apply
              </button>
            </div>

            {promoError && (
              <p className="text-[11px] text-rose-500 font-semibold">{promoError}</p>
            )}

            {appliedPromo && (
              <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold animate-in zoom-in-95">
                <span className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Promo &apos;{appliedPromo}&apos; applied (-10%)</span>
                </span>
                <button
                  type="button"
                  onClick={() => setAppliedPromo(null)}
                  className="text-slate-400 hover:text-slate-600 text-[10px]"
                >
                  ✕
                </button>
              </div>
            )}
          </form>

          {/* Price Breakdown */}
          <div className="space-y-3 text-xs border-t border-slate-100 pt-3">
            <div className="flex items-center justify-between text-slate-600">
              <span>Items Subtotal</span>
              <span className="font-bold text-slate-900 font-mono">${subtotal.toFixed(2)}</span>
            </div>

            {appliedPromo && (
              <div className="flex items-center justify-between text-emerald-600 font-bold">
                <span>Discount (10% Off)</span>
                <span className="font-mono">-${discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex items-center justify-between text-slate-600">
              <span>Delivery (Standard)</span>
              <span className="text-emerald-600 font-bold">FREE ($0.00)</span>
            </div>

            <div className="flex items-center justify-between text-slate-600">
              <span>Estimated Taxes</span>
              <span className="font-semibold text-slate-900 font-mono">$0.00</span>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-baseline justify-between text-sm">
              <span className="font-extrabold text-slate-900 text-base">Estimated Total</span>
              <div className="text-right">
                <span className="text-2xl font-black text-slate-900 font-mono tracking-tight">
                  ${grandTotal.toFixed(2)}
                </span>
                <span className="block text-[10px] text-slate-400">
                  + optional Express ($9) on checkout
                </span>
              </div>
            </div>
          </div>

          {/* Primary High-Contrast Black CTA Button */}
          <Link
            href="/checkout"
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-slate-900 hover:bg-black active:scale-[0.99] text-white font-extrabold text-sm shadow-lg shadow-slate-900/15 transition-all text-center"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>256-Bit SSL Encryption • Exercise 2 Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
}
