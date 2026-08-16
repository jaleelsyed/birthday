import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { rand } from '../lib/random';

/**
 * Stage 5b — the wishes, released one by one as glowing handwritten script
 * that drifts upward like wishes let go into the night.
 */
export default function WishReveal({ wishes, closing, onComplete, play }) {
  const [visible, setVisible] = useState([]);
  const [showClosing, setShowClosing] = useState(false);

  useEffect(() => {
    // Keep the whole sequence around 8s however many wishes there are.
    const gap = wishes.length > 6 ? 780 : 1050;
    const timers = [];
    wishes.forEach((_, i) => {
      timers.push(
        setTimeout(() => {
          setVisible((v) => [...v, i]);
          play('wish');
        }, 500 + i * gap)
      );
    });
    timers.push(
      setTimeout(() => setShowClosing(true), 500 + wishes.length * gap + 600)
    );
    timers.push(
      setTimeout(() => onComplete?.(), 500 + wishes.length * gap + 2600)
    );
    return () => timers.forEach(clearTimeout);
  }, [wishes, onComplete, play]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {wishes.map((wish, i) => {
        const lane = 12 + (i / Math.max(1, wishes.length - 1)) * 70 + rand(-4, 4);
        const size = 2.1 + (i % 3) * 0.5;
        return (
          <AnimatePresence key={wish}>
            {visible.includes(i) && (
              <motion.span
                className="script absolute left-0 text-gold"
                style={{
                  left: `${lane}%`,
                  fontSize: `clamp(1.6rem, 1rem + ${size}vw, ${size + 1.4}rem)`,
                  textShadow: '0 0 24px rgba(233,207,149,0.65)',
                  transform: 'translateX(-50%)',
                }}
                initial={{ bottom: '26%', opacity: 0, scale: 0.8 }}
                animate={{ bottom: '86%', opacity: [0, 1, 1, 0], scale: 1 }}
                transition={{ duration: 5.5, ease: 'easeOut', times: [0, 0.14, 0.7, 1] }}
              >
                {wish}
              </motion.span>
            )}
          </AnimatePresence>
        );
      })}

      <div className="absolute inset-x-0 bottom-[12%] flex justify-center px-6">
        <AnimatePresence>
          {showClosing && (
            <motion.p
              className="headline max-w-2xl text-ivory"
              style={{ fontSize: 'clamp(1.4rem,0.9rem+2.4vw,2.6rem)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              {closing}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
