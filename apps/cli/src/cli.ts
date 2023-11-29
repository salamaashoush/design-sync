#!/usr/bin/env -S npx tsx
import { logger } from '@design-sync/manager';
import cliPkg from '../package.json';

import { defineCommand, runMain } from 'citty';

logger.wrapConsole();
const main = defineCommand({
  meta: {
    name: cliPkg.name,
    description: 'DesignSync CLI',
    version: cliPkg.version,
  },
  subCommands: {
    sync: () => import('./commands/sync').then((r) => r.default),
    init: () => import('./commands/init').then((r) => r.default),
  },
});
runMain(main);
