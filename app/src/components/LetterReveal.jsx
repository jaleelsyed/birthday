import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StageButton from './ui/StageButton';
import ContinueLink from './ui/ContinueLink';
import SceneCopy from './ui/SceneCopy';

/**
 * Stage — the letter.
 *
 * The quiet beat before the finale. Everything else in the piece is
 * spectacle; this is one person talking to another. The seal cracks, the
 * flap falls open, the card rises out, and the lines arrive one at a time
 * at reading pace rather than all at once.
 */
export default function LetterReveal({ copy, signature, onAdvance, play, reduced }) {
  const [opened, setOpened] = useState(false);
  const [read, setRead] = useState(false);

  const lines = copy.body ?? [];

  const handleOpen = () => {
    play('wish');
    setOpened(true);
    // let the last line land before offering the way onward
    const settle = reduced ? 600 : 1400 + lines.length * 900;
    setTimeout(() => setRead(true), settle);
  };

  return (
    <div className="scene">
      {/* the room draws in around the letter */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-black"
        animate={{ opacity: opened ? 0.5 : 0 }}
        transition={{ duration: 1.4 }}
      />

      <div className="relative z-10 flex w-full flex-col items-center">
        <AnimatePresence mode="wait">
          {!opened ? (
            <motion.div
              key="envelope"
              className="flex flex-col items-center"
              exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.6 } }}
            >
              <svg viewBox="0 0 160 108" className="w-[min(56vw,16rem)]" aria-hidden>
                <defs>
                  <linearGradient id="envBody" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fdf6e9" />
                    <stop offset="100%" stopColor="#ecdcc4" />
                  </linearGradient>
                </defs>
                <rect x="2" y="14" width="156" height="92" rx="6" fill="url(#envBody)" />
                <path d="M2 20 L80 70 L158 20 L158 16 L80 64 L2 16 Z" fill="#d9c8ac" />
                <path d="M2 20 L80 70 L158 20" fill="none" stroke="#c9a35b" strokeWidth="1.2" opacity="0.7" />
                <circle cx="80" cy="70" r="13" fill="#7d2436" />
                <circle cx="80" cy="70" r="13" fill="none" stroke="#5b1a2b" strokeWidth="1.5" />
                <text
                  x="80"
                  y="75"
                  textAnchor="middle"
                  fontSize="12"
                  fill="#f3d9dd"
                  fontFamily="Cormorant Garamond, serif"
                >
                  ♥
                </text>
              </svg>

              <div className="mt-9">
                <SceneCopy title={copy.title} />
                <div className="mt-9">
                  <StageButton emoji="💌" onClick={handleOpen} delay={0.3}>
                    {copy.button}
                  </StageButton>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="letter"
              className="glass w-[min(90vw,42rem)] rounded-sm px-7 py-10 sm:px-12 sm:py-14"
              initial={{ opacity: 0, y: 60, rotateX: -12, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              style={{
                background:
                  'linear-gradient(160deg, rgba(253,246,233,0.97), rgba(240,226,203,0.94))',
                boxShadow: '0 28px 60px rgba(12,5,14,0.6)',
              }}
            >
              <div className="hairline mx-auto mb-8 w-24" />
              {lines.map((line, i) => (
                <motion.p
                  key={line}
                  className="script text-burgundy"
                  style={{
                    fontSize: 'clamp(1.25rem,0.9rem+1.9vw,2.1rem)',
                    lineHeight: 1.65,
                  }}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.9,
                    delay: reduced ? 0 : 0.8 + i * 0.9,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {line}
                </motion.p>
              ))}

              {signature && (
                <motion.p
                  className="script mt-8 text-right text-[color:var(--color-champagne)]"
                  style={{ fontSize: 'clamp(1.1rem,0.9rem+1.2vw,1.7rem)' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: reduced ? 0 : 1 + lines.length * 0.9, duration: 1 }}
                >
                  {signature}
                </motion.p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {read && (
            <motion.div
              className="mt-9"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9 }}
            >
              <ContinueLink onClick={onAdvance}>{copy.continueLabel}</ContinueLink>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
