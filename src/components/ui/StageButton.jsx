import { motion } from 'framer-motion';

/**
 * The one glowing button that advances each ceremony.
 * Champagne-gold, softly breathing halo, tactile press.
 */
export default function StageButton({ children, emoji, onClick, delay = 0 }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.035 }}
      whileTap={{ scale: 0.97 }}
      className="group relative inline-flex items-center gap-3 rounded-full px-9 py-4
                 font-body text-[0.95rem] font-500 tracking-[0.14em] uppercase text-night
                 shadow-glow"
      style={{
        background:
          'linear-gradient(135deg, var(--color-gold), var(--color-champagne) 55%, #b98d43)',
      }}
    >
      {/* breathing halo */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{ boxShadow: '0 0 60px 2px rgba(233,207,149,0.55)' }}
        animate={{ opacity: [0.55, 1, 0.55], scale: [1, 1.06, 1] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* sheen sweep on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-full"
      >
        <span
          className="absolute -inset-y-2 -left-1/3 w-1/3 skew-x-[-20deg] bg-white/40 blur-md
                     transition-transform duration-700 ease-out group-hover:translate-x-[420%]"
        />
      </span>
      <span className="relative z-10">{children}</span>
      {emoji && (
        <span className="relative z-10 text-lg leading-none" aria-hidden>
          {emoji}
        </span>
      )}
    </motion.button>
  );
}
