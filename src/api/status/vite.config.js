import { defineConfig } from 'vite';

// https://vitejs.dev/config
export default defineConfig({
  build: {
    outDir: './public/dist',
    manifest: true,
    rollupOptions: {
      // overwrite default .html entry
      input: ['./public/js/pages/dashboard.js', './public/js/pages/build.js'],
    },
  },
});
