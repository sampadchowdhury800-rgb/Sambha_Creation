'use client';

/* ══════════════════════════════════════════════════════════════
   SAMBHA CREATION — Ambient Canvas Particles
   Exact replica of the original AmbientCanvas from app.js
   ══════════════════════════════════════════════════════════════ */

import { useEffect, useRef } from 'react';
import { useTheme } from '@/components/ui/ThemeProvider';

export default function AmbientCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const themeRef = useRef(theme);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let animId: number;

    // ── Particle class ──
    class Particle {
      x = 0; y = 0; size = 0; speedY = 0; speedX = 0;
      opacity = 0; maxOpacity = 0; fadeSpeed = 0; fading = false;

      constructor(initial = true) { this.reset(initial); }

      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : height + 10;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedY = Math.random() * 0.35 + 0.1;
        this.speedX = (Math.random() - 0.5) * 0.2;
        this.opacity = 0;
        this.maxOpacity = Math.random() * 0.45 + 0.1;
        this.fadeSpeed = Math.random() * 0.006 + 0.002;
        this.fading = false;
      }

      update() {
        this.y -= this.speedY;
        this.x += this.speedX;
        if (!this.fading) {
          this.opacity = Math.min(this.opacity + this.fadeSpeed, this.maxOpacity);
          if (this.opacity >= this.maxOpacity) this.fading = true;
        } else {
          this.opacity -= this.fadeSpeed * 0.5;
        }
        if (this.y < -10 || this.opacity <= 0) this.reset();
      }

      draw() {
        const isDark = themeRef.current === 'dark';
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${isDark ? '122,140,94' : '74,94,58'},${this.opacity})`;
        ctx!.fill();
      }
    }

    // ── GlowOrb class ──
    class GlowOrb {
      index: number; cx = 0; cy = 0; radius = 0; color = '';
      opacityMax = 0; opacity = 0; phase = 0; speed = 0;
      offsetX = 0; offsetY = 0;

      constructor(index: number) { this.index = index; this.reset(); }

      reset() {
        const isDark = themeRef.current === 'dark';
        const configs = [
          { cx: 0.2, cy: 0.15, r: 0.3, color: isDark ? '30,80,160' : '74,94,58', opacityMax: isDark ? 0.12 : 0.06 },
          { cx: 0.8, cy: 0.75, r: 0.25, color: isDark ? '60,120,220' : '122,140,94', opacityMax: isDark ? 0.08 : 0.04 },
          { cx: 0.5, cy: 0.5, r: 0.2, color: isDark ? '20,60,140' : '74,94,58', opacityMax: isDark ? 0.05 : 0.03 },
        ];
        const c = configs[this.index % configs.length];
        this.cx = c.cx * width; this.cy = c.cy * height;
        this.radius = c.r * Math.max(width, height);
        this.color = c.color; this.opacityMax = c.opacityMax;
        this.opacity = 0; this.phase = Math.random() * Math.PI * 2;
        this.speed = 0.0004 + Math.random() * 0.0003;
        this.offsetX = 0; this.offsetY = 0;
      }

      update(t: number) {
        const cycle = Math.sin(t * this.speed + this.phase);
        this.opacity = this.opacityMax * (0.5 + 0.5 * cycle);
        this.offsetX = Math.cos(t * this.speed * 0.7 + this.phase) * width * 0.04;
        this.offsetY = Math.sin(t * this.speed * 0.9 + this.phase) * height * 0.04;
      }

      draw() {
        const gradient = ctx!.createRadialGradient(
          this.cx + this.offsetX, this.cy + this.offsetY, 0,
          this.cx + this.offsetX, this.cy + this.offsetY, this.radius
        );
        gradient.addColorStop(0, `rgba(${this.color},${this.opacity})`);
        gradient.addColorStop(1, `rgba(${this.color},0)`);
        ctx!.fillStyle = gradient;
        ctx!.beginPath();
        ctx!.arc(this.cx + this.offsetX, this.cy + this.offsetY, this.radius, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    const PARTICLE_COUNT = Math.min(60, Math.floor(width * height / 12000));
    const particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle(true));
    const orbs = [new GlowOrb(0), new GlowOrb(1), new GlowOrb(2)];

    function resize() {
      width = canvas!.width = window.innerWidth;
      height = canvas!.height = window.innerHeight;
      orbs.forEach((o) => o.reset());
    }

    function loop(t: number) {
      ctx!.clearRect(0, 0, width, height);
      orbs.forEach((o) => { o.update(t); o.draw(); });
      particles.forEach((p) => { p.update(); p.draw(); });
      animId = requestAnimationFrame(loop);
    }

    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 200) as unknown as number;
    };
    let resizeTimer: number;

    window.addEventListener('resize', handleResize);
    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <canvas id="ambient-canvas" ref={canvasRef} aria-hidden="true" />
      <div className="bg-overlay" aria-hidden="true" />
    </>
  );
}
