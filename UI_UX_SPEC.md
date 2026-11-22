# 🎨 UI/UX DESIGN SYSTEM SPECIFICATION
## Project: Webyansh Tech E-Commerce (`លំហាត់អនុវត្ត.pdf` Practical Exercises 1-4)
**Architect**: System Architect (`@architect`)  
**Status**: APPROVED FOR FRONTEND IMPLEMENTATION  
**Target Date**: November 2026  

---

## 1. Aesthetic Archetype & Design Language

### 1.1 Aesthetic Archetype: Modern Minimalist Luxe E-Commerce
Combining the ultra-clean layout of **Webyansh e-commerce** (as shown in `លំហាត់អនុវត្ត.pdf` Pages 2 & 3) with the precision, tactile micro-interactions, and visual restraint of **Apple / Linear** design systems:
- **Clean Hairline Borders**: `border-neutral-200/80` or `border-slate-200/90` giving crisp separation without visual clutter.
- **Layered Diffused Shadows**: Soft ambient shadows (`shadow-xs`, `shadow-sm`, `shadow-xl`) paired with subtle inner rings.
- **Backdrop Glassmorphism**: Translucent floating elements (`backdrop-blur-md bg-white/80`) for headers, sticky bars, and floating badges.
- **Tactile Micro-Interactions**: Active scale states (`active:scale-[0.98]`), springy count badges, smooth hover lifts (`hover:-translate-y-0.5`), and animated checkmark state morphing.

### 1.2 Color Palette & Semantic Tokens

| Token | Light Mode Value | Tailwind Class | Semantic Purpose |
| :--- | :--- | :--- | :--- |
| **Canvas Background** | `#F8FAFC` / `#FAFAFA` | `bg-slate-50/70` | Soft, glare-free canvas |
| **Card Surface** | `#FFFFFF` | `bg-white` | Elevated surface for products, forms, summaries |
| **Card Border** | `#E2E8F0` / `#E5E7EB` | `border-slate-200/80` | Subtle hairline framing |
| **Text Primary** | `#0F172A` | `text-slate-900` | High contrast headings & product titles |
| **Text Secondary** | `#475569` | `text-slate-600` | Descriptions and label text |
| **Text Muted** | `#94A3B8` | `text-slate-400` | Subtitles, helper text, breadcrumb separators |
| **Brand Primary (CTA)** | `#0F172A` / `#18181B` | `bg-slate-900 hover:bg-black` | Bold, executive primary checkout & submit buttons |
| **Accent Electric** | `#2563EB` | `bg-blue-600 text-blue-600` | Active states, primary links, tech highlights |
| **Success / Valid** | `#059669` / `#10B981` | `text-emerald-600 bg-emerald-50` | Slide 28 confirmation, stock pulse, form valid checks |
| **Danger / Remove** | `#DC2626` | `text-rose-600 hover:bg-rose-50` | Remove from cart, validation error alerts |
| **Warning / Notice** | `#D97706` | `text-amber-600 bg-amber-50` | Low stock warnings, express shipping tags |

### 1.3 Typography System
- **Font Stack**: Modern Geometric Sans (`Inter`, `system-ui`, `-apple-system`, `sans-serif`) paired with Monospace (`ui-monospace`, `SFMono-Regular`, `Menlo`, `monospace`) for currency figures, order numbers (`ORD-0001`), and database keys.
- **Hierarchy**:
  - `Hero Display`: `text-3xl sm:text-5xl font-black tracking-tight`
  - `Section Title`: `text-xl sm:text-2xl font-black text-slate-900 tracking-tight`
  - `Card Title`: `text-base font-bold text-slate-900`
  - `Body Text`: `text-sm text-slate-600 leading-relaxed`
  - `Micro Label`: `text-[11px] font-bold uppercase tracking-wider text-slate-400`
  - `Monospace Key/Price`: `font-mono font-bold tracking-tight`

---

## 2. Page-by-Page UI/UX Blueprint

### 2.1 Sticky Glassmorphic Navbar & Announcement Header (`src/components/navbar.tsx`)
- **Top Bar**: High-contrast slate bar displaying:
  - Khmer badge: `"លំហាត់អនុវត្ត"` (Exercises 1-4).
  - Quick utility metrics: Fast Shipping, Currency USD ($), NBC EMVCo Standards compliance.
- **Main Nav**:
  - Left: Refined logo with modern computer icon, title `"Webyansh Tech"`, subtitle `"Computer Store & Peripherals"`.
  - Center: Clean navigation links with subtle pill hover (`Store`, `Shopping Cart`, `Orders`, `Database ERD`).
  - Search Bar / Quick Filter: Inline search input with keyboard shortcut hint (`⌘K` / `Ctrl+K`) to filter the 4 catalog products in real-time.
  - Right:
    - Cart Pill Button: Shows shopping bag icon, subtotal preview, and animated bounce badge displaying `itemCount`.
    - Database ERD badge link.
- **Mobile Menu**: Smooth slide-over sheet with all links, cart count, and quick checkout access.

---

### 2.2 Product Catalog Page (`src/app/page.tsx`) - Exercise 1
- **Hero Presentation**:
  - Bento-style hero header showcasing tech presentation with subtle ambient gradient glow.
  - Trust Badges Row:
    1. **Guaranteed Authentic** (1-Year Warranty).
    2. **Instant Local Delivery** (Free Standard & $9 Express).
    3. **Exercise 1-4 Architecture** (3NF Relational SQLite Schema).
  - Filter / Category Navigation: Pills for `"All Hardware (4)"`, `"Laptops"`, `"Peripherals"`, `"Displays"`.
- **The 4 Catalog Product Cards**:
  1. **Laptop** ($650.00):
     - Tech Specs Pill: `"16GB RAM • 512GB SSD • 15.6\" FHD"`
     - Rating: `4.9 ★ (142 reviews)`
     - Stock Status: `In Stock: 50 units` with pulsing green dot.
  2. **Mouse** ($15.00):
     - Tech Specs Pill: `"16,000 DPI Optical • Silent Clicks"`
     - Rating: `4.8 ★ (89 reviews)`
     - Stock Status: `In Stock: 120 units` with pulsing green dot.
  3. **Keyboard** ($25.00):
     - Tech Specs Pill: `"Mechanical RGB • Tactile Blue Switches"`
     - Rating: `4.9 ★ (210 reviews)`
     - Stock Status: `In Stock: 80 units` with pulsing green dot.
  4. **Monitor** ($120.00):
     - Tech Specs Pill: `"27-inch 4K IPS • 144Hz • HDR400"`
     - Rating: `4.9 ★ (95 reviews)`
     - Stock Status: `In Stock: 35 units` with pulsing green dot.
- **Product Card Interactive States**:
  - Aspect ratio `4:3` image container with smooth zoom on hover (`scale-105 transition-transform duration-500`).
  - Quick View Button (reveals a sleek modal with full specifications, photo preview, and instant add-to-cart).
  - Tactile "Add to Cart" button with morphing state:
    - Default: `[+ Add to Cart]`
    - Added: `[✓ Added!]` in emerald with subtle check bounce.
  - Instant floating toast notification (bottom-right or top-center) with auto-dismiss after 2.5s.

---

### 2.3 Shopping Cart Page (`src/app/cart/page.tsx`) - Inspired by Page 2 of PDF
Directly matches the clean, 2-column Webyansh shopping cart layout in `លំហាត់អនុវត្ត.pdf` (Page 2):

- **Free Shipping Progress Meter**:
  - Dynamic progress bar: `"Add $X more to unlock Free Express Courier!"` (or `"Congratulations! Your order qualifies for Free Standard Delivery"`).
- **Left Column: Cart Items Table (8 Columns)**:
  - Header row: `Product Details`, `Unit Price`, `Quantity`, `Total`.
  - Item Rows:
    - High-resolution rounded product thumbnail with subtle border.
    - Product title, category chip, tech spec subtitle.
    - Unit price formatted cleanly (`$650.00`).
    - Tactile Quantity Stepper:
      - Circular / rounded pill `[-]` `[ 1 ]` `[+]` with smooth tactile click and auto-preventing negative numbers.
    - Wishlist heart button & red trash can button with tooltip.
    - Computed line total in bold typography (`$650.00` / `$1,300.00`).
  - Table footer: Quick `"← Continue Shopping"` link and `"Clear Entire Cart"` button with confirmation.
- **Right Column: Sticky Order Summary Card (4 Columns)**:
  - Header: `"Order Summary"` with item count indicator.
  - Breakdown:
    - Subtotal: calculated dynamically.
    - Delivery: previewing `"Free Standard ($0)"` or `"Express Available ($9)"`.
    - Promo Code Input: Enter `"TECH10"` (or custom code) with `"Apply"` button, animated discount badge, and deduction.
    - Estimated Taxes: `$0.00` (transparent pricing).
    - Grand Total: Highlighted in large, bold font (`$650.00`).
  - High-Contrast Primary CTA:
    - Black / Dark Slate button: `"Proceed to Checkout →"` (active scale, focus ring).
  - Trust Badges:
    - 256-Bit SSL Encryption, Money-Back Guarantee, Instant Order Confirmation.
- **Empty Cart State**:
  - Sleek illustration, friendly message, and prominent `"Explore Hardware Products"` button.

---

### 2.4 Checkout Page (`src/app/checkout/page.tsx`) - Inspired by Page 3 of PDF
Directly implements Page 3 of `លំហាត់អនុវត្ត.pdf` (Webyansh Checkout layout):

- **Breadcrumbs Navigation**:
  - `Cart > Customer & Shipping Address > Order Confirmation`.
- **Demo Data Quick Fill**:
  - A handy 1-click button `"✨ Auto-Fill Demo Student Data"` at the top to accelerate testing and presentation evaluations.
- **Left Column: Shipping & Customer Form (7 Columns)**:
  - **Section 1: Contact Information**:
    - First Name & Last Name (2-column grid).
    - Email Address (with email format regex validation).
    - Phone Number (with telephone format guidance).
  - **Section 2: Delivery Address**:
    - Street Address.
    - City, State / Province, Zip / Postal Code (3-column responsive grid).
  - **Real-Time Inline Validation**:
    - Valid state: Field border turns soft emerald with a subtle green checkmark icon inside the input.
    - Error state: Field border turns rose with clear, friendly error text underneath.
  - **Section 3: Shipping Method Selection (Radio Cards)**:
    - Card 1: **Free Shipping ($0.00)**:
      - Icon: Standard Delivery Van.
      - Description: `"Standard Delivery (7-20 Business Days)"`.
      - Price: `FREE ($0.00)`.
    - Card 2: **Express Shipping ($9.00)**:
      - Icon: Fast Courier Rocket / Lightning Truck.
      - Description: `"Priority Express Courier (1-3 Business Days)"`.
      - Price: `+$9.00`.
      - Pill Badge: `"Fastest Delivery"`.
- **Right Column: Sticky Order Review (5 Columns)**:
  - Item mini-cards: Thumbnail, product title, quantity tag (`Qty: 1`), and total line price.
  - Discount / Promo Code bar with active discount tags.
  - Transparent price summary: Subtotal, Shipping (`$0.00` or `$9.00`), Taxes (`$0.00`), Grand Total.
  - Prominent `"Place Order"` Button:
    - Loading spinner with message `"Processing Order with Database..."`.
    - Submits to `/api/orders` and smoothly redirects to `/order-confirmation/[orderNumber]`.

---

### 2.5 Order Confirmation (`/order-confirmation/[orderNumber]`) - Slide 28
Strictly implements the exact layout and data from **Slide 28**:

- **Celebratory Success Banner**:
  - Multi-color confetti explosion on initial page load (via `canvas-confetti`).
  - Animated emerald checkmark circle with glowing ring.
  - Main Headline: `"Order Placed Successfully!"` (Slide 28).
  - Khmer Title: `"ការបញ្ជាទិញទទួលបានជោគជ័យ!"`.
  - Subtitle: `"Thank you for your purchase. We have received your order and are processing it."`.
- **Order Stepper Status Timeline**:
  - `Order Placed (Pending) [Active]` ➔ `Processing` ➔ `Shipped` ➔ `Delivered`.
  - Status explicitly shows `"Pending"` with pulse status badge matching Slide 28.
- **Key Information Bento Cards**:
  - **Order ID Card**: Prominent `ORD-0001` with a 1-click `"Copy Order ID"` button with `"Copied!"` tooltip.
  - **Order Date Card**: Formatted calendar time (e.g. `Nov 22, 2026, 2:30 PM`).
  - **Customer Details Card**: Full Name, Email, Phone number.
  - **Shipping Destination Card**: Complete street address, city, state, zip code, and selected shipping method (Free vs. Express).
- **Itemized Ordered Products Table (Slide 28 Requirements)**:
  - Table Columns: `Product`, `Unit Price`, `Quantity`, `Line Total`.
  - Shows each ordered item with thumbnail, title, price snapshot, quantity, and total.
  - Financial Summary footer:
    - Subtotal
    - Shipping Cost (`$0.00` or `$9.00`)
    - Grand Total (e.g. `$650.00` or `$809.00`) in bold dark typography.
- **Action Buttons Bar**:
  - **Print Invoice / Receipt**: Triggers `window.print()` with clean `@media print` styling (hides navigation bars and formats as a clean A4 receipt).
  - **Track Order**: Shows order status modal or tracking drawer.
  - **View in Database ERD**: Direct link to `/erd` to see where the customer, order, and order_items records were created.
  - **Continue Shopping**: Returns to `/`.

---

### 2.6 Interactive ERD & Database Design Viewer (`/erd`) - Exercise 4
- **Live Database Metrics Banner**:
  - Real-time row counts for all 5 relational tables (`Customers`, `Categories`, `Products`, `Orders`, `Order_Items`).
- **Tabbed Architectural Viewer**:
  - **Tab 1: Visual Interactive Diagram**:
    - High-tech interactive entity boxes with primary keys (`PK`), foreign keys (`FK`), and data types (`Int`, `String`, `Float`, `DateTime`).
    - Visual connection indicators showing relationships:
      - `Categories (1)` ➔ `Products (N)`
      - `Customers (1)` ➔ `Orders (N)`
      - `Orders (1)` ➔ `Order_Items (N)`
      - `Products (1)` ➔ `Order_Items (N)`
    - Active hover linking: Hovering over an entity highlights linked foreign keys.
  - **Tab 2: Data Dictionary**:
    - Complete column specification table with nullability, unique keys, and academic exercise notes.
  - **Tab 3: Prisma Schema & SQL DDL**:
    - Syntax-highlighted schema code with 1-click `"Copy Schema"` button.
  - **Tab 4: Live Records Explorer**:
    - Real-time inspection of actual database rows currently stored in SQLite.

---

### 2.7 Orders History Page (`/orders`)
- Sleek administrative & customer order history portal.
- Filter and search bar to look up orders by `orderNumber` (`ORD-0001`), customer name, or email.
- Order cards with status pills, item summaries, order dates, and direct links to view the confirmation receipt.

---

## 3. Micro-Interactions & Animation Guidelines

| Interaction | Implementation / CSS | Experience Goal |
| :--- | :--- | :--- |
| **Add to Cart** | Button text morphs into checkmark, emerald background flash, cart pill badge bounces. | Immediate satisfying tactile feedback without page refresh. |
| **Quantity Stepper** | Scale down on click (`active:scale-90`), smooth number transition, disabled minus at 1 (or remove prompt). | Effortless cart adjustment. |
| **Inline Validation** | Input border smoothly transitions between `border-slate-300`, `border-emerald-500`, and `border-rose-500` with icons. | Zero-confusion form filling. |
| **Order Placed Celebration** | `canvas-confetti` fireworks burst with dual cannons on page mount. | Rewarding culmination of Exercise 3. |
| **Copy Order ID** | Tooltip changes from `"Copy ID"` to `"Copied to clipboard!"` with checkmark. | Frictionless utility. |
| **Modal / Quick View** | Smooth fade-in backdrop (`backdrop-blur-sm`) and scale-in modal (`scale-95` to `scale-100`). | Modern app-like feel. |

---

## 4. Frontend Implementation Task Assignments (`@frontend`)

### Task F-1: Global UI Layout, Glassmorphic Navbar & Toast System
- File: `src/components/navbar.tsx`, `src/app/layout.tsx`, `src/components/footer.tsx`
- Implement sticky blurred glassmorphic header with logo, top exercise banner, search input, and cart counter pill.
- Add toast notification component for cart additions and system notices.
- Update footer with academic references to `លំហាត់អនុវត្ត.pdf`, tech stack badges, and clean links.

### Task F-2: Product Catalog & Quick View Modal (`src/app/page.tsx`)
- Implement Hero banner with trust badges (1-Year Warranty, Fast Delivery, NBC EMVCo Ready).
- Refactor the 4 product cards:
  - Add realistic high-def hardware photos.
  - Add tech specs badges (`16GB RAM • 512GB SSD`, `16,000 DPI`, etc.).
  - Add rating stars (`4.9 ★`) and review counts.
  - Add stock pulse indicator.
  - Implement Quick View modal with detailed specs tab.
  - Implement animated "Add to Cart" button with morphing checkmark and toast.

### Task F-3: Shopping Cart Page Overhaul (`src/app/cart/page.tsx`)
- Match Page 2 of `លំហាត់អនុវត្ត.pdf` (Webyansh clean layout):
  - Free shipping progress bar.
  - Product thumbnail, specs, unit price, tactile quantity steppers `[-] [ 1 ] [+]`.
  - Red remove button and wishlist toggle.
  - Sticky Order Summary card with Subtotal, Delivery preview, Promo code input (`TECH10`), Taxes ($0.00), and Grand Total.
  - High-contrast black CTA button: "Proceed to Checkout →".
  - Empty cart illustration and shop link.

### Task F-4: Checkout Form & Shipping Method Selector (`src/app/checkout/page.tsx`)
- Match Page 3 of `លំហាត់អនុវត្ត.pdf` (Webyansh checkout):
  - Breadcrumb header (`Cart > Shipping & Details > Confirmation`).
  - "✨ Auto-Fill Demo Data" button for fast evaluation.
  - 8 required inputs with live inline validation and checkmark icons.
  - Shipping method radio cards (Free $0 [7-20 Days], Express $9 [1-3 Days]).
  - Sticky right-column cart review with item mini-thumbnails, promo code deduction, and price breakdown.
  - "Place Order" button with loading spinner state.

### Task F-5: Order Confirmation Page (Slide 28 Polish) (`src/app/order-confirmation/[orderNumber]/page.tsx`)
- Implement celebratory success banner with confetti blast and checkmark.
- Order Status Stepper timeline with `"Pending"` active state.
- Order ID card with 1-click "Copy Order ID" button.
- Customer card & delivery address summary card.
- Itemized ordered products table with unit prices, quantities, and line totals matching Slide 28.
- "Print Invoice / Receipt" with dedicated print stylesheet.

### Task F-6: Interactive ERD & Database Viewer (`src/app/erd/page.tsx`)
- Implement live database stats cards.
- Visual ERD cards for the 5 entities (`Customers`, `Categories`, `Products`, `Orders`, `Order_Items`) with PK/FK tags and relationship indicators.
- Tabbed view: Visual ERD, Data Dictionary, Prisma/SQL Code, Live Database Explorer.

### Task F-7: Orders List Dashboard (`src/app/orders/page.tsx`)
- Polish the orders management dashboard with search by Order ID / Customer, status filters, and clean table navigation.
