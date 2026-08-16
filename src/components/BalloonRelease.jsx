import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Balloon from './Balloon';
import CornerFlorals from './ambient/CornerFlorals';
import StageButton from './ui/StageButton';
import ContinueLink from './ui/ContinueLink';
import SceneCopy from './ui/SceneCopy';
import { rand, pick, times } from '../lib/random';

const BALLOON_COUNT = 30;

/**
 * Stage 3 — release the balloons.
 * On press, a drift of balloons rises with natural variation, then:
 * "Let the celebration begin!"
 */
export default function BalloonRelease({ copy, colors, onAdvance, play, reduced }) {
  const [released, setReleased] = useState(false);
  const [showReveal, setShowReveal] = useState(false);
  const [balloons, setBalloons] = useState([]);

  const handleRelease = () => {
    play('balloons');
    setBalloons(
      times(BALLOON_COUNT, (i) => {
        const edgeBias = i % 4 === 0 ? rand(-30, 30) : rand(-14, 14);
        return {
          id: i,
          x: rand(2, 92),
          drift: edgeBias,
          size: `${rand(46, 96)}px`,
          colors: pick(colors),
          delay: rand(0, 1.6),
          duration: rand(6, 10),
          sway: rand(3, 7),
        };
      })
    );
    setReleased(true);
    setTimeout(() => setShowReveal(true), reduced ? 400 : 3200);
  };

  return (
    <div className="scene">
      <CornerFlorals dim={0.85} />

      {/* balloons layer */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {balloons.map((b) => (
          <Balloon key={b.id} balloon={b} reduced={reduced} />
        ))}
      </div>

      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {!released && (
            <motion.div key="prompt" exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>
              <SceneCopy title={copy.title} emoji={copy.titleEmoji} />
              <div className="mt-11">
                <StageButton emoji="🎈" onClick={handleRelease} delay={0.3}>
                  {copy.button}
                </StageButton>
              </div>
            </motion.div>
          )}

          {showReveal && (
            <motion.div
              key="reveal"
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center"
            >
              <h2 className="headline gold-text" style={{ fontSize: 'var(--text-title)' }}>
                {copy.revealTitle}
                <span className="ml-3" aria-hidden>{copy.revealEmoji}</span>
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
