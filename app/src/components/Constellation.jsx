import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StageButton from './ui/StageButton';
import ContinueLink from './ui/ContinueLink';
import SceneCopy from './ui/SceneCopy';
import { rand, times } from '../lib/random';

/**
 * Stage — their constellation.
 *
 * The name is not drawn as text over a starfield. It is sampled: the name
 * is rendered to an offscreen canvas, the filled pixels are read back, and
 * a star is placed at a scatter of those positions — so the letters are
 * genuinely made of stars, and each one twinkles on its own. Nearest
 * neighbours are then linked with hairlines, the way a star chart does it.
 *
 * It writes itself left to right, at the pace of someone tracing it.
 */

/** Read the name's filled pixels back out of an offscreen canvas. */
function sampleNamePoints(name, w, h) {
  const off = document.createElement('canvas');
  off.width = w;
  off.height = h;
  const ctx = off.getContext('2d', { willReadFrequently: true });

  // Fit the name to the box, with headroom for descenders.
  const size = Math.min((w * 1.25) / Math.max(name.length, 3), h * 0.52);
  ctx.font = `600 ${size}px "Cormorant Garamond", Georgia, serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#fff';
  ctx.fillText(name, w / 2, h / 2);

  const { data } = ctx.getImageData(0, 0, w, h);
  const step = Math.max(2, Math.round(w / 320));
  const found = [];
  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      if (data[(y * w + x) * 4 + 3] > 130 && Math.random() < 0.5) {
        found.push({ x, y });
      }
    }
  }

  // Cap the count, then order left-to-right so it writes rather than blinks in.
  const capped = found.sort(() => Math.random() - 0.5).slice(0, 300);
  return capped.sort((a, b) => a.x - b.x);
}

/** Link each star to its nearest neighbour — a chart's hairlines. */
function buildLinks(points, maxDist) {
  const links = [];
  points.forEach((p, i) => {
    let best = null;
    let bestD = Infinity;
    for (let j = 0; j < points.length; j++) {
      if (i === j) continue;
      const q = points[j];
      const d = (p.x - q.x) ** 2 + (p.y - q.y) ** 2;
      if (d < bestD) {
        bestD = d;
        best = j;
      }
    }
    if (best !== null && Math.sqrt(bestD) < maxDist) {
      links.push({ a: i, b: best });
    }
  });
  return links;
}

export default function Constellation({ copy, name, onAdvance, play, reduced }) {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const drawingRef = useRef(false);

  const begin = () => {
    play('wish');
    setDrawing(true);
    drawingRef.current = true;
    setTimeout(() => setRevealed(true), reduced ? 400 : 3400);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    let w = 0;
    let h = 0;
    let backdrop = [];
    let points = [];
    let links = [];
    let startedAt = null;

    const build = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      backdrop = times(Math.round((w * h) / 5200), () => ({
        x: rand(0, w),
        y: rand(0, h),
        r: rand(0.3, 1.3),
        p: rand(0, Math.PI * 2),
        s: rand(0.008, 0.03),
      }));

      // Sample the name across the middle band of the screen.
      const bandH = Math.min(h * 0.34, 260);
      const raw = sampleNamePoints(name || 'You', Math.round(w), Math.round(bandH));
      const offsetY = h * 0.4 - bandH / 2;
      points = raw.map((p) => ({
        x: p.x,
        y: p.y + offsetY,
        r: rand(0.6, 1.5),
        p: rand(0, Math.PI * 2),
        s: rand(0.02, 0.06),
      }));
      links = buildLinks(points, Math.max(16, w / 44));
    };

    // Wait for the display face, or the sampled shape is the fallback serif.
    let cancelled = false;
    const ready = document.fonts?.ready ?? Promise.resolve();
    ready.then(() => {
      if (cancelled) return;
      build();
    });

    const onResize = () => build();
    window.addEventListener('resize', onResize);

    const frame = (t) => {
      ctx.clearRect(0, 0, w, h);

      // backdrop stars
      for (const s of backdrop) {
        s.p += s.s;
        ctx.globalAlpha = 0.25 + 0.4 * Math.abs(Math.sin(s.p));
        ctx.fillStyle = '#fff6e0';
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      if (drawingRef.current && points.length) {
        if (startedAt === null) startedAt = t;
        const elapsed = (t - startedAt) / 1000;
        const writeFor = reduced ? 0.01 : 2.6;
        const progress = Math.min(1, elapsed / writeFor);
        const shown = Math.floor(points.length * progress);

        // hairlines, fading in behind the stars
        const linkAlpha = Math.max(0, Math.min(1, (elapsed - writeFor * 0.55) / 1.2));
        if (linkAlpha > 0) {
          ctx.strokeStyle = `rgba(233,207,149,${0.2 * linkAlpha})`;
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          for (const l of links) {
            if (l.a < shown && l.b < shown) {
              ctx.moveTo(points[l.a].x, points[l.a].y);
              ctx.lineTo(points[l.b].x, points[l.b].y);
            }
          }
          ctx.stroke();
        }

        for (let i = 0; i < shown; i++) {
          const p = points[i];
          p.p += p.s;
          const twinkle = 0.55 + 0.45 * Math.sin(p.p);
          // a brief flare as each star lands
          const age = progress * points.length - i;
          const flare = age < 5 ? 1 + (5 - age) * 0.22 : 1;

          ctx.globalAlpha = twinkle;
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 2.6 * flare);
          g.addColorStop(0, 'rgba(255,251,235,1)');
          g.addColorStop(0.3, 'rgba(245,228,175,0.8)');
          g.addColorStop(1, 'rgba(233,207,149,0)');
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 2.6 * flare, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, [name, reduced]);

  return (
    <div className="scene">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        animate={{ opacity: drawing ? 1 : 0.75 }}
        transition={{ duration: 1.6 }}
        style={{
          background:
            'radial-gradient(125% 95% at 50% 10%, #241634 0%, #120d1e 48%, #07040d 100%)',
        }}
      />
      <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full" />

      <div className="relative z-10 flex w-full flex-col items-center">
        <AnimatePresence mode="wait">
          {!drawing && (
            <motion.div
              key="prompt"
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center"
            >
              <SceneCopy title={copy.title} lead={copy.lead} />
              <div className="mt-10">
                <StageButton emoji="⭐" onClick={begin} delay={0.3}>
                  {copy.button}
                </StageButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* the caption sits low so the stars keep the middle of the frame */}
        <AnimatePresence>
          {revealed && (
            <motion.div
              key="caption"
              className="absolute inset-x-0 top-[62%] flex flex-col items-center px-6"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="eyebrow text-champagne/80">{copy.revealTitle}</p>
              <div className="hairline mx-auto mt-5 w-32" />
              <p className="script mt-5 text-gold" style={{ fontSize: 'clamp(1.3rem,1rem+1.8vw,2.1rem)' }}>
                {copy.caption}
              </p>
              <div className="mt-7">
                <ContinueLink onClick={onAdvance} delay={0.4}>
                  {copy.continueLabel}
                </ContinueLink>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
