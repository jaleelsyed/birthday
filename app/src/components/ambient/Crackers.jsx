import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { rand, pick, times } from '../../lib/random';

const RAYS = 14;

/** One small cracker: a flash, radiating sparks, and a few drifting embers. */
function Cracker({ x, y, delay, color, size }) {
  return (
    <div className="absolute" style={{ left: `${x}%`, top: `${y}%` }}>
      {/* flash */}
      <motion.span
        className="absolute block rounded-full"
        style={{
          width: 10,
          height: 10,
          marginLeft: -5,
          marginTop: -5,
          background: '#fff8e4',
          boxShadow: `0 0 22px 6px ${color}`,
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.8, 0], opacity: [0, 1, 0] }}
        transition={{ duration: 0.55, delay, ease: 'easeOut' }}
      />
      {/* sparks */}
      {times(RAYS, (i) => (
        <motion.span
          key={i}
          className="absolute block origin-left"
          style={{
            height: 2,
            width: size,
            borderRadius: 2,
            background: `linear-gradient(90deg, #fff6d8, ${color} 45%, transparent)`,
            rotate: (i / RAYS) * 360 + rand(-8, 8),
          }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: [0, 1, 0.85], opacity: [0, 1, 0] }}
          transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
        />
      ))}
      {/* embers that linger and fall */}
      {times(5, (i) => (
        <motion.span
          key={`e${i}`}
          className="absolute block rounded-full"
          style={{ width: 2.5, height: 2.5, background: color }}
          initial={{ x: 0, y: 0, opacity: 0 }}
          animate={{
            x: rand(-size, size),
            y: [0, -size * 0.4, size * 0.9],
            opacity: [0, 1, 0],
          }}
          transition={{ duration: rand(1.1, 1.8), delay: delay + 0.1, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}

/**
 * A short run of crackers popping around the cake — the small, close-range
 * kind you light on a table, not the sky fireworks of the finale.
 */
export default function Crackers({ colors, count = 7, reduced, onPop }) {
  const pops = useMemo(
    () =>
      times(count, (i) => ({
        id: i,
        // Alternate sides and keep clear of the middle — the cake stands
        // there, and a cracker behind it just glows faintly through.
        x: i % 2 ? rand(62, 93) : rand(7, 38),
        y: rand(12, 74),
        delay: 0.15 + i * rand(0.2, 0.38),
        color: pick(colors),
        size: rand(34, 58),
      })),
    [count, colors]
  );

  useEffect(() => {
    if (reduced || !onPop) return;
    const timers = pops.map((p) => setTimeout(() => onPop(), p.delay * 1000));
    return () => timers.forEach(clearTimeout);
  }, [pops, reduced, onPop]);

  if (reduced) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pops.map((p) => (
        <Cracker key={p.id} {...p} />
      ))}
    </div>
  );
}
