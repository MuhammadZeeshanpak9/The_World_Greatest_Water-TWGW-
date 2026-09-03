/** "EVERYTHING STARTS IN THE MIND" card art — same graphic used for the
 * homepage Wellness grid's Mind card, reused wherever a Mind offering is
 * missing a real photo. */
export default function MindCardArt() {
  return (
    <div className="absolute inset-0 bg-[#e8dbf7] overflow-hidden">
      {/* Concrete/Paper texture overlay */}
      <div
        className="absolute inset-0 opacity-15 mix-blend-multiply"
        style={{
          backgroundImage:
            "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E')",
        }}
      />
      <svg
        className="absolute inset-0 w-full h-full text-[#6b2fa0]/20"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        <polygon points="-10,-10 60,-10 15,45" fill="currentColor" />
        <polygon points="110,-10 110,30 35,90" fill="currentColor" />
        <polygon points="-10,40 40,110 -10,110" fill="currentColor" />
        <polygon points="35,110 110,110 85,35" fill="currentColor" />
        <polygon points="50,40 70,20 80,60" fill="currentColor" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <p className="text-[#431866] text-[15px] font-inter font-bold text-center tracking-[0.2em] leading-[1.8] drop-shadow-sm">
          EVERYTHING
          <br />
          STARTS IN
          <br />
          THE MIND
        </p>
      </div>
    </div>
  );
}
