import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CornerFlorals from './ambient/CornerFlorals';
import ContinueLink from './ui/ContinueLink';
import { times } from '../lib/random';

const CEILING = times(5, (i) => i);
const FAIRY = times(22, (i) => i);

/**
 * Stage 2 — the room wakes up.
 * Ceiling pendants ignite one by one, fairy lights glow, candles catch,
 * and the darkness lifts. Then: "Because today is your day."
 */
export default function RoomLighting({ copy, onAdvance, play, reduced }) {
  const [lit, setLit] = useState(reduced ? 5 : 0);
  const [phase, setPhase] = useState(reduced ? 'reveal' : 'lighting');

  useEffect(() => {
    if (reduced) return;
    const timers = [];
    CEILING.forEach((_, i) => {
      timers.push(
        setTimeout(() => {
          setLit((n) => n + 1);
          play('lights');
        }, 500 + i * 520)
      );
    });
    timers.push(setTimeout(() => setPhase('reveal'), 500 + CEILING.length * 520 + 900));
    return () => timers.forEach(clearTimeout);
  }, [reduced, play]);

  const brightness = lit / CEILING.length;

  return (
    <div className="scene overflow-hidden">
      {/* darkness that lifts as lights come on */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(circle at 50% 30%, transparent, rgba(6,3,10,0.92))' }}
        animate={{ opacity: 1 - brightness * 0.85 }}
        transition={{ duration: 0.8 }}
      />

      <CornerFlorals dim={0.4 + brightness * 0.6} />

      {/* ceiling pendant lights */}
      <div className="absolute left-0 right-0 top-[7%] flex justify-center gap-[9vw]">
        {CEILING.map((i) => {
          const on = i < lit;
          return (
            <div key={i} className="flex flex-col items-center">
              <div className="h-[7vh] w-px bg-gradient-to-b from-champagne/50 to-transparent" />
              <motion.div
                className="relative h-5 w-5 rounded-full"
                animate={{
                  backgroundColor: on ? '#ffe9b0' : '#2a2130',
                  boxShadow: on
                    ? '0 0 34px 10px rgba(255,222,150,0.65)'
                    : '0 0 0 0 rgba(0,0,0,0)',
                }}
                transition={{ duration: 0.6 }}
              />
            </div>
          );
        })}
      </div>

      {/* fairy light string */}
      <svg
        className="absolute left-0 right-0 top-[22%] w-full"
        height="70"
        viewBox="0 0 100 70"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          d="M -5 10 Q 25 60 50 26 T 105 12"
          fill="none"
          stroke="rgba(201,163,91,0.35)"
          strokeWidth="1.4"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className="absolute left-0 right-0 top-[22%] flex justify-between px-[4vw]">
        {FAIRY.map((i) => (
          <motion.span
            key={i}
            className="block h-2 w-2 rounded-full"
            style={{ marginTop: `${18 + Math.sin(i * 0.9) * 14}px` }}
            animate={{
              opacity: brightness > 0.4 ? [0.4, 1, 0.55] : 0.12,
              backgroundColor: brightness > 0.4 ? '#ffdf9e' : '#3a2f42',
              boxShadow:
                brightness > 0.4 ? '0 0 10px 2px rgba(255,215,140,0.8)' : 'none',
            }}
            transition={{
              duration: 2 + (i % 5) * 0.4,
              repeat: Infinity,
              repeatType: 'reverse',
              delay: i * 0.08,
            }}
          />
        ))}
      </div>

      {/* candles along the base */}
      <div className="absolute bottom-[8%] left-1/2 flex -translate-x-1/2 items-end gap-6">
        {times(5, (i) => (
          <div key={i} className="flex flex-col items-center">
            <AnimatePresence>
              {phase !== 'lighting' || lit > i + 1 ? (
                <motion.span
                  initial={{ opacity: 0, scaleY: 0.2 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  className="mb-[-2px] block h-4 w-2 rounded-full bg-[#ffd27a] animate-flicker"
                  style={{ boxShadow: '0 0 16px 5px rgba(255,190,110,0.7)', filter: 'blur(0.3px)' }}
                />
              ) : null}
            </AnimatePresence>
            <div className="h-14 w-3 rounded-t-sm bg-gradient-to-b from-ivory to-blush/80" />
          </div>
        ))}
      </div>

      {/* copy */}
      <div className="relative z-10 max-w-3xl">
        <AnimatePresence mode="wait">
          {phase === 'lighting' ? (
            <motion.h2
              key="lighting"
              className="headline text-ivory"
              style={{ fontSize: 'var(--text-title)' }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.8 }}
            >
              {copy.duringTitle}
            </motion.h2>
          ) : (
            <motion.div
              key="reveal"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center"
            >
              <h2 className="headline gold-text" style={{ fontSize: 'var(--text-title)' }}>
                {copy.revealTitle}
              </h2>
              <div className="mt-9">
                <ContinueLink onClick={onAdvance} delay={0.5}>
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
