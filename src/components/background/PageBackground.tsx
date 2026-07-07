"use client";

import { useEffect, useRef } from "react";
import { m } from "framer-motion";
import { useIsMobile, usePrefersReducedMotion } from "@/lib/hooks";

type Particle = {
  type: "violet" | "teal" | "shimmer";
  x: number;
  y: number;
  r: number;
  speed: number;
  drift: number;
  phase: number;
  twinkle: number;
};

const NOISE_SVG = `data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E`;

export default function PageBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isMobile = useIsMobile();
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: false });
    if (!ctx) return;

    let raf = 0;
    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Half particles on mobile
    const countViolet = isMobile ? 10 : 18;
    const countTeal = isMobile ? 10 : 18;
    const countShimmer = isMobile ? 15 : 25;

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
      particles = [];
      
      const addParticles = (type: Particle["type"], count: number) => {
        for (let i = 0; i < count; i++) {
          particles.push({
            type,
            x: Math.random() * width,
            y: Math.random() * height,
            r: type === "shimmer" ? 0.5 + Math.random() : 0.5 + Math.random() * 1.5,
            speed: type === "shimmer" ? 0 : 0.15 + Math.random() * 0.45,
            drift: type === "shimmer" ? 0 : (Math.random() - 0.5) * 0.3,
            phase: Math.random() * Math.PI * 2,
            twinkle: 0.6 + Math.random() * 1.4,
          });
        }
      };

      addParticles("violet", countViolet);
      addParticles("teal", countTeal);
      addParticles("shimmer", countShimmer);
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const t = performance.now() * 0.001;
      for (const p of particles) {
        if (p.type !== "shimmer") {
          p.y -= p.speed;
          p.x += p.drift;
          if (p.y < -4) {
            p.y = height + 4;
            p.x = Math.random() * width;
          }
          if (p.x < -4) p.x = width + 4;
          if (p.x > width + 4) p.x = -4;
        }

        const alpha = 0.25 + 0.35 * (0.5 + 0.5 * Math.sin(t * p.twinkle + p.phase));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        
        if (p.type === "violet") {
          ctx.fillStyle = `rgba(94, 45, 145, ${alpha})`;
        } else if (p.type === "teal") {
          ctx.fillStyle = `rgba(61, 214, 203, ${alpha})`;
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 1.5})`;
        }
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    resize();
    seed();

    if (reduced) {
      // Draw static frame
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        if (p.type === "violet") ctx.fillStyle = "rgba(94, 45, 145, 0.3)";
        else if (p.type === "teal") ctx.fillStyle = "rgba(61, 214, 203, 0.3)";
        else ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
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

    const onVisibilityChange = () => {
      if (document.hidden) {
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
      } else if (!reduced && !raf) {
        raf = requestAnimationFrame(draw);
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [isMobile, reduced]);

  const orbs = [
    {
      size: 1000,
      color: "rgba(94, 45, 145, 0.08)", // violet
      top: "-20%",
      left: "-10%",
      animate: { x: [0, 100, -50, 0], y: [0, 50, 100, 0] },
      duration: 25,
    },
    {
      size: 1200,
      color: "rgba(61, 214, 203, 0.05)", // teal
      top: "40%",
      left: "-30%",
      animate: { x: [0, 150, 50, 0], y: [0, -100, -50, 0] },
      duration: 30,
    },
    {
      size: 900,
      color: "rgba(94, 45, 145, 0.06)", // violet
      top: "-10%",
      left: "60%",
      animate: { x: [0, -100, -150, 0], y: [0, 100, 50, 0] },
      duration: 28,
    },
    {
      size: 1100,
      color: "rgba(61, 214, 203, 0.04)", // teal
      top: "60%",
      left: "50%",
      animate: { x: [0, -150, 50, 0], y: [0, -100, 100, 0] },
      duration: 35,
    },
    {
      size: 800,
      color: "rgba(45, 17, 82, 0.05)", // deep violet
      top: "20%",
      left: "20%",
      animate: { scale: [1, 1.2, 0.9, 1], x: [0, 50, -50, 0], y: [0, 50, -50, 0] },
      duration: 22,
    },
  ];

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-white"
    >
      {/* 5 Gradient Orbs */}
      {orbs.map((orb, i) => {
        if (reduced) {
          return (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: orb.size,
                height: orb.size,
                background: orb.color,
                filter: "blur(100px)",
                top: orb.top,
                left: orb.left,
              }}
            />
          );
        }
        return (
          <m.div
            key={i}
            className="absolute rounded-full will-change-transform"
            style={{
              width: orb.size,
              height: orb.size,
              background: orb.color,
              filter: "blur(100px)",
              top: orb.top,
              left: orb.left,
            }}
            animate={orb.animate}
            transition={{
              duration: orb.duration,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            }}
          />
        );
      })}

      {/* Particle Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Noise Texture Overlay */}
      <div
        className="absolute inset-0 mix-blend-overlay will-change-transform"
        style={{
          backgroundImage: `url("${NOISE_SVG}")`,
          backgroundRepeat: "repeat",
          opacity: 0.03,
          animation: reduced ? "none" : "noiseShift 8s steps(10) infinite",
        }}
      />
    </div>
  );
}
