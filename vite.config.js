import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

const at = (p) => fileURLToPath(new URL(p, import.meta.url));

/**
 * The app source lives in app/ rather than the repo root on purpose.
 *
 * GitHub Pages serves the repo root, so the root has to hold the *built*
 * site (index.html + assets/). If Vite's source index.html sat there too,
 * Pages would serve that instead — and it points at /src/main.jsx, which
 * is raw JSX no browser can run. Keeping the two apart lets `npm run pages`
 * publish the built output to the root without clobbering the entry.
 */
export default defineConfig({
  plugins: [react()],
  root: at('./app'),
  // Relative asset paths so the build works under /<repo>/ on Pages.
  base: './',
  publicDir: at('./public'),
  build: {
    outDir: at('./dist'),
    emptyOutDir: true,
  },
  server: {
    port: 5188,
    open: true,
  },
});
