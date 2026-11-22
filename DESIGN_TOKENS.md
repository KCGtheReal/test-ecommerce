# 🎛️ DESIGN_TOKENS.md
## Aesthetic Archetype: Cyber-Tactile Industrial Luxe (2026 Edition)
### Teenage Engineering Hardware Precision × Linear SaaS Minimalism

---

## 1. Design Manifesto & Visual Identity

The **Cyber-Tactile Industrial Luxe** archetype treats digital software as precision-engineered physical instrumentation. Inspired by Teenage Engineering synthesizers, Dieter Rams industrial design, Braun audio equipment, and high-frequency trading terminals:

1. **Physicality in Flat Space**: Buttons feature tangible mechanical depression (`active:translate-y-0.5 active:shadow-inner`), tactile knurling, chamfered borders, and springy return kinematics.
2. **Technical Telemetry**: Monospaced typography (`font-mono`) is utilized for all scalar data: prices (`$650.00`), order numbers (`ORD-0001`), stock counters (`[50 UNITS IN STOCK]`), and hardware specifications (`16GB RAM // 512GB SSD`).
3. **Atmospheric Dark Void**: Rich layered dark surfaces (`#080B11` Deep Void, `#0E1420` Obsidian Card, `#151D2C` Surface Elev) replace flat generic grays.
4. **Precision Hairline Borders**: Subtle 1px borders (`rgba(255, 255, 255, 0.08)`) and inner highlight chamfers (`box-shadow: inset 0 1px 0 0 rgba(255,255,255,0.1)`) create tangible depth without heavy drop shadows.
5. **High-Contrast Functional Accents**:
   - **Hyper-Cobalt (`#3B82F6`)**: Primary focus, interactive controls, active tabs.
   - **Cyber Emerald (`#10B981`)**: Live stock heartbeat, successful verification, order success.
   - **Amber Alert (`#F59E0B`)**: Pending status badges, warning thresholds, express shipping tags.
   - **Crimson Error (`#EF4444`)**: Form validation errors, stock depletion alerts.

---

## 2. Core Color Palette Tokens

### 2.1 Color Matrix

| Token Name | Hex Code | Tailwind Class | Role & Application |
| :--- | :--- | :--- | :--- |
| **Deep Void** | `#080B11` | `bg-[#080B11]` | Master canvas root background, body backdrop |
| **Obsidian Card** | `#0E1420` | `bg-[#0E1420]` | Primary card container surface, modals, sidebars |
| **Surface Elev** | `#151D2C` | `bg-[#151D2C]` | Elevated surfaces, hover states, input backgrounds |
| **Slate Secondary** | `#1E293B` | `bg-slate-800` | Borders, subtle dividers, pill containers |
| **Hyper-Cobalt** | `#3B82F6` | `text-blue-500` / `bg-blue-600` | Primary action buttons, active navigation, hyperlinks |
| **Cyber Emerald** | `#10B981` | `text-emerald-400` / `bg-emerald-500` | Pulse indicator, in-stock badge, free shipping unlocked |
| **Amber Alert** | `#F59E0B` | `text-amber-400` / `bg-amber-500` | Slide 28 "Pending" badge, Express delivery indicator |
| **Crimson Error** | `#EF4444` | `text-rose-400` / `bg-rose-500` | Validation errors, delete / remove item buttons |
| **Crisp Text** | `#F8FAFC` | `text-slate-50` | Primary titles, hero headlines, product names |
| **Subdued Text** | `#94A3B8` | `text-slate-400` | Body copy, descriptions, table cell secondary info |
| **Muted Text** | `#64748B` | `text-slate-500` | Footnotes, breadcrumbs, telemetry timestamps |
| **Hairline Border** | `rgba(255,255,255,0.08)` | `border-white/10` | 1px precision structural borders |

### 2.2 Extended CSS Variables (`globals.css`)

```css
:root {
  --background: #080b11;
  --surface-card: #0e1420;
  --surface-elevated: #151d2c;
  --surface-border: rgba(255, 255, 255, 0.08);
  --surface-border-hover: rgba(59, 130, 246, 0.4);

  --color-primary: #3b82f6;
  --color-primary-glow: rgba(59, 130, 246, 0.25);
  --color-success: #10b981;
  --color-success-glow: rgba(16, 185, 129, 0.25);
  --color-warning: #f59e0b;
  --color-danger: #ef4444;

  --text-crisp: #f8fafc;
  --text-subdued: #94a3b8;
  --text-muted: #64748b;

  --font-sans: 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'JetBrains Mono', 'SF Mono', Menlo, Consolas, monospace;
}
```

---

## 3. Surface Treatments & Textures

### 3.1 Dot-Matrix Grid Overlay (`bg-dot-grid`)
Creates an engineered drafting mat texture underneath cards and section hero areas:

```css
/* Background dot grid pattern */
.bg-dot-grid {
  background-image: radial-gradient(rgba(255, 255, 255, 0.07) 1px, transparent 1px);
  background-size: 24px 24px;
}

/* Metallic chamfered inner highlight */
.chamfer-card {
  background: #0e1420;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.1),
              0 10px 30px -10px rgba(0, 0, 0, 0.6);
}

.chamfer-card:hover {
  border-color: rgba(59, 130, 246, 0.35);
  box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.15),
              0 14px 40px -10px rgba(59, 130, 246, 0.15);
}
```

### 3.2 Tactile Mechanical Depression
Buttons must feel physically depressed upon mouse/touch down:

```css
.btn-tactile {
  transition: all 120ms cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 2px 0 0 rgba(0, 0, 0, 0.4), inset 0 1px 0 0 rgba(255, 255, 255, 0.15);
}

.btn-tactile:active {
  transform: translateY(1.5px);
  box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.4), inset 0 1px 2px 0 rgba(0, 0, 0, 0.5);
}
```

---

## 4. Typography Hierarchy & Pairs

| Scale | Tailwind Class | Font Family | Tracking & Weight | Role |
| :--- | :--- | :--- | :--- | :--- |
| **Hero Display** | `text-4xl sm:text-6xl` | Sans | `font-black tracking-tight` | Landing page hero statements |
| **Section Header** | `text-2xl sm:text-3xl` | Sans | `font-extrabold tracking-tight` | Page titles (Cart, Checkout, ERD) |
| **Product Title** | `text-lg sm:text-xl` | Sans | `font-bold tracking-tight` | Hardware item names |
| **Telemetry Metric** | `text-2xl sm:text-3xl` | Mono | `font-black tracking-tighter` | Prices, line totals, grand totals |
| **Technical Label** | `text-xs uppercase` | Mono | `font-bold tracking-widest` | Badges, order ID (`ORD-0001`), field tags |
| **Body Reading** | `text-sm leading-relaxed` | Sans | `font-medium text-slate-400` | Explanations, descriptions, instructions |
| **Micro Specs** | `text-[11px]` | Mono | `font-semibold text-slate-400` | Specs `[16GB // 512GB]`, stock units |

---

## 5. Tailwind Configuration Extension (`tailwind.config.ts`)

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        void: {
          DEFAULT: "#080B11",
          elevated: "#0E1420",
          surface: "#151D2C",
          stroke: "#1E293B",
        },
        cyber: {
          blue: "#3B82F6",
          emerald: "#10B981",
          amber: "#F59E0B",
          rose: "#EF4444",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      boxShadow: {
        "chamfer": "inset 0 1px 0 0 rgba(255, 255, 255, 0.1), 0 10px 30px -10px rgba(0, 0, 0, 0.6)",
        "chamfer-hover": "inset 0 1px 0 0 rgba(255, 255, 255, 0.15), 0 14px 40px -10px rgba(59, 130, 246, 0.2)",
        "glow-blue": "0 0 20px -3px rgba(59, 130, 246, 0.4)",
        "glow-emerald": "0 0 20px -3px rgba(16, 185, 129, 0.4)",
      },
      animation: {
        "pulse-fast": "pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spring-bounce": "bounce 0.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## 6. Component Specs & Production Tailwind Templates

### 6.1 Aerospace Floating Navigation Deck (`navbar.tsx`)
- **Visuals**: Frosted obsidian bar (`backdrop-blur-xl bg-[#080B11]/85 border-b border-white/10`).
- **Telemetry**: Live USD pricing indicator, Exercise 1-4 telemetry chip, and live cart count pill.
- **Cart Pill**: Shows animated pulse badge on cart update and instant price preview (`$675.00`).

```tsx
<header className="sticky top-0 z-50 w-full bg-[#080B11]/85 backdrop-blur-xl border-b border-white/10 shadow-2xl">
  {/* Telemetry Sub-strip */}
  <div className="bg-[#05070B] border-b border-white/5 py-1 px-4 text-[11px] font-mono text-slate-400">
    <div className="max-w-7xl mx-auto flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-slate-300 font-bold uppercase tracking-wider">
          SYSTEM ONLINE // EXERCISE 1–4 FULL SUITE
        </span>
      </div>
      <div className="flex items-center gap-4">
        <span>CURRENCY: <strong className="text-emerald-400">USD ($)</strong></span>
        <span className="hidden sm:inline text-white/20">|</span>
        <span className="hidden sm:inline">DISPATCH: <strong className="text-blue-400">GLOBAL EXPRESS</strong></span>
      </div>
    </div>
  </div>

  {/* Main Navigation Deck */}
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
    {/* Brand Logo */}
    <Link href="/" className="flex items-center gap-3 group">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-900 flex items-center justify-center text-white border border-white/20 shadow-glow-blue group-hover:scale-105 transition-transform">
        <Cpu className="w-5 h-5 text-white" />
      </div>
      <div>
        <span className="font-black text-lg text-white tracking-wider flex items-center gap-1.5 font-mono">
          WEBYANSH<span className="text-blue-500">.CORE</span>
        </span>
        <span className="text-[10px] text-slate-400 font-mono tracking-widest block uppercase">
          Precision Hardware Store
        </span>
      </div>
    </Link>

    {/* Center Navigation Links */}
    <nav className="hidden md:flex items-center gap-2">
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold tracking-wide transition-all ${
            isActive
              ? "bg-[#151D2C] text-blue-400 border border-blue-500/30 shadow-inner"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Icon className="w-3.5 h-3.5" />
          <span>{link.label}</span>
        </Link>
      ))}
    </nav>

    {/* Right Cart Deck Pill */}
    <Link
      href="/cart"
      className="flex items-center gap-3 px-4 py-2 rounded-xl bg-[#151D2C] hover:bg-[#1E293B] border border-white/10 hover:border-blue-500/40 text-white transition-all shadow-md active:translate-y-0.5"
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
  </div>
</header>
```

---

### 6.2 Hardware Catalog Bento Card (`product-card.tsx`)
- **Product Display**: 4 products from `លំហាត់អនុវត្ត.pdf` (Laptop `$650`, Mouse `$15`, Keyboard `$25`, Monitor `$120`).
- **Telemetry HUD**: Live glowing green pulse dot (`50 UNITS IN STOCK`), technical specs chip (`16GB RAM // 512GB SSD`), 4.9★ rating.
- **Button State**: Mechanical tactile button with click depression, morphing into `[✓ LOADED]` upon click with 1.5s timeout.

```tsx
<div className="group relative bg-[#0E1420] rounded-3xl border border-white/10 hover:border-blue-500/50 shadow-chamfer hover:shadow-chamfer-hover transition-all duration-300 flex flex-col overflow-hidden">
  {/* Hardware Viewport */}
  <div className="relative aspect-4/3 w-full bg-[#080B11] overflow-hidden border-b border-white/5">
    <Image
      src={product.imageUrl}
      alt={product.name}
      fill
      className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
    />

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
    <div className="absolute inset-0 bg-[#080B11]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-xs">
      <button
        onClick={() => onQuickView(product)}
        className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold border border-white/30 backdrop-blur-md transition-all active:translate-y-0.5"
      >
        [ VIEW TELEMETRY ]
      </button>
    </div>
  </div>

  {/* Card Data Body */}
  <div className="p-5 flex flex-col flex-1 justify-between gap-4">
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-amber-400 text-xs font-mono font-bold">
          <Star className="w-3.5 h-3.5 fill-amber-400" />
          <span>4.9</span>
          <span className="text-slate-500">(120+ verified)</span>
        </div>
        <span className="text-[10px] font-mono text-slate-500">EX-1 COMPLIANT</span>
      </div>

      <h3 className="font-black text-xl text-white tracking-tight group-hover:text-blue-400 transition-colors">
        {product.name}
      </h3>

      {/* Monospaced Technical Specs Readout */}
      <div className="bg-[#080B11] p-2 rounded-xl border border-white/5 font-mono text-[11px] text-slate-300">
        <code>{specsText}</code>
      </div>
    </div>

    {/* Bottom Price & Tactile Button */}
    <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
      <div>
        <span className="text-[10px] font-mono text-slate-500 uppercase block tracking-wider">UNIT PRICE</span>
        <span className="text-2xl font-black font-mono text-white tracking-tight">
          ${product.price.toFixed(2)}
        </span>
      </div>

      <button
        onClick={handleAddToCart}
        className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all shadow-md active:translate-y-0.5 ${
          isAdded
            ? "bg-emerald-500 text-slate-950 font-black shadow-glow-emerald"
            : "bg-blue-600 hover:bg-blue-500 text-white shadow-glow-blue"
        }`}
      >
        {isAdded ? "[ ✓ LOADED ]" : "[ + ADD TO CART ]"}
      </button>
    </div>
  </div>
</div>
```

---

### 6.3 Industrial Cart Matrix (`/cart`)
- **Free Shipping Progress Meter**: Visual bar indicating `$50.00` unlock threshold with live calculation.
- **Mechanical Stepper**: Circular depress controls `[-] [ QTY ] [+]`, live reactive line total calculation in gold/white mono.
- **Order Summary Manifest Card**: Sticky industrial manifest with promo code field (`TECH10`), Subtotal, Free Shipping indicator, and Grand Total.

```tsx
{/* Free Shipping Unlock Meter */}
<div className="bg-[#0E1420] rounded-2xl border border-white/10 p-4 sm:p-5 shadow-chamfer space-y-2">
  <div className="flex items-center justify-between text-xs font-mono">
    <div className="flex items-center gap-2 text-slate-300">
      <Truck className="w-4 h-4 text-blue-400" />
      {subtotal >= 50 ? (
        <span className="text-emerald-400 font-bold">
          [ ✓ FREE EXPRESS DISPATCH UNLOCKED ]
        </span>
      ) : (
        <span>
          ADD <strong className="text-white font-bold">${(50 - subtotal).toFixed(2)}</strong> MORE TO UNLOCK FREE SHIPPING
        </span>
      )}
    </div>
    <span className="font-black text-blue-400">{Math.min(100, Math.round((subtotal / 50) * 100))}%</span>
  </div>
  <div className="w-full bg-[#080B11] h-2.5 rounded-full overflow-hidden border border-white/5">
    <div
      className="h-full bg-gradient-to-r from-blue-600 to-emerald-400 transition-all duration-500 rounded-full"
      style={{ width: `${Math.min(100, (subtotal / 50) * 100)}%` }}
    />
  </div>
</div>
```

---

### 6.4 Terminal Checkout Form (`/checkout`)
- **Telemetry Breadcrumbs**: `01. CART > 02. DISPATCH DESTINATION > 03. MANIFEST`.
- **✨ 1-Click Auto-Fill Demo**: Pre-fills student demo record (`Sokha Chan`, `Phnom Penh`, `12000`) for instant evaluation.
- **8 Required Customer Inputs**: Real-time validation cues (emerald verification checkmark when valid, crimson warning when invalid).
- **Shipping Radio Cards**: Free Standard ($0.00) vs Priority Express ($9.00) with reactive total recalculation.

```tsx
{/* Shipping Radio Cards */}
<div className="space-y-3 font-mono">
  <label
    className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
      shippingMethod === "free"
        ? "bg-[#151D2C] border-blue-500 shadow-glow-blue"
        : "bg-[#0E1420] border-white/10 hover:border-white/20"
    }`}
  >
    <div className="flex items-center gap-3">
      <input
        type="radio"
        name="shippingMethod"
        value="free"
        checked={shippingMethod === "free"}
        onChange={() => setShippingMethod("free")}
        className="text-blue-600 focus:ring-0"
      />
      <div>
        <span className="font-bold text-sm text-white block">FREE STANDARD SHIPPING ($0.00)</span>
        <span className="text-xs text-slate-400">7 - 20 Business Days Delivery</span>
      </div>
    </div>
    <span className="font-black text-emerald-400 text-sm">$0.00</span>
  </label>

  <label
    className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
      shippingMethod === "express"
        ? "bg-[#151D2C] border-blue-500 shadow-glow-blue"
        : "bg-[#0E1420] border-white/10 hover:border-white/20"
    }`}
  >
    <div className="flex items-center gap-3">
      <input
        type="radio"
        name="shippingMethod"
        value="express"
        checked={shippingMethod === "express"}
        onChange={() => setShippingMethod("express")}
        className="text-blue-600 focus:ring-0"
      />
      <div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm text-white">PRIORITY HYPER-COURIER ($9.00)</span>
          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-black">
            EXPEDITED
          </span>
        </div>
        <span className="text-xs text-slate-400">1 - 3 Business Days with Direct Hand-off</span>
      </div>
    </div>
    <span className="font-black text-white text-sm">$9.00</span>
  </label>
</div>
```

---

### 6.5 Slide 28 Cryptographic Dispatch Manifest (`/order-confirmation/[orderNumber]`)
- **Headline**: Exact Slide 28 wording: `"Order Placed Successfully!"`.
- **Celebration**: Canvas confetti particle burst upon page load.
- **Status Stepper**: `[ORDER RECORDED: PENDING] -> [PROCESSING] -> [DISPATCHED] -> [DELIVERED]` with amber glow on `Pending`.
- **4 Key Slide 28 Fields**:
  1. **Order ID**: `ORD-0001` with 1-click clipboard copy.
  2. **Customer Name**: First & Last Name, contact email, and address.
  3. **Order Date**: Full timestamp formatting.
  4. **Ordered Products Table**: Product name, price snapshot, quantity, and line total.
- **Total Amount**: Grand total prominently formatted in large monospaced typeface.
- **Print Stylesheet**: Clean, crisp print view with `@media print`.

```tsx
{/* Status Stepper on Slide 28 */}
<div className="bg-[#0E1420] rounded-2xl border border-white/10 p-5 shadow-chamfer print:hidden">
  <div className="flex items-center justify-between max-w-2xl mx-auto font-mono text-xs">
    <div className="flex flex-col items-center gap-1.5 text-blue-400">
      <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-black shadow-glow-blue">
        1
      </span>
      <span className="font-bold">ORDER PLACED</span>
      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
        STATUS: PENDING
      </span>
    </div>

    <div className="h-0.5 flex-1 bg-white/10 mx-3 -mt-6" />

    <div className="flex flex-col items-center gap-1.5 text-slate-600">
      <span className="w-8 h-8 rounded-full bg-[#151D2C] text-slate-500 flex items-center justify-center font-black">
        2
      </span>
      <span>PROCESSING</span>
    </div>

    <div className="h-0.5 flex-1 bg-white/10 mx-3 -mt-6" />

    <div className="flex flex-col items-center gap-1.5 text-slate-600">
      <span className="w-8 h-8 rounded-full bg-[#151D2C] text-slate-500 flex items-center justify-center font-black">
        3
      </span>
      <span>DISPATCHED</span>
    </div>

    <div className="h-0.5 flex-1 bg-white/10 mx-3 -mt-6" />

    <div className="flex flex-col items-center gap-1.5 text-slate-600">
      <span className="w-8 h-8 rounded-full bg-[#151D2C] text-slate-500 flex items-center justify-center font-black">
        4
      </span>
      <span>DELIVERED</span>
    </div>
  </div>
</div>
```

---

### 6.6 Database ERD Cockpit (`/erd`)
- **Interactive 5 Tables**: `customers`, `categories`, `products`, `orders`, `order_items`.
- **Live Database Statistics**: Real-time counter of rows currently stored in SQLite database.
- **5 Tabs**:
  1. Visual ERD Diagram with 3NF relationships and PK/FK markers.
  2. Data Dictionary with table schema, constraints, and descriptions.
  3. Prisma Schema & SQLite DDL code view with copy function.
  4. Live Records & Relational Integrity explanations.
  5. `diagrams.net` (`.drawio`) download and import instructions.

---

## 7. Interactive Prototype (`prototype.html`)

An interactive standalone prototype has been generated in the workspace root: [`prototype.html`](./prototype.html).
It demonstrates:
1. Aerospace Floating Navbar with live responsive state.
2. Bento Hardware Catalog with live "Add to Cart" mechanical depression and instant HUD update.
3. Interactive Shopping Cart modal/view with QTY stepper `[-] [ 1 ] [+]` and free shipping progress meter.
4. Terminal Checkout flow with 1-click student demo auto-fill and live validation.
5. Slide 28 confirmation screen with order `ORD-0001` and pending status.

---

## 8. Handoff Checklist for `@frontend`

- [ ] Update `tailwind.config.ts` with color tokens (`void`, `cyber`), font families, and box shadows.
- [ ] Ensure `src/app/globals.css` imports `@tailwind base; components; utilities;` and sets body background to `#080B11` with `color: #F8FAFC`.
- [ ] Implement `navbar.tsx` adhering to the Aerospace Floating Navbar specs.
- [ ] Refactor `product-card.tsx` with the Cyber-Tactile Bento layout, live pulse radar, and mechanical buttons.
- [ ] Upgrade `src/app/cart/page.tsx` with circular steppers, shipping progress meter, and sticky summary.
- [ ] Upgrade `src/app/checkout/page.tsx` with 8 validated fields, 1-click demo button, and shipping radio cards.
- [ ] Rebuild `src/app/order-confirmation/[orderNumber]/OrderConfirmationClient.tsx` to match Slide 28 with confetti burst and printable manifest.
- [ ] Enhance `src/app/erd/page.tsx` with high-tech obsidian cards, telemetry stats, and 5 interactive tabs.
