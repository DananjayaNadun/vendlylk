import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/theme/useReducedMotion';

/**
 * The radiating "data burst" behind the hero's call to action.
 *
 * Rays are emitted continuously from a point just below the bottom edge, each
 * growing outward with a bright tip riding at its head, then respawning. The
 * outer edge is domed rather than square so the shape reads as a fan rather
 * than a starburst filling the frame.
 *
 * Plain Canvas 2D rather than three: this is a few hundred straight lines, and
 * three is already a heavy dependency here — 2D costs nothing extra and draws
 * this faster than a WebGL scene graph would. Web only, by extension: the
 * sibling RayBurst.tsx renders nothing on native.
 */
const RAYS = 620;
/** Ray colour at the tip — the site's accentLight. */
const ACCENT = [110, 133, 255] as const;

type Ray = { a: number; len: number; speed: number; t: number; w: number; bright: number };

function rnd(a: number, b: number) {
  return a + Math.random() * (b - a);
}

function spawn(r: Ray, stagger: boolean) {
  r.a = -Math.PI + Math.random() * Math.PI;
  /* Longer toward the vertical, shorter toward the horizon, which is what
     domes the outer edge instead of letting rays reach the corners. */
  r.len = rnd(0.3, 1) * (0.72 + 0.28 * Math.abs(Math.sin(r.a)));
  r.speed = rnd(0.16, 0.5);
  r.t = stagger ? Math.random() : 0;
  r.w = rnd(0.5, 1.5);
  r.bright = rnd(0.35, 1);
}

export function RayBurst({ opacity = 1 }: { opacity?: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let frame = 0;
    /* Off-screen the loop is parked: this sits in a landing page that scrolls
       far past it, and a canvas repainting 600 lines behind the fold is pure
       battery cost. */
    let onScreen = true;
    const rays: Ray[] = Array.from({ length: RAYS }, () => {
      const r = {} as Ray;
      spawn(r, true);
      return r;
    });

    const measure = () => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return false;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return true;
    };

    const draw = (dt: number) => {
      ctx.clearRect(0, 0, width, height);
      const ox = width / 2;
      const oy = height * 1.02;
      const reach = height * 0.95;

      const bloom = ctx.createRadialGradient(ox, oy, 0, ox, oy, height * 0.42);
      bloom.addColorStop(0, 'rgba(190,205,255,0.30)');
      bloom.addColorStop(0.45, 'rgba(140,160,255,0.09)');
      bloom.addColorStop(1, 'rgba(140,160,255,0)');
      ctx.fillStyle = bloom;
      ctx.fillRect(0, 0, width, height);

      for (const r of rays) {
        r.t += r.speed * dt;
        if (r.t >= 1) {
          spawn(r, false);
          continue;
        }
        const rad = r.t * r.len * reach;
        // Snap in, ease out, so tips read as travelling rather than blinking.
        const life = Math.min(1, r.t * 6) * (1 - Math.pow(r.t, 2.2));
        const x = ox + Math.cos(r.a) * rad;
        const y = oy + Math.sin(r.a) * rad;

        const grad = ctx.createLinearGradient(ox, oy, x, y);
        grad.addColorStop(0, `rgba(255,255,255,${0.3 * life})`);
        grad.addColorStop(1, `rgba(${ACCENT[0]},${ACCENT[1]},${ACCENT[2]},${0.62 * life * r.bright})`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = r.w;
        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.lineTo(x, y);
        ctx.stroke();

        ctx.fillStyle = `rgba(255,255,255,${life * r.bright})`;
        ctx.beginPath();
        ctx.arc(x, y, r.w * 1.15, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = () => {
      if (onScreen) draw(1 / 60);
      frame = window.requestAnimationFrame(loop);
    };

    /* The element has no size on the first commit, so paint is driven by the
       observer's first callback rather than assumed to be ready here. */
    const resizeObserver = new ResizeObserver(() => {
      if (measure() && reduced) draw(0);
    });
    resizeObserver.observe(canvas);

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        onScreen = entries.some((e) => e.isIntersecting);
      },
      { rootMargin: '120px' },
    );
    intersectionObserver.observe(canvas);

    measure();
    if (reduced) draw(0);
    else loop();

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, [reduced]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', opacity }}
    />
  );
}
