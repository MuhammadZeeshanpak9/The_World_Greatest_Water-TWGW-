import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { LazyMotion, domAnimation } from "framer-motion";
import "./globals.css";
import PageBackground from "@/components/background/DynamicPageBackground";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  preload: true,
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  preload: true,
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://theworldsgreatestwater.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "THE WORLD'S GREATEST WATER — ELEV8 WATER",
    template: "%s — ELEV8 WATER",
  },
  description:
    "Ultra-purified water infused with 528hz binaural frequency. 1 Water. 12 Understanding. ELEV8 your life.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#6b2fa0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} antialiased`}
    >
      <body className="relative min-h-screen bg-white font-inter text-ink">
        <LazyMotion features={domAnimation}>
          <PageBackground />
          <div className="relative z-[1]">{children}</div>
        </LazyMotion>
      </body>
    </html>
  );
}
