import { motion } from 'framer-motion';

/**
 * A small, elegant glass control in the corner to mute / unmute the score.
 * Animated equalizer bars show playback at a glance.
 */
export default function MusicController({ muted, onToggle, visible }) {
  if (!visible) return null;

  return (
    <motion.button
      type="button"
      onClick={onToggle}
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-pressed={!muted}
      aria-label={muted ? 'Unmute music' : 'Mute music'}
      className="glass fixed right-4 top-4 z-50 flex items-center gap-2.5 rounded-full px-4 py-2.5
                 text-champagne shadow-glow sm:right-6 sm:top-6"
    >
      <span className="flex h-4 items-end gap-[3px]" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <motion.span
            key={i}
            className="w-[3px] rounded-full bg-gold"
            animate={
              muted
                ? { height: 4 }
                : { height: [5, 15, 8, 16, 6][i % 5] ? [5, 16, 7] : [5, 16, 7] }
            }
            transition={
              muted
                ? { duration: 0.2 }
                : { duration: 0.6 + i * 0.12, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }
            }
            style={{ height: 6 }}
          />
        ))}
      </span>
      <span className="font-body text-[0.7rem] uppercase tracking-[0.22em]">
        {muted ? 'Music off' : 'Music on'}
      </span>
    </motion.button>
  );
}
