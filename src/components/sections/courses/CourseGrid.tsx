"use client";

import { m } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BLOG_POSTS } from "@/data/content";
import { GradientPlaceholder } from "@/components/ui/MediaWithFallback";

const COURSES = BLOG_POSTS.filter((p) => p.topic);

export default function CourseGrid() {
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-center font-cormorant text-[40px] text-ink md:text-[52px] text-glow-violet">
          12 Courses. 12 Understandings.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center font-inter text-base text-body">
          Each course is a comprehensive, value-packed journey into one of the 12 most important
          understandings of SELF
        </p>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {COURSES.map((post, i) => (
            <m.div
              key={post.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="flex flex-col overflow-hidden rounded-2xl glass-card-light p-5"
            >
              <Link href={`/courses/${post.slug}`} className="relative h-[160px] overflow-hidden rounded-xl">
                <GradientPlaceholder watermark={post.topic} className="rounded-xl" />
              </Link>

              <Link href={`/courses/${post.slug}`}>
                <h3 className="mt-5 font-cormorant text-[22px] leading-tight text-ink hover:text-violet">
                  {post.title}
                </h3>
              </Link>
              <p className="mt-2 font-inter text-[13px] text-body">{post.teaser}</p>

              <div className="mt-4 flex items-center justify-between">
                <span className="font-inter text-[18px] font-semibold text-violet">
                  $47.77 per course
                </span>
              </div>
              <span className="mt-3 inline-block w-fit rounded-full border border-violet px-3 py-1 font-inter text-[10px] font-semibold uppercase tracking-[0.15em] text-violet">
                Coming Soon
              </span>

              <button
                disabled
                className="mt-5 flex h-[46px] items-center justify-center gap-2 rounded border border-muted/40 font-inter text-[11px] font-semibold uppercase tracking-[0.15em] text-muted disabled:cursor-not-allowed"
              >
                Enroll Now
                <ArrowRight size={13} />
              </button>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}
