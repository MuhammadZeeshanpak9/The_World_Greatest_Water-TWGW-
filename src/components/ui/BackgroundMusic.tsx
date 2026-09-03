"use client";

import { useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

const TRACK_SRC = "/Audio/the-greatest.mp3";

/** Sitewide background music toggle. Starts silent on every page load — browsers block
 * unmuted autoplay anyway, and unsolicited audio is bad UX — the visitor opts in via the
 * floating button, which then loops for the rest of the session across navigations. */
export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(
        () => setPlaying(true),
        () => setPlaying(false),
      );
    }
  }

  return (
    <>
      <audio ref={audioRef} src={TRACK_SRC} loop preload="none" />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Mute background music" : "Play background music"}
        aria-pressed={playing}
        className="fixed bottom-6 right-6 z-[8000] flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-dark-base/90 text-white shadow-[0_8px_24px_rgba(0,0,0,0.4)] backdrop-blur-md transition-transform hover:scale-105 active:scale-95"
      >
        {playing ? <Volume2 size={18} /> : <VolumeX size={18} />}
      </button>
    </>
  );
}
