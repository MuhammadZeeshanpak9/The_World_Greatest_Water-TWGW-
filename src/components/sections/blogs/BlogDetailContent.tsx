import type { DbBlogPost } from "@/types";
import { GradientPlaceholder } from "@/components/ui/MediaWithFallback";
import ShareButtons from "./ShareButtons";

export default function BlogDetailContent({ post }: { post: DbBlogPost }) {
  const paragraphs = (post.content ?? "")
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="min-w-0 flex-1">
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl">
        <GradientPlaceholder watermark={post.topic ?? "ELEV8"} className="rounded-2xl" />
      </div>

      {paragraphs.length > 0 ? (
        <div className="mt-8 flex flex-col gap-5">
          {paragraphs.map((paragraph, i) => (
            <p key={i} className="font-inter text-base leading-[1.95] text-[#333]">
              {paragraph}
            </p>
          ))}
        </div>
      ) : (
        post.teaser && (
          <p className="mt-8 font-inter text-base leading-[1.95] text-muted">{post.teaser}</p>
        )
      )}

      <p className="mt-12 font-cormorant text-[20px] italic text-muted">
        Please leave a comment on what {post.topic ?? "THIS"} means to YOU.
      </p>

      <div className="mt-8">
        <ShareButtons title={post.title} />
      </div>
    </div>
  );
}
