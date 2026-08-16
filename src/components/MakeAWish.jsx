import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Cake from './Cake';
import WishReveal from './WishReveal';
import StageButton from './ui/StageButton';
import { rand, times } from '../lib/random';

/**
 * Stage 5 — make a wish.
 * The candles flicker and go out, magical particles lift from the cake,
 * and the wishes rise one by one before the closing blessing.
 */
export default function MakeAWish({ copy, wishes, onAdvance, play, reduced }) {
  const [phase, setPhase] = useState('prompt'); // prompt → wishing → wishes → done
  const [candlesLit, setCandlesLit] = useState(true);

  const handleWish = () => {
    play('candle');
    setPhase('wishing');
    // candles flicker a moment, then go dark
    setTimeout(() => {
      setCandlesLit(false);
      play('sparkle');
    }, reduced ? 200 : 900);
    setTimeout(() => setPhase('wishes'), reduced ? 500 : 2200);
  };

  const darker = phase !== 'prompt';

  return (
    <div className="scene">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-black"
        animate={{ opacity: darker ? 0.55 : 0 }}
        transition={{ duration: 1.4 }}
      />

      <div className="relative z-10 flex flex-col items-center">
        {/* the cake stays centered through the wish */}
        <div className="relative w-[min(66vw,20rem)]" style={{ filter: 'drop-shadow(0 22px 34px rgba(20,8,20,0.6))' }}>
          <Cake candlesLit={candlesLit} reduced={reduced} />

          {/* particles rising from the cake once the wish is made */}
          <AnimatePresence>
            {phase === 'wishing' && !reduced && (
              <div className="pointer-events-none absolute inset-0">
                {times(26, (i) => (
                  <motion.span
                    key={i}
                    className="absolute block h-1.5 w-1.5 rounded-full"
                    style={{
                      left: `${rand(20, 80)}%`,
                      top: '30%',
                      background: 'rgba(255,236,180,0.95)',
                      boxShadow: '0 0 10px 2px rgba(255,216,140,0.8)',
                    }}
                    initial={{ opacity: 0, y: 0, scale: 0.4 }}
                    animate={{ opacity: [0, 1, 0], y: -rand(120, 260), scale: 1 }}
                    transition={{ duration: rand(1.6, 2.6), delay: rand(0, 0.8), ease: 'easeOut' }}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          {phase === 'prompt' && (
            <motion.div
              key="prompt"
              className="mt-10 flex flex-col items-center"
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="headline gold-text" style={{ fontSize: 'var(--text-title)' }}>
                {copy.title} <span aria-hidden>{copy.titleEmoji}</span>
              </h2>
              <div className="mt-9">
                <StageButton emoji="✨" onClick={handleWish} delay={0.2}>
                  {copy.button}
                </StageButton>
              </div>
            </motion.div>
          )}

          {phase === 'wishing' && (
            <motion.p
              key="hush"
              className="script mt-10 text-gold"
              style={{ fontSize: 'clamp(1.6rem,1rem+3vw,3rem)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.6] }}
              transition={{ duration: 2 }}
            >
              Close your eyes…
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {(phase === 'wishes' || phase === 'done') && (
        <WishReveal
          wishes={wishes}
          closing={copy.closing}
          play={play}
          onComplete={() => setPhase('done')}
        />
      )}

      <AnimatePresence>
        {phase === 'done' && (
          <motion.div
            className="absolute inset-x-0 bottom-[6%] z-20 flex justify-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
          >
            <StageButton emoji="✨" onClick={onAdvance}>
              Light Up the Sky
            </StageButton>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
