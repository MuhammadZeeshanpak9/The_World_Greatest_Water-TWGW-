import PullQuote from "@/components/ui/PullQuote";
import YouTubeEmbed from "@/components/ui/YouTubeEmbed";

export default function OpeningQuote() {
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <PullQuote
          quote="The greatest expression of oneself is adding value to others. The greatest gift I can give myself is to know myself from WITHIN"
          attribution="By Creators"
        />

        <div className="mx-auto mt-14 max-w-xl">
          <YouTubeEmbed url="https://www.youtube.com/embed/81I76Upp8uU?rel=0" />
        </div>
      </div>
    </section>
  );
}
