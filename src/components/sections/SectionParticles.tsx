"use client";

import { useEffect, useRef } from "react";
import { useIsMobile, usePrefersReducedMotion } from "@/lib/hooks";

/**
 * Section-scoped rising particle field (absolute, fills parent).
 * Parent must be `relative overflow-hidden`.
 */
export default function SectionParticles({ count = 40 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isMobile = useIsMobile();
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: false });
    if (!ctx) return;
    if (reduced) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const n = isMobile ? Math.round(count / 2) : count;

    type P = { x: number; y: number; r: number; s: number; ph: number; tw: number; v: boolean };
    let ps: P[] = [];

    const resize = () => {
      w = parent.clientWidth;
      h = parent.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const seed = () => {
      ps = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.5 + Math.random() * 1.5,
        s: 0.2 + Math.random() * 0.5,
        ph: Math.random() * Math.PI * 2,
        tw: 0.6 + Math.random() * 1.4,
        v: Math.random() < 0.6,
      }));
    };
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const t = performance.now() * 0.001;
      for (const p of ps) {
        p.y -= p.s;
        if (p.y < -4) {
          p.y = h + 4;
          p.x = Math.random() * w;
        }
        const a = 0.2 + 0.4 * (0.5 + 0.5 * Math.sin(t * p.tw + p.ph));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.v ? `rgba(107,47,160,${a})` : `rgba(78,205,196,${a})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    resize();
    seed();
    raf = requestAnimationFrame(draw);

    const onResize = () => {
      resize();
      seed();
    };
    window.addEventListener("resize", onResize);

    const onVisibilityChange = () => {
      if (document.hidden) {
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
      } else if (!raf) {
        raf = requestAnimationFrame(draw);
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [count, isMobile, reduced]);

  return (
    <canvas ref={canvasRef} className="pointer-events-none absolute inset-0" aria-hidden />
  );
}
