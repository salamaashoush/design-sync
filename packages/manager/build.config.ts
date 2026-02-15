import type { BuildConfig } from 'obuild';

export default <BuildConfig>{
  entries: [
    {
      type: 'bundle',
      input: ['./src/index.ts'],
    },
  ],
};
