import { motion } from 'framer-motion';
import { times } from '../lib/random';

// Three candles, centred on the top tier (which spans x 34→74) so they
// always sit *on* the cake rather than hanging over the edge.
const CANDLES = [45, 54, 63];

function Flame({ x, lit, reduced }) {
  return (
    <g>
      {/* wick */}
      <line x1={x} y1="36" x2={x} y2="32.5" stroke="#3a2a1a" strokeWidth="0.8" />
      <motion.g
        style={{ transformBox: 'fill-box', transformOrigin: 'center bottom' }}
        animate={
          lit && !reduced
            ? { scaleY: [1, 1.14, 0.95, 1.08, 1], rotate: [-2, 2, -1.5, 1.5, -2] }
            : { scaleY: 1, rotate: 0 }
        }
        transition={{ duration: 0.5, repeat: lit ? Infinity : 0, ease: 'easeInOut' }}
      >
        <motion.ellipse
          cx={x}
          cy="28"
          rx="2"
          ry="4.8"
          fill="url(#flameGrad)"
          animate={{ opacity: lit ? 1 : 0 }}
          transition={{ duration: lit ? 0.2 : 1.1 }}
        />
        <motion.ellipse
          cx={x}
          cy="29"
          rx="0.95"
          ry="2.4"
          fill="#fff6d8"
          animate={{ opacity: lit ? 0.95 : 0 }}
          transition={{ duration: lit ? 0.2 : 0.9 }}
        />
      </motion.g>
      {/* glow */}
      <motion.circle
        cx={x}
        cy="29"
        r="8"
        fill="url(#candleGlow)"
        animate={{ opacity: lit ? 0.7 : 0 }}
        transition={{ duration: lit ? 0.4 : 1.2 }}
      />
    </g>
  );
}

/**
 * A luxurious three-tier cake: ivory frosting, champagne-gold trim, blush
 * roses, gilded drip, strawberries, and five candles that can be lit or
 * gently extinguished for the wish.
 */
export default function Cake({ candlesLit = true, reduced = false, className = '' }) {
  return (
    <svg viewBox="0 0 108 150" className={className} aria-hidden>
      <defs>
        <linearGradient id="tierGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fffaf1" />
          <stop offset="100%" stopColor="#f0e2cf" />
        </linearGradient>
        <linearGradient id="goldTrim" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#b98d43" />
          <stop offset="50%" stopColor="#f0dca0" />
          <stop offset="100%" stopColor="#b98d43" />
        </linearGradient>
        <radialGradient id="flameGrad" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#fff3c4" />
          <stop offset="55%" stopColor="#ffb64a" />
          <stop offset="100%" stopColor="#ff7a2f" />
        </radialGradient>
        <radialGradient id="candleGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(255,200,120,0.9)" />
          <stop offset="100%" stopColor="rgba(255,200,120,0)" />
        </radialGradient>
        <linearGradient id="plate" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e9cf95" />
          <stop offset="100%" stopColor="#b98d43" />
        </linearGradient>
      </defs>

      {/* candles — bases end at y=52, exactly the top tier's surface */}
      {CANDLES.map((x, i) => (
        <g key={i}>
          <Flame x={x} lit={candlesLit} reduced={reduced} />
          <rect x={x - 1.4} y="36" width="2.8" height="16" rx="1.2"
            fill={i === 1 ? '#f3d9dd' : '#e9cf95'} />
          {/* candy-stripe detail + a soft highlight down one side */}
          <rect x={x - 1.4} y="40" width="2.8" height="1.6" fill="#ffffff" opacity="0.55" />
          <rect x={x - 1.4} y="45" width="2.8" height="1.6" fill="#ffffff" opacity="0.4" />
          <rect x={x - 1.1} y="37" width="0.8" height="14" fill="#ffffff" opacity="0.35" />
        </g>
      ))}

      {/* top tier */}
      <ellipse cx="54" cy="52" rx="20" ry="5" fill="#fffaf1" />
      <rect x="34" y="52" width="40" height="20" fill="url(#tierGrad)" />
      <ellipse cx="54" cy="72" rx="20" ry="5" fill="#f0e2cf" />
      <path d="M34 56 q10 6 20 0 t20 0" fill="none" stroke="url(#goldTrim)" strokeWidth="1.4" opacity="0.9" />

      {/* middle tier */}
      <ellipse cx="54" cy="74" rx="30" ry="6" fill="#fffaf1" />
      <rect x="24" y="74" width="60" height="24" fill="url(#tierGrad)" />
      <ellipse cx="54" cy="98" rx="30" ry="6" fill="#f0e2cf" />
      {/* gold drip */}
      <path d="M24 78 q6 10 12 2 q6 12 12 1 q6 11 12 2 q6 12 12 1 q6 10 12 2 l0 -6 -60 0 z"
        fill="url(#goldTrim)" opacity="0.85" />

      {/* bottom tier */}
      <ellipse cx="54" cy="100" rx="40" ry="7" fill="#fffaf1" />
      <rect x="14" y="100" width="80" height="28" fill="url(#tierGrad)" />
      <ellipse cx="54" cy="128" rx="40" ry="7" fill="#efe0cb" />
      <path d="M14 104 q10 7 20 0 t20 0 t20 0 t20 0" fill="none" stroke="url(#goldTrim)" strokeWidth="1.6" opacity="0.9" />

      {/* blush roses along the tiers */}
      {[
        [40, 72, 4, '#f3d9dd', '#d99aa6'],
        [66, 72, 3.4, '#fbe7b5', '#e9cf95'],
        [30, 98, 4.6, '#f3d9dd', '#d99aa6'],
        [54, 98, 4, '#ead7f0', '#c9a9e0'],
        [78, 98, 4.4, '#fbe7b5', '#e9cf95'],
        [24, 126, 4.2, '#f3d9dd', '#d99aa6'],
        [84, 126, 4.2, '#f6d7c4', '#e2a98c'],
      ].map(([cx, cy, r, c1, c2], i) => (
        <g key={i}>
          {times(6, (p) => {
            const a = (p / 6) * Math.PI * 2;
            return (
              <circle key={p} cx={cx + Math.cos(a) * r * 0.5} cy={cy + Math.sin(a) * r * 0.5}
                r={r * 0.42} fill={c1} />
            );
          })}
          <circle cx={cx} cy={cy} r={r * 0.42} fill={c2} />
        </g>
      ))}

      {/* strawberries */}
      {[[42, 125], [54, 125], [66, 125]].map(([cx, cy], i) => (
        <g key={i}>
          <path d={`M${cx} ${cy - 2} q3 0 3 3.5 q0 4-3 5.5 q-3 -1.5 -3 -5.5 q0 -3.5 3 -3.5z`} fill="#c23b4a" />
          <path d={`M${cx - 2} ${cy - 2} l4 0 -2 2z`} fill="#7f9a6b" />
        </g>
      ))}

      {/* plate */}
      <ellipse cx="54" cy="134" rx="48" ry="8" fill="url(#plate)" />
      <ellipse cx="54" cy="132" rx="48" ry="6" fill="#f6ead0" opacity="0.5" />
    </svg>
  );
}
