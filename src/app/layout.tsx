import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/cart-context";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Webyansh Tech Store | លំហាត់អនុវត្ត E-Commerce & Database System",
  description:
    "E-commerce storefront and relational database system implementing Practical Exercises 1, 2, 3 & 4 from លំហាត់អនុវត្ត.pdf.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-50 text-slate-900 min-h-screen flex flex-col selection:bg-blue-600 selection:text-white">
        <CartProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
