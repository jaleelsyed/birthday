import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { rand, pick, times } from '../../lib/random';

/**
 * A handful of flower petals thrown into the air.
 *
 * Petals are lofted rather than blown straight out: each one rises fast,
 * slows at the top of its arc, then drifts back down while turning — the
 * way real petals behave when tossed.
 */
export default function PetalBurst({ colors, count = 30, reduced }) {
  const petals = useMemo(
    () =>
      times(count, (i) => {
        // Bias upward and outward, wider at the sides than straight up.
        const angle = rand(-160, -20) * (Math.PI / 180);
        const power = rand(120, 300);
        return {
          id: i,
          dx: Math.cos(angle) * power * rand(0.7, 1.5),
          rise: Math.abs(Math.sin(angle)) * power,
          size: rand(9, 18),
          color: pick(colors),
          spin: rand(-320, 320),
          delay: rand(0, 0.5),
          duration: rand(2.4, 4),
          tilt: rand(0, 180),
        };
      }),
    [count, colors]
  );

  if (reduced) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible">
      {petals.map((p) => (
        <motion.span
          key={p.id}
          className="absolute left-1/2 top-[34%] block"
          style={{
            width: p.size,
            height: p.size * 0.56,
            borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
            // Both stops opaque. A translucent white stop turns grey over
            // the darkened room instead of reading as a lit petal.
            background: `linear-gradient(140deg, ${p.color}, #FFF6EC)`,
            boxShadow: '0 0 9px rgba(255,226,190,0.4)',
            rotate: p.tilt,
          }}
          initial={{ x: 0, y: 0, opacity: 0, scale: 0.4 }}
          animate={{
            // up fast, hang, then fall past the start point
            y: [0, -p.rise, -p.rise * 0.35, p.rise * 0.5],
            x: [0, p.dx * 0.55, p.dx * 0.85, p.dx],
            rotate: [p.tilt, p.tilt + p.spin, p.tilt + p.spin * 1.6],
            opacity: [0, 1, 1, 0],
            scale: [0.4, 1, 1, 0.9],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: [0.22, 0.8, 0.3, 1],
            times: [0, 0.28, 0.5, 1],
          }}
        />
      ))}
    </div>
  );
}
