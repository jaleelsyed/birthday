import { useEffect, useRef } from 'react';
import { rand, times } from '../../lib/random';

/**
 * A persistent canvas of drifting golden motes + occasional falling petals.
 * `density` and `petals` scale with the stage so the air feels busier as
 * the celebration builds. Respects prefers-reduced-motion.
 */
const FALLBACK_PETALS = ['#F3D9DD', '#D99AA6', '#E9CF95', '#FBE7B5'];

export default function SparkleField({
  density = 0.7,
  petals = false,
  colors,
  reduced = false,
}) {
  const canvasRef = useRef(null);
  const stateRef = useRef({ density, petals, reduced, colors });
  stateRef.current = { density, petals, reduced, colors };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let raf;
    let w = 0;
    let h = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const petalPalette = () => stateRef.current.colors?.length
      ? stateRef.current.colors
      : FALLBACK_PETALS;

    const makeMote = () => ({
      kind: 'mote',
      x: rand(0, w),
      y: rand(0, h),
      r: rand(0.6, 2.2),
      vx: rand(-0.12, 0.12),
      vy: rand(-0.35, -0.05),
      a: rand(0.2, 0.9),
      tw: rand(0.005, 0.02),
      tp: rand(0, Math.PI * 2),
    });

    const makePetal = () => ({
      kind: 'petal',
      x: rand(0, w),
      y: rand(-40, -4),
      r: rand(5, 11),
      vx: rand(-0.35, 0.35),
      vy: rand(0.5, 1.3),
      rot: rand(0, Math.PI * 2),
      vr: rand(-0.02, 0.02),
      a: rand(0.5, 0.9),
      color: (() => {
        const p = petalPalette();
        return p[Math.floor(Math.random() * p.length)];
      })(),
      sway: rand(0.4, 1.2),
      sp: rand(0, Math.PI * 2),
    });

    let motes = [];
    let petalArr = [];

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const target = Math.round((w * h) / 14000 * stateRef.current.density);
      motes = times(Math.max(12, target), makeMote);
    };

    resize();
    window.addEventListener('resize', resize);

    const drawPetal = (p) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = p.a;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.r, p.r * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const frame = () => {
      const { petals: showPetals, reduced: isReduced } = stateRef.current;
      ctx.clearRect(0, 0, w, h);

      // golden motes
      for (const m of motes) {
        m.tp += m.tw;
        if (!isReduced) {
          m.x += m.vx;
          m.y += m.vy;
          if (m.y < -6) { m.y = h + 6; m.x = rand(0, w); }
          if (m.x < -6) m.x = w + 6;
          if (m.x > w + 6) m.x = -6;
        }
        const alpha = m.a * (0.55 + 0.45 * Math.sin(m.tp));
        ctx.globalAlpha = alpha;
        const g = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.r * 4);
        g.addColorStop(0, 'rgba(255,244,214,0.95)');
        g.addColorStop(0.4, 'rgba(233,207,149,0.6)');
        g.addColorStop(1, 'rgba(233,207,149,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r * 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // petals
      if (showPetals && !isReduced) {
        if (petalArr.length < 26 && Math.random() < 0.4) petalArr.push(makePetal());
        for (const p of petalArr) {
          p.sp += 0.02;
          p.x += p.vx + Math.sin(p.sp) * p.sway;
          p.y += p.vy;
          p.rot += p.vr;
          drawPetal(p);
        }
        petalArr = petalArr.filter((p) => p.y < h + 30);
      } else if (petalArr.length) {
        petalArr = [];
      }

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    };

    frame();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
