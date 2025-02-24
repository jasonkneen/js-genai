import json from '@rollup/plugin-json';
import {readFileSync} from 'fs';
import typescript from 'rollup-plugin-typescript2';

const pkg = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf8'),
);

const rollupPlugins = [
  typescript({
    tsconfigOverride: {
      exclude: ['test/**'],
    },
  }),
  json({
    preferConst: true,
  }),
];

const externalDeps = ['google-auth-library', 'ws'];

export default [
  // ES module (dist/index.mjs)
  {
    input: 'src/index.ts',
    output: {
      file: pkg.exports['.']['import'],
      format: 'es',
      sourcemap: true,
    },
    plugins: rollupPlugins,
    external: externalDeps,
  },

  // CommonJS module (dist/index.js)
  {
    input: 'src/index.ts',
    output: {
      file: pkg.exports['.']['require'],
      format: 'cjs',
      sourcemap: true,
    },
    plugins: rollupPlugins,
    external: externalDeps,
  },

  // The `node/` module, commonjs only (dist/node/index.js)
  {
    input: 'src/node/index.ts',
    output: {
      file: pkg.exports['./node']['require'],
      format: 'cjs',
      sourcemap: true,
    },
    plugins: rollupPlugins,
    external: externalDeps,
  },
];
