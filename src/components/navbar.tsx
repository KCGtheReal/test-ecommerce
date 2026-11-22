"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShoppingBag,
  Database,
  Package,
  Receipt,
  Menu,
  X,
  Laptop,
  Sparkles,
  Check,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { useCart } from "@/context/cart-context";

export default function Navbar() {
  const pathname = usePathname();
  const { itemCount, subtotal, toastMessage, clearToast } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Products Catalog", icon: Package },
    { href: "/cart", label: "Shopping Cart", icon: ShoppingBag, badge: itemCount },
    { href: "/orders", label: "Order History", icon: Receipt },
    { href: "/erd", label: "Database ERD (Ex 4)", icon: Database },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/85 backdrop-blur-md border-b border-slate-200/80 transition-all duration-200 shadow-xs">
        {/* Top Announcement Bar */}
        <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 font-medium border-b border-slate-800">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Left: Bilingual Exercise Notice */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold text-[10px] uppercase tracking-wider border border-blue-500/30">
                <Sparkles className="w-3 h-3 text-blue-400" />
                លំហាត់អនុវត្តទី១-៤
              </span>
              <span className="hidden md:inline text-slate-300 text-xs">
                Webyansh E-Commerce & Relational Database System (Exercises 1, 2, 3 & 4)
              </span>
            </div>

            {/* Right: Currency & Free Shipping Notice */}
            <div className="flex items-center gap-4 text-[11px] text-slate-400">
              <span className="flex items-center gap-1 text-slate-300">
                <Truck className="w-3 h-3 text-emerald-400" />
                <span>Free Standard Delivery ($0)</span>
              </span>
              <span className="hidden sm:inline text-slate-500">•</span>
              <span className="hidden sm:inline font-mono text-slate-300 font-bold">
                USD ($) Pricing
              </span>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-900 via-blue-900 to-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/15 group-hover:scale-105 transition-transform duration-200">
                <Laptop className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-lg text-slate-900 tracking-tight leading-none group-hover:text-blue-600 transition-colors">
                  Webyansh Tech
                </span>
                <span className="text-[11px] text-slate-500 font-medium tracking-wide">
                  Computer Store & Peripherals
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                      isActive
                        ? "bg-slate-900 text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? "text-blue-400" : "text-slate-400"}`} />
                    <span>{link.label}</span>
                    {link.badge !== undefined && link.badge > 0 && (
                      <span
                        className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                          isActive
                            ? "bg-blue-600 text-white"
                            : "bg-slate-200 text-slate-800"
                        }`}
                      >
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action: Cart Pill Button */}
            <div className="flex items-center gap-3">
              <Link
                href="/cart"
                className="group relative flex items-center gap-2.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition-all shadow-sm active:scale-95"
              >
                <div className="relative">
                  <ShoppingBag className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2.5 bg-blue-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-bounce shadow-xs">
                      {itemCount}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline">Cart</span>
                <span className="font-mono text-slate-300 font-semibold border-l border-slate-700 pl-2">
                  ${subtotal.toFixed(2)}
                </span>
              </Link>

              {/* Mobile menu trigger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                type="button"
                className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                aria-label="Toggle navigation"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-md px-4 pt-2 pb-5 space-y-1 animate-in slide-in-from-top-2 duration-150">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                    isActive
                      ? "bg-slate-900 text-white"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? "text-blue-400" : "text-slate-400"}`} />
                    <span>{link.label}</span>
                  </div>
                  {link.badge !== undefined && link.badge > 0 && (
                    <span className="bg-blue-600 text-white text-xs font-black px-2 py-0.5 rounded-full">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Floating Add-to-Cart Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700/80 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200 max-w-sm">
          <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Check className="w-4 h-4 stroke-[3]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold truncate">{toastMessage}</p>
            <p className="text-[10px] text-slate-400">Item is ready in your shopping cart</p>
          </div>
          <Link
            href="/cart"
            className="text-[11px] font-bold text-blue-400 hover:text-blue-300 underline shrink-0"
          >
            View Cart
          </Link>
          <button
            onClick={clearToast}
            type="button"
            className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </>
  );
}
