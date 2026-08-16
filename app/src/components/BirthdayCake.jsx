import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Cake, { CAKE_FRAME, CAKE_SHADOW, CAKE_FLOAT, CAKE_FLOAT_TRANSITION } from './Cake';
import StageButton from './ui/StageButton';
import ContinueLink from './ui/ContinueLink';
import SceneCopy from './ui/SceneCopy';

/**
 * Stage 4 — bring out the cake.
 * The room dims, a spotlight opens, and the cake rises into view.
 * "Made especially for you."
 *
 * The prompt and the cake live in separate AnimatePresence blocks so the
 * prompt can fade out *while* the cake rises, instead of the screen going
 * empty between the two.
 */
export default function BirthdayCake({ copy, onAdvance, play, reduced }) {
  const [presented, setPresented] = useState(false);
  const [showReveal, setShowReveal] = useState(false);

  const handlePresent = () => {
    play('cake');
    setPresented(true);
    setTimeout(() => setShowReveal(true), reduced ? 300 : 1900);
  };

  return (
    <div className="scene">
      {/* dimming vignette + spotlight once presented */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        animate={{ opacity: presented ? 1 : 0 }}
        transition={{ duration: 1.2 }}
        style={{ background: 'radial-gradient(circle at 50% 62%, transparent 20%, rgba(6,3,10,0.82))' }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[80vmin] w-[70vmin]
                   -translate-x-1/2 -translate-y-1/2"
        animate={{ opacity: presented ? 1 : 0 }}
        transition={{ duration: 1.4 }}
        style={{
          background:
            'radial-gradient(circle, rgba(255,224,158,0.22), rgba(255,224,158,0.05) 42%, transparent 68%)',
        }}
      />

      <div className="relative z-10 flex flex-col items-center">
        {/* the invitation — fades up and away as the cake arrives */}
        <AnimatePresence>
          {!presented && (
            <motion.div
              key="prompt"
              className="absolute inset-x-0 top-1/2 -translate-y-1/2"
              exit={{ opacity: 0, y: -28, transition: { duration: 0.6, ease: 'easeInOut' } }}
            >
              <SceneCopy title={copy.title} emoji={copy.titleEmoji} />
              <div className="mt-11">
                <StageButton emoji="🎂" onClick={handlePresent} delay={0.3}>
                  {copy.button}
                </StageButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* the cake — rises in as the prompt leaves */}
        <AnimatePresence>
          {presented && (
            <motion.div
              key="cake"
              className="flex flex-col items-center"
              initial={{ y: 130, opacity: 0, scale: 0.92 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.div
                className={CAKE_FRAME}
                animate={reduced ? undefined : CAKE_FLOAT}
                transition={CAKE_FLOAT_TRANSITION}
                style={{ filter: CAKE_SHADOW }}
              >
                <Cake candlesLit reduced={reduced} />
              </motion.div>

              <AnimatePresence>
                {showReveal && (
                  <motion.div
                    className="mt-8 flex flex-col items-center"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                  >
                    <p className="script text-gold" style={{ fontSize: 'clamp(2rem,1rem+4vw,3.6rem)' }}>
                      {copy.revealTitle} {copy.revealEmoji}
                    </p>
                    <div className="mt-7">
                      <ContinueLink onClick={onAdvance} delay={0.5}>
                        {copy.continueLabel}
                      </ContinueLink>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
