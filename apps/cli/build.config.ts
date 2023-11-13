import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  entries: ['src/index.ts', 'src/cli.ts'],
  rollup: {
    emitCJS: true,
  },
  clean: true,
  declaration: true,
});
