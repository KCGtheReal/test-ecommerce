import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/cart-context";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Webyansh Core | Cyber-Tactile Industrial Hardware Store (លំហាត់អនុវត្ត)",
  description:
    "Precision-engineered hardware store and relational database system implementing Practical Exercises 1, 2, 3 & 4 from លំហាត់អនុវត្ត.pdf.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-[#080B11] text-slate-100 min-h-screen flex flex-col selection:bg-blue-600 selection:text-white bg-dot-grid">
        <CartProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
