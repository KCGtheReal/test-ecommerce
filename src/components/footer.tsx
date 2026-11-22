import React from "react";
import Link from "next/link";
import { Database, ShieldCheck, Truck, Sparkles, Cpu, CheckCircle2, Terminal } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#05070B] text-slate-400 pt-14 pb-8 border-t border-white/10 mt-20 font-mono text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Value Proposition Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 border-b border-white/5">
          <div className="flex items-center gap-4 bg-[#0E1420] p-4 rounded-2xl border border-white/5 chamfer-card">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">1-YEAR HARDWARE WARRANTY</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">OEM certified component integrity and replacement guarantee.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-[#0E1420] p-4 rounded-2xl border border-white/5 chamfer-card">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">GLOBAL LOGISTICS DISPATCH</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Free standard transit ($0) or Priority Hyper-Courier ($9.00).</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-[#0E1420] p-4 rounded-2xl border border-white/5 chamfer-card">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">RELATIONAL 3NF COCKPIT</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">5 normalized tables in SQLite with complete ERD visualization.</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-white/5">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-slate-900 flex items-center justify-center text-white border border-white/20">
                <Cpu className="w-5 h-5 text-white" />
              </div>
              <span className="font-black text-lg text-white tracking-wider">
                WEBYANSH<span className="text-blue-500">.CORE</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed font-sans">
              Implementation of <strong>លំហាត់អនុវត្ត.pdf</strong> (Practical Exercises 1, 2, 3 & 4).
              Features precision shopping cart, customer shipping validation, cryptographic Slide 28 confirmation manifest, and 5-table relational SQLite schema with ERD inspector.
            </p>
            <div className="pt-2 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#151D2C] text-emerald-400 text-[11px] border border-emerald-500/30 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                EXERCISES 1–4 VALIDATED
              </span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
              MODULE NAVIGATION
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/" className="hover:text-blue-400 transition-colors">
                  &gt; 01. Catalog (4 Hardware Items)
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-blue-400 transition-colors">
                  &gt; 02. Shopping Cart &amp; Steppers
                </Link>
              </li>
              <li>
                <Link href="/checkout" className="hover:text-blue-400 transition-colors">
                  &gt; 03. Customer Dispatch Terminal
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-blue-400 transition-colors">
                  &gt; 04. Slide 28 Order Manifests
                </Link>
              </li>
              <li>
                <Link href="/erd" className="hover:text-blue-400 transition-colors">
                  &gt; 05. Database ERD Cockpit
                </Link>
              </li>
            </ul>
          </div>

          {/* 5 Relational Tables Dictionary */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
              DATABASE SCHEMA (3NF)
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400 font-mono">
              <li className="flex items-center justify-between">
                <span>[TBL] customers</span>
                <span className="text-[10px] text-blue-400 font-bold">1:N</span>
              </li>
              <li className="flex items-center justify-between">
                <span>[TBL] categories</span>
                <span className="text-[10px] text-blue-400 font-bold">1:N</span>
              </li>
              <li className="flex items-center justify-between">
                <span>[TBL] products</span>
                <span className="text-[10px] text-emerald-400 font-bold">4 ITEMS</span>
              </li>
              <li className="flex items-center justify-between">
                <span>[TBL] orders</span>
                <span className="text-[10px] text-amber-400 font-bold">ORD-0001</span>
              </li>
              <li className="flex items-center justify-between">
                <span>[TBL] order_items</span>
                <span className="text-[10px] text-purple-400 font-bold">SNAPSHOT</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} WEBYANSH TECH • PRACTICAL EXERCISES SUITE.</p>
          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
            <span>NEXT.JS APP ROUTER</span>
            <span>//</span>
            <span>PRISMA SQLITE</span>
            <span>//</span>
            <span>CYBER-TACTILE DESIGN SYSTEM</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
