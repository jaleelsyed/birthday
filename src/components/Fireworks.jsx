import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StageButton from './ui/StageButton';
import { rand, randInt, pick, times } from '../lib/random';

/**
 * Stage 6 — light up the sky.
 * "One last thing…" opens onto a deep night sky where elegant fireworks
 * bloom in gold, blush, ivory and champagne, culminating in HAPPY BIRTHDAY.
 *
 * The canvas draws the stars + fireworks; Framer Motion handles the copy.
 */
export default function Fireworks({ copy, colors, name, signature, play, reduced }) {
  const [phase, setPhase] = useState('prelude'); // prelude → show
  const [showFinale, setShowFinale] = useState(false);
  const canvasRef = useRef(null);
  const activeRef = useRef(false);

  const begin = () => {
    setPhase('show');
    activeRef.current = true;
    setTimeout(() => setShowFinale(true), reduced ? 400 : 2600);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    let w = 0;
    let h = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let stars = [];
    let rockets = [];
    let sparks = [];
    let lastLaunch = 0;

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = times(Math.round((w * h) / 6500), () => ({
        x: rand(0, w),
        y: rand(0, h * 0.85),
        r: rand(0.3, 1.4),
        tw: rand(0.01, 0.04),
        p: rand(0, Math.PI * 2),
      }));
    };
    resize();
    window.addEventListener('resize', resize);

    const launch = () => {
      const targetY = rand(h * 0.12, h * 0.5);
      rockets.push({
        x: rand(w * 0.15, w * 0.85),
        y: h + 10,
        targetY,
        vy: -rand(7, 10),
        color: pick(colors),
      });
    };

    const explode = (x, y, color) => {
      play?.('firework');
      const count = reduced ? 26 : randInt(48, 78);
      const speed = rand(2.4, 4.2);
      for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2 + rand(-0.05, 0.05);
        const v = speed * rand(0.4, 1);
        sparks.push({
          x,
          y,
          vx: Math.cos(a) * v,
          vy: Math.sin(a) * v,
          life: 1,
          decay: rand(0.008, 0.018),
          color,
          size: rand(1.2, 2.4),
          twinkle: Math.random() < 0.3,
        });
      }
    };

    const frame = (t) => {
      // trail fade
      ctx.fillStyle = 'rgba(9,5,18,0.22)';
      ctx.fillRect(0, 0, w, h);

      // stars
      for (const s of stars) {
        s.p += s.tw;
        ctx.globalAlpha = 0.4 + 0.5 * Math.abs(Math.sin(s.p));
        ctx.fillStyle = '#fff6e0';
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      if (activeRef.current && !reduced && t - lastLaunch > rand(420, 820)) {
        launch();
        lastLaunch = t;
      }
      if (activeRef.current && reduced && sparks.length === 0 && rockets.length === 0) {
        // reduced motion: a few static bursts
        times(4, () => explode(rand(w * 0.2, w * 0.8), rand(h * 0.2, h * 0.5), pick(colors)));
      }

      // rockets
      ctx.lineWidth = 2;
      rockets = rockets.filter((r) => {
        r.y += r.vy;
        r.vy += 0.06;
        ctx.strokeStyle = r.color;
        ctx.globalAlpha = 0.9;
        ctx.beginPath();
        ctx.moveTo(r.x, r.y);
        ctx.lineTo(r.x, r.y + 10);
        ctx.stroke();
        if (r.y <= r.targetY || r.vy >= 0) {
          explode(r.x, r.y, r.color);
          return false;
        }
        return true;
      });
      ctx.globalAlpha = 1;

      // sparks
      sparks = sparks.filter((p) => {
        p.vx *= 0.985;
        p.vy *= 0.985;
        p.vy += 0.035; // gravity
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;
        if (p.life <= 0) return false;
        const flick = p.twinkle ? 0.5 + 0.5 * Math.sin(p.life * 40) : 1;
        ctx.globalAlpha = Math.max(0, p.life) * flick;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        return true;
      });
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [colors, play, reduced]);

  return (
    <div className="scene overflow-hidden">
      {/* deep night sky gradient beneath the canvas */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        initial={{ opacity: 0.4 }}
        animate={{ opacity: phase === 'show' ? 1 : 0.55 }}
        transition={{ duration: 1.6 }}
        style={{
          background:
            'radial-gradient(120% 90% at 50% 0%, #241634 0%, #14101f 45%, #08040f 100%)',
        }}
      />
      <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full" />

      <div className="relative z-10 flex flex-col items-center">
        <AnimatePresence mode="wait">
          {phase === 'prelude' && (
            <motion.div
              key="prelude"
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="script text-gold" style={{ fontSize: 'clamp(1.8rem,1rem+3vw,3.2rem)' }}>
                {copy.prelude}
              </p>
              <div className="mt-10">
                <StageButton emoji={copy.buttonEmoji} onClick={begin} delay={0.3}>
                  {copy.button}
                </StageButton>
              </div>
            </motion.div>
          )}

          {showFinale && (
            <motion.div
              key="finale"
              className="flex flex-col items-center"
              initial={{ opacity: 0, scale: 0.9, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.p
                className="eyebrow mb-4 text-champagne/80"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 1 }}
              >
                {name ? `For ${name}` : 'For you'}
              </motion.p>
              <h1
                className="headline gold-text animate-shimmer"
                style={{ fontSize: 'var(--text-hero)', lineHeight: 0.98 }}
              >
                {copy.finaleTitle}
                <span className="ml-3 align-middle" aria-hidden>{copy.finaleEmoji}</span>
              </h1>
              <div className="hairline mx-auto mt-7 w-40" />
              <motion.p
                className="mt-6 max-w-xl font-body font-300 text-ivory/80"
                style={{ fontSize: 'var(--text-lead)' }}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 1 }}
              >
                {copy.finaleLine}
              </motion.p>
              {signature && (
                <motion.p
                  className="script mt-6 text-rose"
                  style={{ fontSize: 'clamp(1.4rem,1rem+2vw,2.2rem)' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1, duration: 1 }}
                >
                  {signature}
                </motion.p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
