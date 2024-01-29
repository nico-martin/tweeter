import autoprefixer from 'autoprefixer';
import dotenv from 'dotenv';
import fs from 'fs';
import postcssMixins from 'postcss-mixins';
import postcssNesting from 'postcss-nesting';
import postcssPresetEnv from 'postcss-preset-env';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';
import react from '@vitejs/plugin-react';

dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    VERSION: JSON.stringify(require('./package.json').version),
  },
  css: {
    postcss: {
      plugins: [
        postcssMixins({
          mixinsDir: './src/styles/mixins',
        }),
        postcssNesting,
        autoprefixer,
        postcssPresetEnv,
      ],
    },
  },
  server: {
    ...(process.env.SSL_KEY && process.env.SSL_CRT
      ? {
          https: {
            key: fs.readFileSync(process.env.SSL_KEY),
            cert: fs.readFileSync(process.env.SSL_CRT),
          },
        }
      : {}),
    host: 'localhost',
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  },
  plugins: [react(), tsconfigPaths(), svgr()],
});
