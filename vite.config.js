import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Relative paths so the build works on GitHub Pages under
  // https://<user>.github.io/<repo>/ without hardcoding the repo name.
  base: './',
  server: {
    port: 5188,
    open: true,
  },
});
