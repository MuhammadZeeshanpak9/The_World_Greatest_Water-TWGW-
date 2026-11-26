// Royal gold variant of GoWithinArt, used only on the Unlock The Lock detail
// page's hero image bubble. GoWithinArt itself (soft violet/cream) stays
// unchanged since it's shared with the homepage card showcase.
export default function UnlockTheLockArt() {
  return (
    <div className="absolute inset-0 flex flex-col bg-[#0c0a08] overflow-hidden">
      <div className="flex-1 flex flex-col items-center justify-center pb-6 z-10 relative bg-transparent">
        <p className="font-cormorant text-gold text-[28px] tracking-widest leading-none">GO</p>
        <p className="font-cormorant text-gold text-[20px] tracking-[0.15em] mt-3 leading-none">
          WITHIN
        </p>
      </div>
      <div className="flex-1 relative" style={{ background: "linear-gradient(160deg, #1a1410 0%, #3a2c10 60%, #0c0a08 100%)" }}>
        <div
          className="absolute -top-4 left-0 right-0 h-8 bg-[#0c0a08] opacity-95"
          style={{ filter: "url(#roughEdgeGold)" }}
        />
        <div
          className="absolute inset-0 mix-blend-color-dodge opacity-30"
          style={{
            backgroundImage:
              "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%224%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <svg width="0" height="0" className="absolute">
          <filter id="roughEdgeGold">
            <feTurbulence type="fractalNoise" baseFrequency="0.2" numOctaves="3" result="noise" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="20"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </svg>
      </div>
      <div className="pointer-events-none absolute inset-0 border border-gold/20" aria-hidden />
    </div>
  );
}
