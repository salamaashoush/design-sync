import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  entries: ['src/main'],
  rollup: {
    inlineDependencies: true,
  },
  clean: true,
  declaration: true,
});
