"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Truck,
  ArrowRight,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Package,
  CheckCircle2,
  Sparkles,
  Check,
} from "lucide-react";
import { useCart } from "@/context/cart-context";
import { CheckoutFormValues } from "@/types";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();

  // Form State
  const [formData, setFormData] = useState<CheckoutFormValues>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    shippingMethod: "free",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const shippingCost = formData.shippingMethod === "express" ? 9.0 : 0.0;
  const taxes = 0.0;
  const grandTotal = subtotal + shippingCost + taxes;

  // Validation function
  const validateField = (name: string, value: string): string | null => {
    switch (name) {
      case "firstName":
        return !value.trim() ? "First name is required" : null;
      case "lastName":
        return !value.trim() ? "Last name is required" : null;
      case "email":
        if (!value.trim()) return "Email address is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Please enter a valid email";
        return null;
      case "phone":
        return !value.trim() ? "Phone number is required" : null;
      case "address":
        return !value.trim() ? "Street address is required" : null;
      case "city":
        return !value.trim() ? "City is required" : null;
      case "state":
        return !value.trim() ? "State / Province is required" : null;
      case "zipCode":
        return !value.trim() ? "Zip code is required" : null;
      default:
        return null;
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setFormErrors((prev) => ({ ...prev, [name]: error || "" }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const error = validateField(name, value);
      setFormErrors((prev) => ({ ...prev, [name]: error || "" }));
    }
  };

  // Quick Demo Auto-Fill
  const handleAutoFillDemo = () => {
    const demoData: CheckoutFormValues = {
      firstName: "Sokha",
      lastName: "Chan",
      email: "sokha.chan@example.com",
      phone: "+855 12 345 678",
      address: "#123, St. 2004, Sangkat Teuk Thla",
      city: "Phnom Penh",
      state: "Phnom Penh",
      zipCode: "12000",
      shippingMethod: "express",
    };
    setFormData(demoData);
    setFormErrors({});
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      address: true,
      city: true,
      state: true,
      zipCode: true,
    });
  };

  const validateAll = (): boolean => {
    const errors: Record<string, string> = {};
    (Object.keys(formData) as (keyof CheckoutFormValues)[]).forEach((key) => {
      if (key !== "shippingMethod") {
        const err = validateField(key, formData[key] as string);
        if (err) errors[key] = err;
      }
    });

    if (items.length === 0) {
      errors.items = "Cart is empty";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    if (!validateAll()) return;

    setLoading(true);

    try {
      const payload = {
        customer: {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          zipCode: formData.zipCode.trim(),
        },
        shippingMethod: formData.shippingMethod,
        items: items.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
        })),
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(
          json.error || (json.details ? json.details.join(", ") : "Failed to place order")
        );
      }

      const createdOrderNumber = json.data.orderNumber;

      // Clear shopping cart
      clearCart();

      // Smoothly route to Slide 28 confirmation screen
      router.push(`/order-confirmation/${createdOrderNumber}`);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Error submitting order");
      setLoading(false);
    }
  };

  if (items.length === 0 && !loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4 font-mono">
        <div className="w-16 h-16 bg-[#0E1420] text-blue-400 border border-white/10 rounded-2xl flex items-center justify-center mx-auto shadow-chamfer">
          <Package className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-white font-sans">Dispatch Queue is Empty</h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto font-sans">
          Please add hardware components to your cart before proceeding to the checkout terminal.
        </p>
        <Link
          href="/"
          className="btn-tactile inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-glow-blue"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>[ RETURN TO CATALOG ]</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-mono">
      {/* Breadcrumb Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Link href="/cart" className="hover:text-blue-400 transition-colors">
              01. CART
            </Link>
            <span>/</span>
            <span className="text-blue-400 font-bold">02. DISPATCH DESTINATION (EXERCISE 2)</span>
            <span>/</span>
            <span className="text-slate-600">03. SLIDE 28 RECEIPT</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight font-sans">
            Checkout Terminal & Address
          </h1>
        </div>

        {/* 1-Click Auto-Fill Demo Button */}
        <button
          onClick={handleAutoFillDemo}
          type="button"
          className="btn-tactile px-4 py-2.5 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 text-xs font-bold flex items-center gap-2 shadow-sm self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span>✨ Auto-Fill Demo Student Data</span>
        </button>
      </div>

      {apiError && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center gap-3 text-xs">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{apiError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Fields & Shipping Radio Cards (Col 7) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Customer Address Card */}
            <div className="bg-[#0E1420] rounded-3xl border border-white/10 shadow-chamfer p-6 sm:p-7 space-y-5">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2.5 pb-3 border-b border-white/10">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-black">
                  1
                </span>
                <span>Customer Details & Shipping Address (Exercise 2)</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* First Name */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-300 font-bold">First Name *</label>
                    {touched.firstName && !formErrors.firstName && formData.firstName && (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                  </div>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Sokha"
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-[#080B11] border text-white focus:outline-none transition-colors ${
                      touched.firstName && formErrors.firstName
                        ? "border-rose-500 focus:border-rose-500"
                        : "border-white/10 focus:border-blue-500"
                    }`}
                  />
                  {touched.firstName && formErrors.firstName && (
                    <span className="text-[11px] text-rose-400 mt-1 block">
                      {formErrors.firstName}
                    </span>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-300 font-bold">Last Name *</label>
                    {touched.lastName && !formErrors.lastName && formData.lastName && (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                  </div>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Chan"
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-[#080B11] border text-white focus:outline-none transition-colors ${
                      touched.lastName && formErrors.lastName
                        ? "border-rose-500 focus:border-rose-500"
                        : "border-white/10 focus:border-blue-500"
                    }`}
                  />
                  {touched.lastName && formErrors.lastName && (
                    <span className="text-[11px] text-rose-400 mt-1 block">
                      {formErrors.lastName}
                    </span>
                  )}
                </div>

                {/* Email Address */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-300 font-bold">Email Address *</label>
                    {touched.email && !formErrors.email && formData.email && (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="sokha.chan@example.com"
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-[#080B11] border text-white focus:outline-none transition-colors ${
                      touched.email && formErrors.email
                        ? "border-rose-500 focus:border-rose-500"
                        : "border-white/10 focus:border-blue-500"
                    }`}
                  />
                  {touched.email && formErrors.email && (
                    <span className="text-[11px] text-rose-400 mt-1 block">
                      {formErrors.email}
                    </span>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-300 font-bold">Phone Number *</label>
                    {touched.phone && !formErrors.phone && formData.phone && (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="+855 12 345 678"
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-[#080B11] border text-white focus:outline-none transition-colors ${
                      touched.phone && formErrors.phone
                        ? "border-rose-500 focus:border-rose-500"
                        : "border-white/10 focus:border-blue-500"
                    }`}
                  />
                  {touched.phone && formErrors.phone && (
                    <span className="text-[11px] text-rose-400 mt-1 block">
                      {formErrors.phone}
                    </span>
                  )}
                </div>

                {/* Street Address */}
                <div className="sm:col-span-2">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-300 font-bold">Street Address *</label>
                    {touched.address && !formErrors.address && formData.address && (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                  </div>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="#123, St. 2004, Sangkat Teuk Thla"
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-[#080B11] border text-white focus:outline-none transition-colors ${
                      touched.address && formErrors.address
                        ? "border-rose-500 focus:border-rose-500"
                        : "border-white/10 focus:border-blue-500"
                    }`}
                  />
                  {touched.address && formErrors.address && (
                    <span className="text-[11px] text-rose-400 mt-1 block">
                      {formErrors.address}
                    </span>
                  )}
                </div>

                {/* City */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-300 font-bold">City *</label>
                    {touched.city && !formErrors.city && formData.city && (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                  </div>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Phnom Penh"
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-[#080B11] border text-white focus:outline-none transition-colors ${
                      touched.city && formErrors.city
                        ? "border-rose-500 focus:border-rose-500"
                        : "border-white/10 focus:border-blue-500"
                    }`}
                  />
                  {touched.city && formErrors.city && (
                    <span className="text-[11px] text-rose-400 mt-1 block">
                      {formErrors.city}
                    </span>
                  )}
                </div>

                {/* State & Zip */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-slate-300 font-bold">State / Prov *</label>
                      {touched.state && !formErrors.state && formData.state && (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                    </div>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      placeholder="Phnom Penh"
                      className={`w-full px-3 py-2.5 rounded-xl bg-[#080B11] border text-white focus:outline-none transition-colors ${
                        touched.state && formErrors.state
                          ? "border-rose-500 focus:border-rose-500"
                          : "border-white/10 focus:border-blue-500"
                      }`}
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-slate-300 font-bold">Zip Code *</label>
                      {touched.zipCode && !formErrors.zipCode && formData.zipCode && (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                    </div>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      placeholder="12000"
                      className={`w-full px-3 py-2.5 rounded-xl bg-[#080B11] border text-white focus:outline-none transition-colors ${
                        touched.zipCode && formErrors.zipCode
                          ? "border-rose-500 focus:border-rose-500"
                          : "border-white/10 focus:border-blue-500"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Shipping Method Selection */}
            <div className="bg-[#0E1420] rounded-3xl border border-white/10 shadow-chamfer p-6 sm:p-7 space-y-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2.5 pb-3 border-b border-white/10">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-black">
                  2
                </span>
                <span>Shipping Method (Practical Exercise 2)</span>
              </h2>

              <div className="space-y-3">
                {/* Free Shipping Radio */}
                <label
                  onClick={() => setFormData((prev) => ({ ...prev, shippingMethod: "free" }))}
                  className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    formData.shippingMethod === "free"
                      ? "bg-[#151D2C] border-blue-500 shadow-glow-blue"
                      : "bg-[#080B11] border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shippingMethod"
                      value="free"
                      checked={formData.shippingMethod === "free"}
                      onChange={() => setFormData((prev) => ({ ...prev, shippingMethod: "free" }))}
                      className="text-blue-600 focus:ring-0"
                    />
                    <div>
                      <span className="font-bold text-sm text-white block">
                        Free Standard Shipping ($0.00)
                      </span>
                      <span className="text-xs text-slate-400">
                        7 - 20 Business Days Delivery
                      </span>
                    </div>
                  </div>
                  <span className="font-black text-emerald-400 text-sm">FREE</span>
                </label>

                {/* Express Shipping Radio */}
                <label
                  onClick={() => setFormData((prev) => ({ ...prev, shippingMethod: "express" }))}
                  className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    formData.shippingMethod === "express"
                      ? "bg-[#151D2C] border-blue-500 shadow-glow-blue"
                      : "bg-[#080B11] border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shippingMethod"
                      value="express"
                      checked={formData.shippingMethod === "express"}
                      onChange={() =>
                        setFormData((prev) => ({ ...prev, shippingMethod: "express" }))
                      }
                      className="text-blue-600 focus:ring-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">
                          Priority Hyper-Courier ($9.00)
                        </span>
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-black">
                          EXPEDITED
                        </span>
                      </div>
                      <span className="text-xs text-slate-400">
                        1 - 3 Business Days with Direct Hand-off
                      </span>
                    </div>
                  </div>
                  <span className="font-black text-white text-sm">$9.00</span>
                </label>
              </div>
            </div>
          </div>

          {/* Sticky Checkout Summary & Submit (Col 5) */}
          <div className="lg:col-span-5 bg-[#0E1420] rounded-3xl border border-white/10 shadow-chamfer p-6 sm:p-7 space-y-6 sticky top-24">
            <div className="pb-3 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-base font-black text-white uppercase">Order Review</h2>
              <span className="text-xs font-bold text-blue-400">
                {items.length} {items.length === 1 ? "ITEM" : "ITEMS"}
              </span>
            </div>

            {/* Items Mini List */}
            <div className="divide-y divide-white/5 space-y-2 text-xs">
              {items.map((item) => (
                <div key={item.product.id} className="flex items-center justify-between py-2 gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-[#080B11] border border-white/10 overflow-hidden relative shrink-0">
                      {item.product.imageUrl && (
                        <Image
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="truncate">
                      <span className="text-white font-bold block truncate font-sans">
                        {item.product.name}
                      </span>
                      <span className="text-slate-500 text-[11px]">
                        QTY: {item.quantity} × ${item.product.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <span className="text-white font-bold shrink-0">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Calculation */}
            <div className="pt-4 border-t border-white/10 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>ITEMS SUBTOTAL:</span>
                <span className="text-white font-bold">${subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-slate-400">
                <span>SHIPPING METHOD:</span>
                <span
                  className={
                    formData.shippingMethod === "express"
                      ? "text-white font-bold"
                      : "text-emerald-400 font-bold"
                  }
                >
                  {formData.shippingMethod === "express" ? "$9.00 (Express)" : "FREE ($0.00)"}
                </span>
              </div>

              <div className="flex justify-between text-slate-400">
                <span>ESTIMATED TAX:</span>
                <span className="text-white font-bold">$0.00</span>
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-between items-baseline">
                <span className="text-base font-black text-white font-sans">GRAND TOTAL:</span>
                <span className="text-2xl font-black text-white">
                  ${grandTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Place Order Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-tactile w-full py-4 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-black text-sm shadow-glow-blue flex items-center justify-center gap-2 tracking-wide"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>TRANSMITTING ORDER MANIFEST...</span>
                </>
              ) : (
                <>
                  <span>PLACE ORDER NOW</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Fulfilled by Practical Exercise 2 Flow</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
