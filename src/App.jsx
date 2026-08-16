import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import celebrationConfig from './config/celebrationConfig';
import { STAGES, STAGE_LIGHT, STAGE_INTENSITY } from './lib/stages';
import { personalize } from './lib/personalize';
import { useSound } from './hooks/useSound';
import { useReducedMotion } from './hooks/useReducedMotion';

import SparkleField from './components/ambient/SparkleField';
import MusicController from './components/MusicController';
import BirthdayIntro from './components/BirthdayIntro';
import RoomLighting from './components/RoomLighting';
import BalloonRelease from './components/BalloonRelease';
import BirthdayCake from './components/BirthdayCake';
import MakeAWish from './components/MakeAWish';
import Fireworks from './components/Fireworks';

/**
 * Scenes crossfade rather than swapping one-at-a-time. Both are absolutely
 * positioned, so the outgoing scene dissolves *under* the incoming one —
 * which keeps the cake continuous from the cake stage into the wish.
 * The incoming scene is later in the DOM, so it receives the clicks.
 */
/* Keep `exit` to animatable values only. A non-animatable key such as
 * pointerEvents here prevents the exit from ever completing, which leaves
 * the outgoing scene mounted on top of the new one forever. Double-taps
 * during the crossfade are handled by the lock in `advance` instead. */
const sceneTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, transition: { duration: 0.7, ease: 'easeInOut' } },
};

/** Ignore repeat advances fired while scenes are still crossfading. */
const ADVANCE_LOCK_MS = 900;

export default function App() {
  // Resolve every {name} token once, up front.
  const config = useMemo(
    () => personalize(celebrationConfig, celebrationConfig.name),
    []
  );
  const reduced = useReducedMotion();
  const { start, play, setIntensity, toggleMute, muted, started } = useSound(config.music);

  const [index, setIndex] = useState(0);
  const stage = STAGES[index];

  // Keep the room light + musical intensity in step with the ceremony.
  useEffect(() => {
    setIntensity(STAGE_INTENSITY[stage] ?? 0.4);
  }, [stage, setIntensity]);

  const advanceLockRef = useRef(0);

  const advance = useCallback(() => {
    const now = Date.now();
    if (now - advanceLockRef.current < ADVANCE_LOCK_MS) return;
    advanceLockRef.current = now;

    play('click');
    if (stage === 'intro') start(); // first gesture unlocks audio
    setIndex((i) => Math.min(i + 1, STAGES.length - 1));
  }, [stage, play, start]);

  const light = STAGE_LIGHT[stage] ?? 0.3;
  const petalsOn = stage === 'balloons' || stage === 'sky' || stage === 'cake';
  const density = stage === 'sky' ? 0.3 : 0.6 + light * 0.6;

  const sceneEl = useMemo(() => {
    const s = config.stages;
    switch (stage) {
      case 'intro':
        return <BirthdayIntro copy={s.intro} onAdvance={advance} />;
      case 'room':
        return <RoomLighting copy={s.room} onAdvance={advance} play={play} reduced={reduced} />;
      case 'balloons':
        return (
          <BalloonRelease
            copy={s.balloons}
            colors={config.balloonColors}
            onAdvance={advance}
            play={play}
            reduced={reduced}
          />
        );
      case 'cake':
        return <BirthdayCake copy={s.cake} onAdvance={advance} play={play} reduced={reduced} />;
      case 'wish':
        return (
          <MakeAWish
            copy={s.wish}
            wishes={config.wishes}
            onAdvance={advance}
            play={play}
            reduced={reduced}
          />
        );
      case 'sky':
        return (
          <Fireworks
            copy={s.sky}
            colors={config.fireworkColors}
            name={config.name}
            signature={config.signature}
            play={play}
            reduced={reduced}
          />
        );
      default:
        return null;
    }
  }, [stage, config, advance, play, reduced]);

  return (
    <main className="relative h-full w-full overflow-hidden">
      {/* ambient base that warms with the ceremony */}
      <motion.div
        aria-hidden
        className="absolute inset-0"
        animate={{
          background:
            stage === 'sky'
              ? 'radial-gradient(130% 100% at 50% 0%, #241634, #0a0713 70%)'
              : `radial-gradient(120% 100% at 50% 35%,
                  rgba(45,26,40,${0.9 - light * 0.35}),
                  rgba(12,7,16,${0.98 - light * 0.2}))`,
        }}
        transition={{ duration: 1.4 }}
      />
      {/* warm champagne wash, brighter as the room lights up */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        animate={{ opacity: stage === 'sky' ? 0 : light * 0.5 }}
        transition={{ duration: 1.4 }}
        style={{
          background:
            'radial-gradient(90% 70% at 50% 30%, rgba(233,207,149,0.25), transparent 65%)',
        }}
      />

      <SparkleField density={density} petals={petalsOn} reduced={reduced} />

      <MusicController muted={muted} onToggle={toggleMute} visible={started} />

      {/* progress dots */}
      <div className="pointer-events-none absolute bottom-5 left-1/2 z-40 flex -translate-x-1/2 gap-2">
        {STAGES.map((s, i) => (
          <span
            key={s}
            className="h-1.5 rounded-full transition-all duration-500"
            style={{
              width: i === index ? 22 : 6,
              background: i <= index ? 'var(--color-champagne)' : 'rgba(251,247,240,0.25)',
            }}
          />
        ))}
      </div>

      <AnimatePresence>
        <motion.div key={stage} className="absolute inset-0" {...sceneTransition}>
          {sceneEl}
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
