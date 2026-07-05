import { parseYouTubeUrl } from "@/lib/youtube";
import { GradientPlaceholder } from "@/components/ui/MediaWithFallback";

type YouTubeEmbedProps = {
  url: string;
  title?: string;
  className?: string;
  rounded?: string;
};

export default function YouTubeEmbed({
  url,
  title = "ELEV8 WATER video",
  className = "",
  rounded = "rounded-2xl",
}: YouTubeEmbedProps) {
  const parsed = parseYouTubeUrl(url);

  return (
    <div
      className={`relative aspect-video w-full overflow-hidden ${rounded} shadow-[0_20px_60px_rgba(107,47,160,0.25)] ${className}`}
    >
      {parsed ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube.com/embed/${parsed.id}${
            parsed.start ? `?start=${parsed.start}` : ""
          }`}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <GradientPlaceholder watermark="Video unavailable" className={rounded} />
      )}
    </div>
  );
}
