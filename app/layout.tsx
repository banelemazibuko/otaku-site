import { Suspense } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { Providers } from "@/components/Providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "OtakuStream",
  description: "Stream and discover anime with your personal watchlist",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-otaku-black font-sans text-gray-100 antialiased">
        <Providers>
          <Suspense fallback={<div className="h-16 border-b border-otaku-violet/20 bg-otaku-grey/95" />}>
            <Navbar />
          </Suspense>
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
