"use client";

import { useEffect, useRef } from "react";

type Piece = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  rot: number;
  vr: number;
  color: string;
  shape: 0 | 1 | 2;
};

const COLORS = ["#4381C7", "#071840", "#F6C945", "#FFFFFF", "#E6533C", "#7BB3E1", "#F3F6FB"];

export function ConfettiHandoff({
  origin,
  onDone,
}: {
  origin: { x: number; y: number; w: number; h: number };
  onDone: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const resize = () => {
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const ox = origin.x + origin.w / 2;
    const oy = origin.y + origin.h / 2;
    const pieces: Piece[] = Array.from({ length: 220 }, () => {
      const ang = Math.random() * Math.PI * 2;
      const spd = 8 + Math.random() * 22;
      return {
        x: ox,
        y: oy,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd - 6,
        w: 8 + Math.random() * 18,
        h: 6 + Math.random() * 14,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.5,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        shape: Math.floor(Math.random() * 3) as 0 | 1 | 2,
      };
    });

    let raf = 0;
    let start = 0;
    const draw = (t: number) => {
      if (!start) start = t;
      const elapsed = t - start;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (const p of pieces) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35;
        p.vx *= 0.992;
        p.rot += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        if (p.shape === 0) {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        } else if (p.shape === 1) {
          ctx.beginPath();
          ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.moveTo(0, -p.h / 2);
          ctx.lineTo(p.w / 2, p.h / 2);
          ctx.lineTo(-p.w / 2, p.h / 2);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      }
      if (elapsed < 2200) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    const done = window.setTimeout(() => onDone(), 2300);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(done);
    };
  }, [origin.h, origin.w, origin.x, origin.y, onDone]);

  const ox = origin.x + origin.w / 2;
  const oy = origin.y + origin.h / 2;

  return (
    <div
      ref={wrapRef}
      className="confetti-handoff"
      style={{ ["--ox" as string]: `${ox}px`, ["--oy" as string]: `${oy}px` }}
      aria-hidden
    >
      <img src="/confetti.jpg" alt="" className="confetti-still" />
      <canvas ref={canvasRef} className="confetti-canvas" />
    </div>
  );
}
