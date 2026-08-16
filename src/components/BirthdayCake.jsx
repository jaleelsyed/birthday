import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Cake from './Cake';
import StageButton from './ui/StageButton';
import SceneCopy from './ui/SceneCopy';

/**
 * Stage 4 — bring out the cake.
 * The room dims, a spotlight opens, and the cake rises into view.
 * "Made especially for you."
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
      <AnimatePresence>
        {presented && (
          <motion.div
            key="spot"
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-[80vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4 }}
            style={{
              background:
                'radial-gradient(circle, rgba(255,224,158,0.22), rgba(255,224,158,0.05) 42%, transparent 68%)',
            }}
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 flex flex-col items-center">
        <AnimatePresence mode="wait">
          {!presented ? (
            <motion.div key="prompt" exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>
              <SceneCopy title={copy.title} emoji={copy.titleEmoji} />
              <div className="mt-11">
                <StageButton emoji="🎂" onClick={handlePresent} delay={0.3}>
                  {copy.button}
                </StageButton>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="cake"
              className="flex flex-col items-center"
              initial={{ y: 120, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.div
                className="w-[min(70vw,22rem)]"
                animate={reduced ? undefined : { y: [0, -8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                style={{ filter: 'drop-shadow(0 26px 40px rgba(20,8,20,0.55))' }}
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
                    <div className="mt-8">
                      <StageButton emoji="✨" onClick={onAdvance} delay={0.3}>
                        Make a Wish
                      </StageButton>
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
