"use client";

import { m } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import type { DbBlogPost } from "@/types";
import { GradientPlaceholder } from "@/components/ui/MediaWithFallback";
import { parseYouTubeUrl } from "@/lib/youtube";

export default function BlogGrid({ posts }: { posts: DbBlogPost[] }) {
  if (posts.length === 0) {
    return (
      <section className="bg-white py-24 text-center md:py-32">
        <p className="font-inter text-body">New stories are on the way — check back soon.</p>
      </section>
    );
  }

  return (
    <section className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => {
            const videoId = post.video_url ? parseYouTubeUrl(post.video_url)?.id : undefined;
            return (
            <m.div
              key={post.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 6) * 0.08 }}
              whileHover={{ y: -6 }}
              className="flex flex-col overflow-hidden rounded-[16px] border border-violet/10 p-5 transition-shadow hover:shadow-[0_20px_50px_rgba(107,47,160,0.14)]"
            >
              <Link
                href={`/blogs/${post.slug}`}
                className="relative h-[180px] overflow-hidden rounded-xl"
              >
                {videoId ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element -- external YouTube
                        thumbnail URL, not a local/optimizable asset */}
                    <img
                      src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                      alt={post.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-lg">
                        <Play size={20} className="ml-0.5 fill-violet text-violet" />
                      </span>
                    </div>
                  </>
                ) : (
                  <GradientPlaceholder watermark={post.topic ?? "ELEV8"} className="rounded-xl" />
                )}
              </Link>
              <Link href={`/blogs/${post.slug}`}>
                <h3 className="mt-5 font-cormorant text-[24px] leading-tight text-ink hover:text-violet">
                  {post.title}
                </h3>
              </Link>
              {post.teaser && (
                <p className="mt-2 font-inter text-[14px] text-body">{post.teaser}</p>
              )}
              <Link
                href={`/blogs/${post.slug}`}
                className="group mt-4 inline-flex items-center gap-1 font-inter text-[12px] font-semibold uppercase tracking-[0.15em] text-violet"
              >
                Read More
                <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </m.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
