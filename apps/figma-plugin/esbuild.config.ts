import * as esbuild from 'esbuild';

const watch = process.argv.includes('--watch');

async function main() {
  const ctx = await esbuild.context({
    entryPoints: ['src/main/index.ts'],
    bundle: true,
    outfile: 'dist/code.js',
    format: 'iife',
    target: 'es2020',
    minify: !watch,
    logLevel: 'info',
  });

  if (watch) {
    await ctx.watch();
  } else {
    await ctx.rebuild();
    await ctx.dispose();
  }
}

main();
