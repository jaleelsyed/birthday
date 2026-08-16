import { motion } from 'framer-motion';
import CornerFlorals from './ambient/CornerFlorals';
import StageButton from './ui/StageButton';
import SceneCopy from './ui/SceneCopy';

/**
 * Stage 1 — the invitation.
 * A candlelit room, florals at the corners, and the glowing "Let's Start".
 */
export default function BirthdayIntro({ copy, onAdvance }) {
  return (
    <div className="scene">
      <CornerFlorals dim={0.9} />

      {/* soft central pool of light */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin]
                   -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70"
        style={{
          background:
            'radial-gradient(circle, rgba(233,207,149,0.18), rgba(233,207,149,0.04) 45%, transparent 70%)',
        }}
      />

      <div className="relative z-10 flex flex-col items-center">
        {/* A drawn candle, not the emoji — it has to sit in the same world
            as the cake's candles, and emoji render differently per platform. */}
        <motion.svg
          className="mb-9 w-8"
          viewBox="0 0 24 54"
          aria-hidden
          animate={{ y: [0, -7, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <defs>
            <radialGradient id="introFlame" cx="50%" cy="32%" r="70%">
              <stop offset="0%" stopColor="#fff4c6" />
              <stop offset="55%" stopColor="#ffb64a" />
              <stop offset="100%" stopColor="#ff7a2f" />
            </radialGradient>
            <radialGradient id="introGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(255,201,120,0.85)" />
              <stop offset="100%" stopColor="rgba(255,201,120,0)" />
            </radialGradient>
          </defs>
          <circle cx="12" cy="12" r="12" fill="url(#introGlow)" />
          <g className="origin-bottom animate-flicker" style={{ transformBox: 'fill-box' }}>
            <ellipse cx="12" cy="11" rx="3" ry="7.5" fill="url(#introFlame)" />
            <ellipse cx="12" cy="13" rx="1.4" ry="3.6" fill="#fff8e0" />
          </g>
          <line x1="12" y1="20" x2="12" y2="17" stroke="#3a2a1a" strokeWidth="1.1" />
          <rect x="8.4" y="20" width="7.2" height="28" rx="2.4" fill="#f6e7d2" />
          <rect x="8.4" y="20" width="2.4" height="28" fill="#ffffff" opacity="0.45" />
          <ellipse cx="12" cy="48" rx="9" ry="3" fill="#c9a35b" opacity="0.85" />
        </motion.svg>

        <SceneCopy eyebrow={copy.eyebrow} lead={copy.lead} />

        <div className="mt-12">
          <StageButton emoji={copy.buttonEmoji} onClick={onAdvance} delay={0.5}>
            {copy.button}
          </StageButton>
        </div>

        <motion.p
          className="mt-8 font-body text-xs tracking-[0.3em] text-ivory/40 uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 1 }}
        >
          Turn your sound on ♪
        </motion.p>
      </div>
    </div>
  );
}
