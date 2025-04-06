import react from '@vitejs/plugin-react';
import path from 'path-browserify';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      pages: path.resolve('src/pages'),
      services: path.resolve('src/services'),
      'ui-kit': path.resolve('src/ui-kit'),
      // types: path.resolve("src/types"),
      // constants: path.resolve("src/constants"),
      // helpers: path.resolve("src/helpers"),
      // hooks: path.resolve("src/hooks"),
      components: path.resolve('src/components'),
      common: path.resolve('src/common'),
      assets: path.resolve('src/assets'),
    },
  },
});
