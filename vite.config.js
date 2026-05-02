import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
      mangle: true,
      format: {
        comments: false,
      },
    },
    rollupOptions: {
      input: {
        main: 'index.html',
        privacy: 'privacy.html',
        terms: 'terms.html'
      },
      output: {
        manualChunks: undefined,
        entryFileNames: `assets/ws-[hash].js`,
        chunkFileNames: `assets/ws-[hash].js`,
        assetFileNames: `assets/ws-[hash].[ext]`,
      },
    },
    target: 'esnext',
    cssMinify: true,
    assetsInlineLimit: 0, // Keep assets separate but hashed for privacy
  },
});
