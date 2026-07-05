"use client";

import { useEffect, useRef } from "react";
import { useIsMobile, usePrefersReducedMotion } from "@/lib/hooks";

type Particle = {
  x: number;
  y: number;
  r: number;
  speed: number;
  drift: number;
  phase: number;
  twinkle: number;
  violet: boolean;
};

/**
 * Global animated background — runs fixed behind the whole page (z-0).
 *  - 3 blurred gradient orbs (CSS keyframe drift/pulse)
 *  - canvas particle field: violet/teal motes rising + twinkling
 */
export default function PageBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isMobile = useIsMobile();
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const count = isMobile ? 30 : 60;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const seed = () => {
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 0.5 + Math.random() * 1.5,
        speed: 0.15 + Math.random() * 0.45,
        drift: (Math.random() - 0.5) * 0.3,
        phase: Math.random() * Math.PI * 2,
        twinkle: 0.6 + Math.random() * 1.4,
        violet: Math.random() < 0.6,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const t = performance.now() * 0.001;
      for (const p of particles) {
        p.y -= p.speed;
        p.x += p.drift;
        if (p.y < -4) {
          p.y = height + 4;
          p.x = Math.random() * width;
        }
        if (p.x < -4) p.x = width + 4;
        if (p.x > width + 4) p.x = -4;

        const alpha = 0.25 + 0.35 * (0.5 + 0.5 * Math.sin(t * p.twinkle + p.phase));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.violet
          ? `rgba(107,47,160,${alpha})`
          : `rgba(78,205,196,${alpha})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    resize();
    seed();

    if (reduced) {
      // Draw a single static frame, no animation loop.
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.violet
          ? "rgba(107,47,160,0.3)"
          : "rgba(78,205,196,0.3)";
        ctx.fill();
      }
    } else {
      raf = requestAnimationFrame(draw);
    }

    const onResize = () => {
      resize();
      seed();
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [isMobile, reduced]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Orb 1 — violet, top-left */}
      <div
        className="absolute h-[800px] w-[800px] rounded-full will-change-transform"
        style={{
          top: "-15%",
          left: "-10%",
          background: "rgba(107,47,160,0.07)",
          filter: "blur(80px)",
          animation: reduced ? "none" : "orbDrift1 15s ease-in-out infinite",
        }}
      />
      {/* Orb 2 — teal, bottom-right */}
      <div
        className="absolute h-[600px] w-[600px] rounded-full will-change-transform"
        style={{
          bottom: "-10%",
          right: "-8%",
          background: "rgba(78,205,196,0.05)",
          filter: "blur(80px)",
          animation: reduced ? "none" : "orbDrift2 20s ease-in-out infinite",
        }}
      />
      {/* Orb 3 — violet, center pulse */}
      <div
        className="absolute h-[400px] w-[400px] rounded-full will-change-transform"
        style={{
          top: "50%",
          left: "50%",
          background: "rgba(107,47,160,0.04)",
          filter: "blur(80px)",
          transform: "translate(-50%,-50%)",
          animation: reduced ? "none" : "orbPulse 10s ease-in-out infinite",
        }}
      />
      {/* Particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}
