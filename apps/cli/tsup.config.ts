import { defineConfig } from 'tsup';
import { dependencies, devDependencies } from './package.json';

export default defineConfig({
  entry: ['src/index.ts', 'src/cli.ts'],
  outDir: 'dist',
  splitting: true,
  bundle: true,
  minify: false,
  sourcemap: true,
  format: ['cjs', 'esm'],
  dts: true,
  target: 'es2022',
  platform: 'node',
  external: Object.keys(dependencies).concat(Object.keys(devDependencies)),
  clean: true,
});
