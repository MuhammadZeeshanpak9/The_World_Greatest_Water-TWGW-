import Link from "next/link";
import { BLOG_POSTS } from "@/data/content";
import type { BlogPost } from "@/types";

export default function BlogSidebar({ current }: { current: BlogPost }) {
  const others = BLOG_POSTS.filter((p) => p.slug !== current.slug);

  return (
    <aside className="hidden w-64 shrink-0 lg:block">
      <h3 className="font-inter text-[11px] font-semibold uppercase tracking-[0.25em] text-violet">
        Other Understandings
      </h3>
      <ul className="mt-5 flex flex-col gap-3">
        {others.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blogs/${post.slug}`}
              className="font-inter text-[14px] text-body transition-colors hover:text-violet"
            >
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
