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
  Cpu,
  Sparkles,
  Check,
  Truck,
  Layers,
} from "lucide-react";
import { useCart } from "@/context/cart-context";

export default function Navbar() {
  const pathname = usePathname();
  const { itemCount, subtotal, toastMessage, clearToast } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "01. CATALOG", icon: Package },
    { href: "/cart", label: "02. CART", icon: ShoppingBag, badge: itemCount },
    { href: "/orders", label: "03. ORDERS", icon: Receipt },
    { href: "/erd", label: "04. ERD COCKPIT", icon: Database },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-[#080B11]/90 backdrop-blur-xl border-b border-white/10 shadow-2xl">
        {/* Telemetry Sub-strip */}
        <div className="bg-[#05070B] border-b border-white/5 py-1 px-4 text-[11px] font-mono text-slate-400">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-slate-300 font-bold uppercase tracking-wider text-[10px]">
                SYSTEM ONLINE // EXERCISE 1–4 SUITE (លំហាត់អនុវត្ត)
              </span>
            </div>
            <div className="flex items-center gap-4 text-[10px]">
              <span>
                CURRENCY: <strong className="text-emerald-400">USD ($)</strong>
              </span>
              <span className="hidden sm:inline text-white/20">|</span>
              <span className="hidden sm:inline">
                DISPATCH: <strong className="text-blue-400">STANDARD & EXPRESS ($9)</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Main Navigation Deck */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-900 flex items-center justify-center text-white border border-white/20 shadow-glow-blue group-hover:scale-105 transition-transform duration-200">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-black text-lg text-white tracking-wider flex items-center gap-1 font-mono">
                WEBYANSH<span className="text-blue-500">.CORE</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono tracking-widest block uppercase">
                Precision Hardware Store
              </span>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold tracking-wide transition-all btn-tactile ${
                    isActive
                      ? "bg-[#151D2C] text-blue-400 border border-blue-500/40 shadow-inner"
                      : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                  {link.badge !== undefined && link.badge > 0 && (
                    <span className="bg-blue-600 text-white font-mono text-[10px] font-black px-1.5 py-0.2 rounded-full">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action: Cart Deck Pill */}
          <div className="flex items-center gap-3">
            <Link
              href="/cart"
              className="flex items-center gap-3 px-4 py-2 rounded-xl bg-[#151D2C] hover:bg-[#1E293B] border border-white/10 hover:border-blue-500/40 text-white transition-all shadow-md active:translate-y-0.5 btn-tactile"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 text-blue-400" />
                {itemCount > 0 && (
                  <span className="absolute -top-2.5 -right-2.5 bg-blue-600 text-white font-mono text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-bounce shadow-glow-blue">
                    {itemCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-mono font-bold text-slate-200">
                ${subtotal.toFixed(2)}
              </span>
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 border border-white/10 transition-colors"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-[#0E1420]/95 backdrop-blur-xl px-4 pt-3 pb-5 space-y-1 animate-in slide-in-from-top-2 duration-150">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold transition-colors ${
                    isActive
                      ? "bg-[#151D2C] text-blue-400 border border-blue-500/30"
                      : "text-slate-300 hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-slate-400" />
                    <span>{link.label}</span>
                  </div>
                  {link.badge !== undefined && link.badge > 0 && (
                    <span className="bg-blue-600 text-white font-mono text-[10px] font-black px-2 py-0.5 rounded-full">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Floating Add-to-Cart Toast HUD */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0E1420] text-white px-4 py-3 rounded-2xl shadow-chamfer border border-blue-500/40 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200 max-w-sm backdrop-blur-xl">
          <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
            <Check className="w-4 h-4 stroke-[3]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-mono font-bold truncate text-slate-100">{toastMessage}</p>
            <p className="text-[10px] font-mono text-slate-400">TELEMETRY: UNIT LOADED INTO CART</p>
          </div>
          <Link
            href="/cart"
            className="text-[11px] font-mono font-bold text-blue-400 hover:text-blue-300 underline shrink-0"
          >
            [ VIEW CART ]
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
