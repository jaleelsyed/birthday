/** @type {import('tailwindcss').Config} */
export default {
  // Source lives in app/ — see the note in vite.config.js. These must track
  // it, or Tailwind purges the classes it can't find and the site ships bare.
  content: ['./app/index.html', './app/src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ivory: 'var(--color-ivory)',
        champagne: 'var(--color-champagne)',
        gold: 'var(--color-gold)',
        blush: 'var(--color-blush)',
        rose: 'var(--color-rose)',
        burgundy: 'var(--color-burgundy)',
        night: 'var(--color-night)',
        'night-2': 'var(--color-night-2)',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        body: ['Jost', 'system-ui', 'sans-serif'],
        script: ['"Great Vibes"', 'cursive'],
      },
      boxShadow: {
        glow: '0 0 40px -6px var(--color-champagne)',
        'glow-lg': '0 0 90px -10px rgba(201, 163, 91, 0.75)',
      },
      keyframes: {
        floaty: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        flicker: {
          '0%, 100%': { transform: 'scaleY(1) rotate(-1deg)', opacity: '1' },
          '25%': { transform: 'scaleY(1.08) rotate(1.5deg)', opacity: '0.92' },
          '50%': { transform: 'scaleY(0.94) rotate(-1.5deg)', opacity: '1' },
          '75%': { transform: 'scaleY(1.05) rotate(1deg)', opacity: '0.95' },
        },
        shimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
      },
      animation: {
        floaty: 'floaty 6s ease-in-out infinite',
        flicker: 'flicker 220ms ease-in-out infinite',
        shimmer: 'shimmer 6s linear infinite',
      },
    },
  },
  plugins: [],
};
