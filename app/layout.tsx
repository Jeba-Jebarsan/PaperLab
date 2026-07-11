import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { BRAND, SITE_URL } from "@/lib/brand";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${BRAND.name} — Understand AI Research Papers by Interacting With Them`,
    template: `%s · ${BRAND.name}`,
  },
  description: BRAND.description,
  keywords: [
    "AI research papers",
    "interactive learning",
    "Transformer",
    "attention mechanism",
    "machine learning education",
    "neural networks",
    "PaperLab",
  ],
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: BRAND.name,
    title: `${BRAND.name} — Understand AI Research Papers by Interacting With Them`,
    description: BRAND.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND.name} — Understand AI Research Papers by Interacting With Them`,
    description: BRAND.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
