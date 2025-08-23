import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import flowbiteReact from 'flowbite-react/plugin/vite';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import nodePolyfills from 'rollup-plugin-node-polyfills';

export default defineConfig({
  plugins: [react(), tailwindcss(), flowbiteReact()],
  server: {
    allowedHosts: [
      'localhost',
      '.local',
      '3df8-2409-40c2-2042-5904-2d64-5ba6-ad9b-fb49.ngrok-free.app',
    ]
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
          process: true,
        }),
      ],
    },
  },
  build: {
    rollupOptions: {
      plugins: [nodePolyfills],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      stream: 'stream-browserify',
      util: 'util',
      buffer: 'buffer',
    },
  },
});


