import { motion } from 'framer-motion';

/**
 * The quiet way forward after a moment has finished.
 *
 * Deliberately understated: each stage has exactly one gold StageButton —
 * the thing you actually do here. This is just "I'm ready for what's next",
 * so it must never compete with that, or read as a second copy of it.
 */
export default function ContinueLink({ children = 'Continue', onClick, delay = 0 }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover="hover"
      className="group relative inline-flex min-h-[44px] items-center gap-2 px-2 font-body
                 text-[0.7rem] uppercase tracking-[0.32em] text-ivory/55 transition-colors
                 duration-300 hover:text-gold"
    >
      {/* The tap area is 44px tall for thumbs, but the label and its rule
          stay tight together — the hairline hangs off this inner span, not
          off the padded button, or it drifts far below the text. */}
      <span className="relative inline-flex items-center gap-2 pb-1.5">
        <span>{children}</span>
        <motion.span
          aria-hidden
          className="text-sm leading-none"
          variants={{ hover: { x: 5 } }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          →
        </motion.span>
        <span
          aria-hidden
          className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-gradient-to-r
                     from-champagne/70 to-transparent transition-transform duration-500
                     ease-out group-hover:scale-x-100"
        />
      </span>
    </motion.button>
  );
}
