import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <main>
      <Navbar />

      <section className="flex min-h-screen flex-col items-center justify-center bg-white px-6 pt-24 text-center">
        <p className="font-cormorant text-[120px] leading-none text-violet/20">404</p>
        <h1 className="mt-2 font-cormorant text-[36px] text-ink">
          This page hasn&apos;t been ELEV8&apos;d yet.
        </h1>
        <p className="mt-3 max-w-md font-inter text-base text-body">
          The page you&apos;re looking for doesn&apos;t exist. Let&apos;s get you
          back on track.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="group flex items-center gap-2 rounded bg-violet px-8 py-3 font-inter text-[12px] font-semibold uppercase tracking-[0.15em] text-white transition-transform duration-300 hover:scale-[1.02]"
          >
            Back Home
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/shop"
            className="font-inter text-[12px] font-semibold uppercase tracking-[0.15em] text-violet transition-colors hover:text-violet-mid"
          >
            Shop To ELEV8
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
