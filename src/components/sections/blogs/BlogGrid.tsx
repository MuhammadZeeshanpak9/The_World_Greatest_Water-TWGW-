"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BLOG_POSTS } from "@/data/content";
import { GradientPlaceholder } from "@/components/ui/MediaWithFallback";

export default function BlogGrid() {
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {BLOG_POSTS.map((post, i) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 6) * 0.08 }}
              whileHover={{ y: -6 }}
              className="flex flex-col overflow-hidden rounded-[16px] border border-violet/10 p-5 transition-shadow hover:shadow-[0_20px_50px_rgba(107,47,160,0.14)]"
            >
              <Link href={`/blogs/${post.slug}`} className="relative h-[180px] overflow-hidden rounded-xl">
                <GradientPlaceholder watermark={post.topic ?? "ELEV8"} className="rounded-xl" />
              </Link>
              <Link href={`/blogs/${post.slug}`}>
                <h3 className="mt-5 font-cormorant text-[24px] leading-tight text-ink hover:text-violet">
                  {post.title}
                </h3>
              </Link>
              <p className="mt-2 font-inter text-[14px] text-body">{post.teaser}</p>
              <Link
                href={`/blogs/${post.slug}`}
                className="group mt-4 inline-flex items-center gap-1 font-inter text-[12px] font-semibold uppercase tracking-[0.15em] text-violet"
              >
                Read More
                <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
