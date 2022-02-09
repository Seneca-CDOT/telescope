import { defineConfig } from 'vite';

// https://vitejs.dev/config
export default defineConfig({
  build: {
    outDir: './public/dist',
    manifest: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        // Don't hash css files
        // ... because mapping it to the correct file is a pain
        assetFileNames: `assets/[name].[ext]`,
      },
      // overwrite default .html entry
      input: ['./public/js/pages/dashboard.js', './public/js/pages/build.js'],
    },
  },
});
