import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Cake, { CAKE_FRAME, CAKE_SHADOW, CAKE_FLOAT, CAKE_FLOAT_TRANSITION } from './Cake';
import WishReveal from './WishReveal';
import StageButton from './ui/StageButton';
import ContinueLink from './ui/ContinueLink';
import PetalBurst from './ambient/PetalBurst';
import Crackers from './ambient/Crackers';
import { rand, times } from '../lib/random';

/* Candle x positions as a share of the cake's 108-unit viewBox, so the
 * smoke lines up with the wicks at any size. */
const WICKS = [45 / 108, 54 / 108, 63 / 108];

/**
 * Stage 5 — make a wish.
 *
 * The blow-out is the emotional peak, so it gets the biggest reaction in
 * the piece: the flames snuff to smoke, petals are thrown into the air,
 * crackers pop around the cake, and the light lifts for a beat before the
 * room settles again and the wishes rise.
 */
export default function MakeAWish({ copy, wishes, petalColors, crackerColors, onAdvance, play, reduced }) {
  const [phase, setPhase] = useState('prompt'); // prompt → wishing → wishes → done
  const [candlesLit, setCandlesLit] = useState(true);
  const [blownOut, setBlownOut] = useState(false);

  const handleWish = () => {
    play('candle');
    setPhase('wishing');
    // candles flicker a moment, then go dark — and everything erupts
    setTimeout(() => {
      setCandlesLit(false);
      setBlownOut(true);
      play('sparkle');
    }, reduced ? 200 : 900);
    setTimeout(() => setPhase('wishes'), reduced ? 500 : 3600);
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

      {/* the room catches the light of the crackers for a moment */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(70% 55% at 50% 45%, rgba(255,226,160,0.4), transparent 70%)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: blownOut ? [0, 0.9, 0.25, 0] : 0 }}
        transition={{ duration: 2.6, times: [0, 0.12, 0.5, 1], ease: 'easeOut' }}
      />

      {/* Crackers sit behind the cake so they rim its silhouette with light. */}
      <AnimatePresence>
        {blownOut && (
          <motion.div key="crackers" className="absolute inset-0 z-0" exit={{ opacity: 0 }}>
            <Crackers
              colors={crackerColors}
              reduced={reduced}
              onPop={() => play('firework')}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 flex flex-col items-center">
        {/* The cake stays exactly where the previous stage left it — same
            frame, shadow and float — so the crossfade reads as one cake. */}
        <motion.div
          className={`relative ${CAKE_FRAME}`}
          animate={reduced ? undefined : CAKE_FLOAT}
          transition={CAKE_FLOAT_TRANSITION}
          style={{ filter: CAKE_SHADOW }}
        >
          <Cake candlesLit={candlesLit} reduced={reduced} />

          {/* smoke curling off each wick the instant the flames go out */}
          {!candlesLit && !reduced && (
            <div className="pointer-events-none absolute inset-0">
              {WICKS.map((frac, i) =>
                times(3, (j) => (
                  <motion.span
                    key={`${i}-${j}`}
                    className="absolute block rounded-full"
                    style={{
                      left: `${frac * 100}%`,
                      top: '23%',
                      width: 5 + j * 2,
                      height: 5 + j * 2,
                      background: 'rgba(226,214,226,0.5)',
                      filter: 'blur(3px)',
                    }}
                    initial={{ opacity: 0, y: 0, x: 0, scale: 0.5 }}
                    animate={{
                      opacity: [0, 0.55, 0],
                      y: -(40 + j * 26),
                      x: [0, j % 2 ? 7 : -7, j % 2 ? -5 : 5],
                      scale: [0.5, 1.5, 2.4],
                    }}
                    transition={{ duration: 2.2 + j * 0.4, delay: j * 0.18, ease: 'easeOut' }}
                  />
                ))
              )}
            </div>
          )}

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
        </motion.div>

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

      {/* Petals fly in front of everything — they're the thing being thrown. */}
      <AnimatePresence>
        {blownOut && (
          <motion.div
            key="petals"
            className="pointer-events-none absolute inset-0 z-20"
            exit={{ opacity: 0 }}
          >
            <PetalBurst colors={petalColors} reduced={reduced} />
          </motion.div>
        )}
      </AnimatePresence>

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
            <ContinueLink onClick={onAdvance}>{copy.continueLabel}</ContinueLink>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
