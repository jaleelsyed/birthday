import { motion } from 'framer-motion';

/**
 * A single elegant balloon that rises with gentle sway and a soft shadow.
 * Colours come from the config; each gets a unique gradient id.
 */
export default function Balloon({ balloon, reduced }) {
  const { id, x, drift, size, colors, delay, duration, sway } = balloon;
  const gid = `bal-${id}`;
  const startY = 120; // vh below the fold

  return (
    <motion.div
      className="absolute bottom-0"
      style={{ left: `${x}%`, width: size, filter: 'drop-shadow(0 14px 18px rgba(20,8,20,0.35))' }}
      initial={{ y: `${startY}vh`, opacity: 0 }}
      animate={
        reduced
          ? { y: '-10vh', opacity: 1 }
          : { y: '-125vh', x: [0, drift * 0.5, drift], opacity: [0, 1, 1, 0.92] }
      }
      transition={
        reduced
          ? { duration: 0.4 }
          : {
              y: { duration, delay, ease: [0.33, 0, 0.35, 1] },
              x: { duration, delay, ease: 'easeInOut' },
              opacity: { duration: duration * 0.6, delay, times: [0, 0.1, 0.8, 1] },
            }
      }
    >
      <motion.div
        animate={reduced ? undefined : { rotate: [-sway, sway, -sway] }}
        transition={{ duration: 3 + sway, repeat: Infinity, ease: 'easeInOut', delay }}
        style={{ transformOrigin: 'bottom center' }}
      >
        <svg viewBox="0 0 100 140" className="w-full">
          <defs>
            <radialGradient id={gid} cx="38%" cy="32%" r="75%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="22%" stopColor={colors[0]} />
              <stop offset="100%" stopColor={colors[1]} />
            </radialGradient>
          </defs>
          {/* body */}
          <path
            d="M50 4 C78 4 92 30 92 55 C92 84 70 104 50 112 C30 104 8 84 8 55 C8 30 22 4 50 4 Z"
            fill={`url(#${gid})`}
          />
          {/* highlight */}
          <ellipse cx="37" cy="34" rx="11" ry="16" fill="#ffffff" opacity="0.45" />
          {/* knot */}
          <path d="M46 110 L54 110 L50 120 Z" fill={colors[1]} />
          {/* string */}
          <path
            d="M50 120 C 56 128 44 134 50 140"
            fill="none"
            stroke={colors[1]}
            strokeWidth="1.2"
            opacity="0.7"
          />
        </svg>
      </motion.div>
    </motion.div>
  );
}
