import { motion } from 'framer-motion';

/* A single decorative floral spray drawn in SVG — champagne & blush. */
function Spray({ className, flip, delay = 0, dim = 1 }) {
  return (
    <motion.svg
      className={`pointer-events-none absolute w-[min(38vw,26rem)] ${className}`}
      viewBox="0 0 300 300"
      fill="none"
      aria-hidden
      initial={{ opacity: 0, scale: 0.9, rotate: flip ? 6 : -6 }}
      animate={{ opacity: dim, scale: 1, rotate: 0 }}
      transition={{ duration: 1.6, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{ transform: flip ? 'scaleX(-1)' : undefined }}
    >
      {/* stems */}
      <path d="M20 280 C 80 230 120 190 150 120" stroke="#6f5a3a" strokeWidth="2.4" strokeLinecap="round" opacity="0.7" />
      <path d="M40 280 C 90 250 150 235 210 200" stroke="#6f5a3a" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      {/* leaves */}
      {[
        [95, 205, -35], [140, 175, -20], [180, 210, 20], [70, 235, -55],
      ].map(([x, y, r], i) => (
        <ellipse key={i} cx={x} cy={y} rx="26" ry="10"
          transform={`rotate(${r} ${x} ${y})`} fill="#7f9a6b" opacity="0.55" />
      ))}
      {/* blooms */}
      {[
        [150, 120, 30, '#F3D9DD', '#D99AA6'],
        [205, 195, 24, '#F7E9C9', '#C9A35B'],
        [95, 190, 20, '#EAD7F0', '#C9A9E0'],
        [55, 250, 16, '#FBE7B5', '#E9CF95'],
      ].map(([cx, cy, r, c1, c2], i) => (
        <g key={i}>
          {Array.from({ length: 8 }).map((_, p) => {
            const a = (p / 8) * Math.PI * 2;
            return (
              <ellipse
                key={p}
                cx={cx + Math.cos(a) * r * 0.62}
                cy={cy + Math.sin(a) * r * 0.62}
                rx={r * 0.5}
                ry={r * 0.26}
                transform={`rotate(${(a * 180) / Math.PI} ${cx + Math.cos(a) * r * 0.62} ${cy + Math.sin(a) * r * 0.62})`}
                fill={c1}
                opacity="0.9"
              />
            );
          })}
          <circle cx={cx} cy={cy} r={r * 0.42} fill={c2} />
          <circle cx={cx} cy={cy} r={r * 0.2} fill="#fff6e2" opacity="0.8" />
        </g>
      ))}
    </motion.svg>
  );
}

/** Florals nestled into the four corners of a scene. */
export default function CornerFlorals({ dim = 1 }) {
  return (
    <>
      <Spray className="-bottom-8 -left-10" delay={0.1} dim={dim} />
      <Spray className="-bottom-8 -right-10" flip delay={0.25} dim={dim} />
      <Spray className="-top-14 -left-12 rotate-180 opacity-70" delay={0.4} dim={dim * 0.7} />
      <Spray className="-top-14 -right-12 rotate-180 opacity-70" flip delay={0.5} dim={dim * 0.7} />
    </>
  );
}
