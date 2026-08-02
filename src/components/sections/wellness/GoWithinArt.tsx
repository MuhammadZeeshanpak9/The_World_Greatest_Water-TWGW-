/** Hand-drawn "GO WITHIN" card art — shared between the homepage Wellness card and the Unlock The Lock detail page. */
export default function GoWithinArt() {
  return (
    <div className="absolute inset-0 flex flex-col bg-[#faf6ff] overflow-hidden">
      <div className="flex-1 flex flex-col items-center justify-center pb-6 z-10 relative bg-transparent">
        <p className="font-cormorant text-[#6b2fa0] text-[28px] tracking-widest leading-none">GO</p>
        <p className="font-cormorant text-[#6b2fa0] text-[20px] tracking-[0.15em] mt-3 leading-none">
          WITHIN
        </p>
      </div>
      <div className="flex-1 bg-[#8745c4] relative">
        <div
          className="absolute -top-4 left-0 right-0 h-8 bg-[#faf6ff] opacity-95"
          style={{ filter: "url(#roughEdge)" }}
        />
        {/* Glitter noise */}
        <div
          className="absolute inset-0 mix-blend-color-dodge opacity-50"
          style={{
            backgroundImage:
              "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%224%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#360b5e] via-transparent to-transparent opacity-90" />
        <svg width="0" height="0" className="absolute">
          <filter id="roughEdge">
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
    </div>
  );
}
