import React from "react";
import Link from "next/link";
import { Database, ShieldCheck, Truck, Sparkles, Laptop, CheckCircle2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-14 pb-8 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Proposition Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 border-b border-slate-800 text-center md:text-left">
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">1-Year Official Warranty</h4>
              <p className="text-xs text-slate-400">Guaranteed authentic hardware with certified warranty coverage.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Fast & Free Shipping Available</h4>
              <p className="text-xs text-slate-400">Free standard shipping (7-20 days) or Priority Express for $9 (1-3 days).</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Relational 3NF Architecture</h4>
              <p className="text-xs text-slate-400">5 normalized database tables in SQLite with foreign key cascades.</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-10 border-b border-slate-800">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white">
                <Laptop className="w-5 h-5 text-white" />
              </div>
              <span className="font-black text-lg text-white tracking-wide">
                Webyansh Tech Store
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              Implementation of <strong>លំហាត់អនុវត្ត.pdf</strong> (Practical Exercises 1, 2, 3 & 4).
              Full shopping cart management, customer shipping form with validation, order confirmation receipt (Slide 28), and relational database schema design with ERD viewer.
            </p>
            <div className="pt-2 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-mono text-[11px] border border-slate-700">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Exercise 1, 2, 3 & 4 Verified
              </span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
              Practical Exercises
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/" className="hover:text-blue-400 transition-colors">
                  Exercise 1: Products Catalog & Cart
                </Link>
              </li>
              <li>
                <Link href="/checkout" className="hover:text-blue-400 transition-colors">
                  Exercise 2: Shipping & Checkout Form
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-blue-400 transition-colors">
                  Exercise 3: Order History & Slide 28
                </Link>
              </li>
              <li>
                <Link href="/erd" className="hover:text-blue-400 transition-colors">
                  Exercise 4: 5-Table Database ERD
                </Link>
              </li>
            </ul>
          </div>

          {/* 5 Relational Tables Dictionary */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
              Database Tables (3NF)
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400 font-mono">
              <li className="flex items-center justify-between">
                <span>• customers</span>
                <span className="text-[10px] text-slate-500">1:N</span>
              </li>
              <li className="flex items-center justify-between">
                <span>• categories</span>
                <span className="text-[10px] text-slate-500">1:N</span>
              </li>
              <li className="flex items-center justify-between">
                <span>• products</span>
                <span className="text-[10px] text-slate-500">4 Items</span>
              </li>
              <li className="flex items-center justify-between">
                <span>• orders</span>
                <span className="text-[10px] text-slate-500">ORD-0001</span>
              </li>
              <li className="flex items-center justify-between">
                <span>• order_items</span>
                <span className="text-[10px] text-slate-500">Snapshot</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Webyansh Tech Store • Practical Exercises Implementation.</p>
          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
            <span>Next.js App Router</span>
            <span>•</span>
            <span>Prisma SQLite</span>
            <span>•</span>
            <span>Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
