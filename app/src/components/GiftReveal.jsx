import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StageButton from './ui/StageButton';
import ContinueLink from './ui/ContinueLink';
import SceneCopy from './ui/SceneCopy';
import { rand, times } from '../lib/random';

/**
 * Stage — the gift.
 *
 * A tactile beat between the balloons and the cake: the bow pulls apart,
 * the lid lifts and tips away, and light climbs out of the box before the
 * message inside surfaces.
 */
export default function GiftReveal({ copy, onAdvance, play, reduced }) {
  const [opened, setOpened] = useState(false);
  const [showReveal, setShowReveal] = useState(false);

  const handleOpen = () => {
    play('cake');
    setOpened(true);
    setTimeout(() => {
      play('sparkle');
      setShowReveal(true);
    }, reduced ? 300 : 1500);
  };

  return (
    <div className="scene">
      <div className="relative z-10 flex flex-col items-center">
        <div className="relative w-[min(58vw,17rem)]">
          {/* light climbing out of the open box */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-[28%] h-[70%] w-[80%] -translate-x-1/2"
            style={{
              background:
                'radial-gradient(closest-side, rgba(255,232,175,0.85), rgba(255,226,160,0.25) 45%, transparent 75%)',
            }}
            initial={{ opacity: 0, scaleY: 0.3 }}
            animate={opened ? { opacity: [0, 1, 0.55], scaleY: [0.3, 1.5, 1.2] } : {}}
            transition={{ duration: 1.8, ease: 'easeOut' }}
          />

          {/* overflow must stay visible or the lid is clipped to a wedge
              as it lifts past the top of the viewBox */}
          <svg
            viewBox="0 0 120 120"
            className="relative w-full"
            style={{ overflow: 'visible' }}
            aria-hidden
          >
            <defs>
              <linearGradient id="giftBox" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fffaf1" />
                <stop offset="100%" stopColor="#ecdcc6" />
              </linearGradient>
              <linearGradient id="giftRibbon" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#b98d43" />
                <stop offset="45%" stopColor="#f0dca0" />
                <stop offset="100%" stopColor="#b98d43" />
              </linearGradient>
              <linearGradient id="giftLid" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fffdf8" />
                <stop offset="100%" stopColor="#efe0cb" />
              </linearGradient>
            </defs>

            {/* ground shadow, before the box so it sits under it */}
            <ellipse cx="60" cy="112" rx="46" ry="6" fill="rgba(20,8,20,0.5)" />

            {/* box body */}
            <rect x="16" y="50" width="88" height="56" rx="4" fill="url(#giftBox)" />
            <rect x="54" y="50" width="12" height="56" fill="url(#giftRibbon)" opacity="0.95" />

            {/* the open mouth, drawn over the body's top edge */}
            <motion.rect
              x="18"
              y="44"
              width="84"
              height="9"
              rx="2"
              fill="#2b1b30"
              initial={{ opacity: 0 }}
              animate={opened ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
            />

            {/* lid — lifts, tips, and drifts off */}
            <motion.g
              initial={{ y: 0, rotate: 0, x: 0 }}
              animate={opened ? { y: -52, rotate: -11, x: 14, opacity: 0.95 } : {}}
              transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            >
              <rect x="9" y="34" width="102" height="20" rx="4" fill="url(#giftLid)" />
              <rect x="9" y="40" width="102" height="8" fill="url(#giftRibbon)" opacity="0.95" />

              {/* bow */}
              <motion.g
                animate={opened ? { scale: [1, 1.14, 0.7], opacity: [1, 1, 0] } : {}}
                transition={{ duration: 0.9, ease: 'easeOut' }}
                style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
              >
                <path d="M60 34 C 40 20 26 26 32 36 C 36 42 52 38 60 34 Z" fill="url(#giftRibbon)" />
                <path d="M60 34 C 80 20 94 26 88 36 C 84 42 68 38 60 34 Z" fill="url(#giftRibbon)" />
                <circle cx="60" cy="34" r="6" fill="#f0dca0" />
                <circle cx="60" cy="34" r="2.6" fill="#b98d43" />
              </motion.g>
            </motion.g>
          </svg>

          {/* sparks lifting out of the box */}
          <AnimatePresence>
            {opened && !reduced && (
              <div className="pointer-events-none absolute inset-0">
                {times(20, (i) => (
                  <motion.span
                    key={i}
                    className="absolute block rounded-full"
                    style={{
                      left: `${rand(28, 72)}%`,
                      top: '42%',
                      width: rand(2, 4),
                      height: rand(2, 4),
                      background: '#ffeec0',
                      boxShadow: '0 0 10px 2px rgba(255,220,150,0.85)',
                    }}
                    initial={{ opacity: 0, y: 0, scale: 0.4 }}
                    animate={{ opacity: [0, 1, 0], y: -rand(90, 210), scale: 1 }}
                    transition={{ duration: rand(1.4, 2.4), delay: rand(0, 0.6), ease: 'easeOut' }}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-9">
          <AnimatePresence mode="wait">
            {!opened ? (
              <motion.div key="prompt" exit={{ opacity: 0, y: -18 }} transition={{ duration: 0.5 }}>
                <SceneCopy title={copy.title} emoji={copy.titleEmoji} />
                <div className="mt-9">
                  <StageButton emoji="🎁" onClick={handleOpen} delay={0.3}>
                    {copy.button}
                  </StageButton>
                </div>
              </motion.div>
            ) : showReveal ? (
              <motion.div
                key="reveal"
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              >
                <p
                  className="script text-gold"
                  style={{ fontSize: 'clamp(1.7rem,1rem+3.4vw,3.2rem)' }}
                >
                  {copy.revealTitle}
                </p>
                <div className="mt-7">
                  <ContinueLink onClick={onAdvance} delay={0.5}>
                    {copy.continueLabel}
                  </ContinueLink>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
