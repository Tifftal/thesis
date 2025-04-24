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
      components: path.resolve('src/components'),
      common: path.resolve('src/common'),
      utils: path.resolve('src/utils'),
      hooks: path.resolve('src/utils/hooks'),
      assets: path.resolve('src/assets'),
    },
  },
});
