import type { BlogPost } from "@/types";
import YouTubeEmbed from "@/components/ui/YouTubeEmbed";
import PullQuote from "@/components/ui/PullQuote";
import { GradientPlaceholder } from "@/components/ui/MediaWithFallback";
import ShareButtons from "./ShareButtons";

const EMOTO_QUOTES = [
  "Our THOUGHTS and FEELINGS affect our PHYSICAL reality.",
  "The molecular structure in water transforms when exposed to human words, thoughts, sounds and intentions.",
  "My physical body is a reflection of the THOUGHTS I think either randomly or intentionally.",
  "Through elevating my THOUGHTS I could potentially heal myself from any and every type of illness or sickness.",
];

export default function BlogDetailContent({ post }: { post: BlogPost }) {
  const isBonusPost = !post.topic;

  return (
    <div className="min-w-0 flex-1">
      {isBonusPost ? (
        <>
          <YouTubeEmbed url="https://www.youtube.com/watch?v=vSPMQ3wVDpE&t=147s" title={post.title} />

          <div className="mt-8 flex flex-col gap-5">
            <p className="font-inter text-[18px] leading-[1.95] text-[#333]">
              The human body is 60–75% water — and according to the research of
              Dr. Masaru Emoto, water&apos;s molecular structure responds to the
              words, thoughts, and intentions directed at it. &ldquo;Hado&rdquo; is
              defined in his work as the intrinsic vibration pattern at the
              atomic level in all matter.
            </p>
            <p className="font-inter text-[18px] leading-[1.95] text-[#333]">
              {EMOTO_QUOTES[0]} {EMOTO_QUOTES[1]}
            </p>
          </div>

          <PullQuote quote={EMOTO_QUOTES[2]} className="my-12" />

          <p className="font-inter text-[18px] leading-[1.95] text-[#333]">
            {EMOTO_QUOTES[3]} &ldquo;If I believe that something is real or
            true, then it is.&rdquo;
          </p>
        </>
      ) : (
        <>
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl">
            <GradientPlaceholder watermark="Video coming soon" className="rounded-2xl" />
          </div>

          <div className="mt-8 flex flex-col gap-5">
            <p className="font-inter text-[18px] leading-[1.95] text-[#333]">
              {post.teaser}
            </p>
            <p className="font-inter text-[18px] leading-[1.95] text-[#333]">
              Every understanding in the ELEV8 collection is a doorway — a
              single word carrying a lifetime of practice. {post.topic} is no
              exception: it asks you to slow down, notice where you already
              live it, and where there&apos;s room to grow.
            </p>
          </div>

          <span className="mt-8 inline-block rounded-full bg-violet/10 px-4 py-1.5 font-inter text-[10px] font-semibold uppercase tracking-[0.3em] text-violet">
            Full article coming soon
          </span>
        </>
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
