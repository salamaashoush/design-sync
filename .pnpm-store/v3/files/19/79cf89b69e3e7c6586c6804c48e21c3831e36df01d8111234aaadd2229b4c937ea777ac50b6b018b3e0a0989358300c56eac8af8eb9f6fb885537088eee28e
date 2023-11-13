#!/usr/bin/env node
'use strict';

const consola = require('consola');
const mri = require('mri');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

const consola__default = /*#__PURE__*/_interopDefaultCompat(consola);
const mri__default = /*#__PURE__*/_interopDefaultCompat(mri);

const subCommands = {
  _default: () => import('./chunks/default.cjs'),
  gh: () => import('./chunks/github.cjs'),
  github: () => import('./chunks/github.cjs')
};
async function main() {
  const args = process.argv.slice(2);
  let subCommand = args[0];
  if (!subCommand || subCommand.startsWith("-")) {
    subCommand = "_default";
  } else {
    args.shift();
  }
  if (!(subCommand in subCommands)) {
    consola__default.error(`Unknown command ${subCommand}`);
    process.exit(1);
  }
  await subCommands[subCommand]().then((r) => r.default(mri__default(args)));
}
main().catch(consola__default.error);
