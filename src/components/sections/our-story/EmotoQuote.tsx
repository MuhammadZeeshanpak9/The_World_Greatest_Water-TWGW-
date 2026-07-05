import PullQuote from "@/components/ui/PullQuote";
import YouTubeEmbed from "@/components/ui/YouTubeEmbed";

export default function EmotoQuote() {
  return (
    <section className="bg-violet-tint py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <PullQuote
          quote="Words are the vibrations of nature. Therefore, beautiful words create beautiful nature. Ugly words create ugly nature. This is the root of the universe."
          attribution="Masaru Emoto"
        />

        <p className="mx-auto mt-8 max-w-xl font-inter text-base leading-[1.9] text-body">
          Through the research of Dr. Masaru Emoto and several of the world&apos;s
          top scientists and researchers in the area of water showed how our
          words, thoughts, and emotions impact water and our overall well-being.
        </p>

        <div className="mx-auto mt-12 max-w-xl">
          <YouTubeEmbed url="https://www.youtube.com/watch?v=vSPMQ3wVDpE&t=147s" />
        </div>
      </div>
    </section>
  );
}
