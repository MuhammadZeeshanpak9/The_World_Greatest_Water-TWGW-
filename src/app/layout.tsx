import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import PageBackground from "@/components/background/PageBackground";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ELEV8 WATER — The World's Greatest Water",
  description:
    "Ultra-purified water infused with 528hz binaural frequency. 1 Water. 12 Understanding. ELEV8 your life.",
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
        <PageBackground />
        <div className="relative z-[1]">{children}</div>
      </body>
    </html>
  );
}
