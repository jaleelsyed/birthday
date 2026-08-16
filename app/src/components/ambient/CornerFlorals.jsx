import { motion } from 'framer-motion';
import { times } from '../../lib/random';

/**
 * Corner florals.
 *
 * Blooms are built from layered rings of petals rather than a single ring
 * of spokes — rings shrink and rotate against each other toward the centre,
 * which is what reads as a rose rather than a daisy. Sprays are drawn in
 * two depths: a blurred, dimmer layer behind and a crisp one in front, so
 * the corners have some air in them instead of sitting flat on the page.
 */

/** A layered bloom. `rings` of petals, each smaller and turned against the last. */
function Bloom({ cx, cy, r, outer, inner, heart, rings = 3 }) {
  return (
    <g>
      {times(rings, (ring) => {
        const t = ring / rings;
        const radius = r * (1 - t * 0.42);
        const petals = 8 - ring;
        const turn = ring * (180 / petals);
        // blend outer → inner colour as we move toward the middle
        const fill = ring === 0 ? outer : ring === rings - 1 ? inner : outer;
        return times(petals, (p) => {
          const a = (p / petals) * Math.PI * 2 + (turn * Math.PI) / 180;
          const px = cx + Math.cos(a) * radius * 0.52;
          const py = cy + Math.sin(a) * radius * 0.52;
          return (
            <ellipse
              key={`${ring}-${p}`}
              cx={px}
              cy={py}
              rx={radius * 0.46}
              ry={radius * 0.3}
              transform={`rotate(${(a * 180) / Math.PI} ${px} ${py})`}
              fill={fill}
              opacity={0.62 + t * 0.38}
            />
          );
        });
      })}
      {/* furled heart */}
      <circle cx={cx} cy={cy} r={r * 0.2} fill={heart} />
      <path
        d={`M${cx - r * 0.12} ${cy} a ${r * 0.12} ${r * 0.12} 0 1 1 ${r * 0.24} 0`}
        fill="none"
        stroke="rgba(255,255,255,0.55)"
        strokeWidth={r * 0.05}
      />
    </g>
  );
}

function Leaf({ x, y, rot, len = 30 }) {
  return (
    <g transform={`rotate(${rot} ${x} ${y})`}>
      <path
        d={`M${x} ${y} q ${len * 0.5} ${-len * 0.34} ${len} 0 q ${-len * 0.5} ${len * 0.34} ${-len} 0`}
        fill="#6f8a5c"
        opacity="0.62"
      />
      <path
        d={`M${x} ${y} q ${len * 0.5} ${-len * 0.1} ${len} 0`}
        stroke="#4e6640"
        strokeWidth="0.8"
        fill="none"
        opacity="0.5"
      />
    </g>
  );
}

/** One floral spray. `depth` 0 = crisp foreground, 1 = soft background. */
function Spray({ className, flip, delay = 0, dim = 1, depth = 0 }) {
  const blooms = [
    { cx: 150, cy: 118, r: 34, outer: '#F7DCE1', inner: '#EEC3CC', heart: '#D0808F' },
    { cx: 208, cy: 196, r: 26, outer: '#F9EBCE', inner: '#EBD49A', heart: '#C09447' },
    { cx: 92, cy: 188, r: 22, outer: '#EEDDF3', inner: '#D9C1E8', heart: '#9F7FC0' },
    { cx: 52, cy: 248, r: 18, outer: '#FBEAC4', inner: '#F0D89F', heart: '#C9A35B' },
    { cx: 186, cy: 128, r: 15, outer: '#FDF3E4', inner: '#F1E2CB', heart: '#CBB68C' },
  ];

  return (
    <motion.svg
      className={`pointer-events-none absolute w-[min(40vw,27rem)] ${className}`}
      viewBox="0 0 300 300"
      fill="none"
      aria-hidden
      initial={{ opacity: 0, scale: 0.92, rotate: flip ? 5 : -5 }}
      animate={{ opacity: dim, scale: 1, rotate: 0 }}
      transition={{ duration: 1.7, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{
        transform: flip ? 'scaleX(-1)' : undefined,
        filter: depth
          ? 'blur(3.5px) saturate(0.85)'
          : 'drop-shadow(0 10px 14px rgba(24,10,24,0.45))',
      }}
    >
      {/* stems */}
      <path d="M14 292 C 74 240 118 196 150 122" stroke="#5f7a4e" strokeWidth="2.6" strokeLinecap="round" opacity="0.65" />
      <path d="M36 292 C 92 258 152 238 208 200" stroke="#5f7a4e" strokeWidth="2.1" strokeLinecap="round" opacity="0.55" />
      <path d="M28 288 C 60 268 78 232 92 192" stroke="#5f7a4e" strokeWidth="1.8" strokeLinecap="round" opacity="0.5" />

      <Leaf x={96} y={214} rot={-38} len={34} />
      <Leaf x={144} y={182} rot={-18} len={28} />
      <Leaf x={176} y={218} rot={26} len={30} />
      <Leaf x={66} y={244} rot={-62} len={26} />
      <Leaf x={122} y={252} rot={14} len={24} />

      {blooms.map((b, i) => (
        <Bloom key={i} {...b} />
      ))}
    </motion.svg>
  );
}

/** Florals nestled into the corners, layered front and back for depth. */
export default function CornerFlorals({ dim = 1 }) {
  return (
    <>
      {/* soft background layer */}
      <Spray className="-bottom-16 -left-24 w-[min(46vw,30rem)]" depth={1} delay={0} dim={dim * 0.45} />
      <Spray className="-bottom-16 -right-24 w-[min(46vw,30rem)]" depth={1} flip delay={0.1} dim={dim * 0.45} />
      {/* crisp foreground layer */}
      <Spray className="-bottom-10 -left-12" delay={0.18} dim={dim} />
      <Spray className="-bottom-10 -right-12" flip delay={0.3} dim={dim} />
      {/* smaller mirrored pair up top */}
      <Spray className="-top-16 -left-14 rotate-180" delay={0.45} dim={dim * 0.55} />
      <Spray className="-top-16 -right-14 rotate-180" flip delay={0.55} dim={dim * 0.55} />
    </>
  );
}
