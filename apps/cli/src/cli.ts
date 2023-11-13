#!/usr/bin/env -S npx tsx
import cliPkg from '../package.json';

import { defineCommand, runMain } from 'citty';

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
