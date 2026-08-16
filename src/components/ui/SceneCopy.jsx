import { motion } from 'framer-motion';

const ease = [0.16, 1, 0.3, 1];

/** Eyebrow + headline + optional lead, revealed with a soft rise. */
export function SceneCopy({ eyebrow, title, emoji, lead, size = 'title', delay = 0 }) {
  const titleClass =
    size === 'hero'
      ? 'headline gold-text'
      : 'headline text-ivory';
  const titleStyle =
    size === 'hero'
      ? { fontSize: 'var(--text-hero)' }
      : { fontSize: 'var(--text-title)' };

  return (
    <div className="mx-auto max-w-3xl">
      {eyebrow && (
        <motion.p
          className="eyebrow text-champagne/80"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay, ease }}
        >
          {eyebrow}
        </motion.p>
      )}
      {title && (
        <motion.h1
          className={`mt-5 ${titleClass}`}
          style={titleStyle}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: delay + 0.08, ease }}
        >
          {title}
          {emoji && <span className="ml-3 align-middle" aria-hidden>{emoji}</span>}
        </motion.h1>
      )}
      {lead && (
        <motion.p
          className="mx-auto mt-6 max-w-xl font-body font-300 text-ivory/75"
          style={{ fontSize: 'var(--text-lead)' }}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: delay + 0.22, ease }}
        >
          {lead}
        </motion.p>
      )}
    </div>
  );
}

export default SceneCopy;
