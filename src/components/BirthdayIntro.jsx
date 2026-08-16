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
        <motion.span
          className="mb-8 text-3xl"
          aria-hidden
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        >
          🕯️
        </motion.span>

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
