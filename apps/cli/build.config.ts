import type { BuildConfig } from 'obuild';
import { chmod, readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

export default <BuildConfig>{
  entries: [
    {
      type: 'bundle',
      input: ['./src/index.ts', './src/cli.ts'],
    },
  ],
  hooks: {
    async end(ctx) {
      const distDir = join(ctx.pkgDir, 'dist');
      const cliPath = resolve(distDir, 'cli.mjs');

      try {
        const content = await readFile(cliPath, 'utf-8');
        if (!content.startsWith('#!')) {
          await writeFile(cliPath, `#!/usr/bin/env node\n${content}`);
        }
        await chmod(cliPath, 0o755);
      } catch {
        // File may not exist in some build scenarios
      }
    },
  },
};
