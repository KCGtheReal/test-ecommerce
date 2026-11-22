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
  Zap,
  Check,
} from "lucide-react";
import { useCart } from "@/context/cart-context";
import { ShippingOption, CheckoutFormValues } from "@/types";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart, itemCount } = useCart();

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

  // Quick Demo Auto-Fill (Task F-4 specification for easy evaluation)
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
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">Your cart is empty</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Please add products to your cart before proceeding to checkout.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 text-white font-bold text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse Products</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb Header matching Page 3 of PDF */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-1">
            <Link href="/cart" className="hover:text-blue-600 transition-colors">
              Cart
            </Link>
            <span>/</span>
            <span className="text-blue-600">Customer & Shipping Address (Exercise 2)</span>
            <span>/</span>
            <span className="text-slate-400">Confirmation (Slide 28)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Checkout & Delivery Address
          </h1>
        </div>

        {/* 1-Click Auto-Fill Demo Button */}
        <button
          onClick={handleAutoFillDemo}
          type="button"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs border border-blue-200 transition-colors shadow-2xs self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>✨ Auto-Fill Demo Student Data</span>
        </button>
      </div>

      {apiError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-red-800 text-xs sm:text-sm animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">Order Error</span>
            <span className="text-xs text-red-700">{apiError}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Customer Form & Shipping Cards (Col 7) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: Customer Contact & Shipping Details Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-7 space-y-5">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center font-black">
                1
              </span>
              <span>Customer Shipping Address</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* First Name */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Sokha"
                    className={`w-full px-3.5 py-2.5 rounded-xl border ${
                      formErrors.firstName
                        ? "border-rose-400 bg-rose-50/20"
                        : touched.firstName
                        ? "border-emerald-500 bg-emerald-50/10"
                        : "border-slate-200"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-slate-900`}
                  />
                  {touched.firstName && !formErrors.firstName && (
                    <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
                  )}
                </div>
                {formErrors.firstName && (
                  <p className="text-[11px] text-rose-500 font-semibold mt-1">{formErrors.firstName}</p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Chan"
                    className={`w-full px-3.5 py-2.5 rounded-xl border ${
                      formErrors.lastName
                        ? "border-rose-400 bg-rose-50/20"
                        : touched.lastName
                        ? "border-emerald-500 bg-emerald-50/10"
                        : "border-slate-200"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-slate-900`}
                  />
                  {touched.lastName && !formErrors.lastName && (
                    <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
                  )}
                </div>
                {formErrors.lastName && (
                  <p className="text-[11px] text-rose-500 font-semibold mt-1">{formErrors.lastName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="sokha.chan@example.com"
                    className={`w-full px-3.5 py-2.5 rounded-xl border ${
                      formErrors.email
                        ? "border-rose-400 bg-rose-50/20"
                        : touched.email
                        ? "border-emerald-500 bg-emerald-50/10"
                        : "border-slate-200"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-slate-900`}
                  />
                  {touched.email && !formErrors.email && (
                    <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
                  )}
                </div>
                {formErrors.email && (
                  <p className="text-[11px] text-rose-500 font-semibold mt-1">{formErrors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="+855 12 345 678"
                    className={`w-full px-3.5 py-2.5 rounded-xl border ${
                      formErrors.phone
                        ? "border-rose-400 bg-rose-50/20"
                        : touched.phone
                        ? "border-emerald-500 bg-emerald-50/10"
                        : "border-slate-200"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-slate-900`}
                  />
                  {touched.phone && !formErrors.phone && (
                    <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
                  )}
                </div>
                {formErrors.phone && (
                  <p className="text-[11px] text-rose-500 font-semibold mt-1">{formErrors.phone}</p>
                )}
              </div>

              {/* Address */}
              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">
                  Street Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="#123, St. 2004, Sangkat Teuk Thla"
                    className={`w-full px-3.5 py-2.5 rounded-xl border ${
                      formErrors.address
                        ? "border-rose-400 bg-rose-50/20"
                        : touched.address
                        ? "border-emerald-500 bg-emerald-50/10"
                        : "border-slate-200"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-slate-900`}
                  />
                  {touched.address && !formErrors.address && (
                    <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
                  )}
                </div>
                {formErrors.address && (
                  <p className="text-[11px] text-rose-500 font-semibold mt-1">{formErrors.address}</p>
                )}
              </div>

              {/* City */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Phnom Penh"
                    className={`w-full px-3.5 py-2.5 rounded-xl border ${
                      formErrors.city
                        ? "border-rose-400 bg-rose-50/20"
                        : touched.city
                        ? "border-emerald-500 bg-emerald-50/10"
                        : "border-slate-200"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-slate-900`}
                  />
                  {touched.city && !formErrors.city && (
                    <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
                  )}
                </div>
                {formErrors.city && (
                  <p className="text-[11px] text-rose-500 font-semibold mt-1">{formErrors.city}</p>
                )}
              </div>

              {/* State & Zip Code */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    State / Prov <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Phnom Penh"
                    className={`w-full px-3 py-2.5 rounded-xl border ${
                      formErrors.state
                        ? "border-rose-400 bg-rose-50/20"
                        : touched.state
                        ? "border-emerald-500 bg-emerald-50/10"
                        : "border-slate-200"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-slate-900`}
                  />
                  {formErrors.state && (
                    <p className="text-[11px] text-rose-500 font-semibold mt-1">{formErrors.state}</p>
                  )}
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Zip Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="12000"
                    className={`w-full px-3 py-2.5 rounded-xl border ${
                      formErrors.zipCode
                        ? "border-rose-400 bg-rose-50/20"
                        : touched.zipCode
                        ? "border-emerald-500 bg-emerald-50/10"
                        : "border-slate-200"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-slate-900`}
                  />
                  {formErrors.zipCode && (
                    <p className="text-[11px] text-rose-500 font-semibold mt-1">{formErrors.zipCode}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Shipping Method Radio Cards (Exercise 2) */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-7 space-y-4">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center font-black">
                2
              </span>
              <span>Shipping Method Selection</span>
            </h2>

            <div className="space-y-3">
              {/* Free Shipping Option Card */}
              <label
                className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                  formData.shippingMethod === "free"
                    ? "border-slate-900 bg-slate-50/80 shadow-xs"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shippingMethod"
                    value="free"
                    checked={formData.shippingMethod === "free"}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, shippingMethod: "free" }))
                    }
                    className="w-4 h-4 text-slate-900 focus:ring-slate-900"
                  />
                  <div>
                    <span className="font-extrabold text-sm text-slate-900 block">
                      Free Shipping ($0.00)
                    </span>
                    <span className="text-xs text-slate-500">
                      Standard delivery (7 - 20 Business Days)
                    </span>
                  </div>
                </div>
                <span className="font-black text-sm text-emerald-600 font-mono">FREE</span>
              </label>

              {/* Express Shipping Option Card */}
              <label
                className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                  formData.shippingMethod === "express"
                    ? "border-slate-900 bg-slate-50/80 shadow-xs"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shippingMethod"
                    value="express"
                    checked={formData.shippingMethod === "express"}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, shippingMethod: "express" }))
                    }
                    className="w-4 h-4 text-slate-900 focus:ring-slate-900"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-900">
                        Express Shipping ($9.00)
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-amber-100 text-amber-800">
                        Fastest Delivery
                      </span>
                    </div>
                    <span className="text-xs text-slate-500">
                      Priority express courier (1 - 3 Business Days)
                    </span>
                  </div>
                </div>
                <span className="font-black text-sm text-slate-900 font-mono">$9.00</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Order Summary & Submit (Col 5) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-7 space-y-6 sticky top-24">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900">Order Summary</h2>
            <span className="text-xs font-bold text-slate-500">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </span>
          </div>

          {/* Mini Items Thumbnail List */}
          <div className="divide-y divide-slate-100 max-h-56 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.product.id} className="py-2.5 flex items-center gap-3 text-xs">
                <div className="relative w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200/60 shadow-2xs">
                  {item.product.imageUrl ? (
                    <Image
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <Package className="w-5 h-5" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900 truncate">{item.product.name}</h4>
                  <p className="text-slate-400 text-[11px]">
                    Qty: {item.quantity} × ${item.product.price.toFixed(2)}
                  </p>
                </div>
                <div className="text-right font-black text-slate-900 font-mono">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          {/* Price Summary Breakdown */}
          <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span>Items Subtotal</span>
              <span className="font-bold text-slate-900 font-mono">${subtotal.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between text-slate-600">
              <span>Shipping Method</span>
              <span className="font-bold text-slate-900">
                {shippingCost === 0 ? "FREE ($0.00)" : "$9.00 (Express)"}
              </span>
            </div>

            <div className="flex items-center justify-between text-slate-600">
              <span>Estimated Sales Tax</span>
              <span className="font-semibold text-slate-900 font-mono">$0.00</span>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-baseline justify-between text-sm">
              <span className="font-extrabold text-slate-900 text-base">Grand Total</span>
              <span className="text-2xl font-black text-slate-900 font-mono">
                ${grandTotal.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Place Order CTA Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-slate-900 hover:bg-black active:scale-[0.99] text-white font-black text-sm shadow-xl shadow-slate-900/20 transition-all disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                <span>Processing Order in Database...</span>
              </>
            ) : (
              <>
                <span>Place Order</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Fulfills Practical Exercise 2 Specifications</span>
          </div>
        </div>
      </form>
    </div>
  );
}
