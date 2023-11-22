# @design-sync/cli

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
<!-- [![bundle][bundle-src]][bundle-href]
[![Codecov][codecov-src]][codecov-href] -->

Design Sync CLI

## Usage

Install package:

```sh
# npm
npm install -D @design-sync/cli

# yarn
yarn add --dev @design-sync/cli

# pnpm
pnpm i -D @design-sync/cli

# bun
bun install -D @design-sync/cli
```

Initialize:

```sh
# npm
npm run dsync init

# yarn
yarn dsync init

# pnpm
pnpm dsync init

# bun
bun dsync init
```

follow the prompt to create a `design-sync.config` file or pass `-y` to skip the prompt and use the default values.

Sync:
  
```sh
# npm
npm dsync sync

# yarn
yarn dsync sync

# pnpm
pnpm dsync sync

# bun
bun dsync sync
```

## Configuration

The configuration file is a `design-sync.config.ts` file in the root of your project.

- `uri`: (string) the uri of a git repository to download the design tokens from, eg `gh:owner/repo/path/to/file/or/folder#branch` supports `github`, `gitlab`, `sourcehut` and `bitbucket` see [giget](https://github.com/unjs/giget) for more info.
- `auth`: (string) Custom Authorization token to use for downloading tokens. (Can be overridden with `GIGET_AUTH` environment variable).
- `out`: (string) the output directory for the generated files
- `plugins`: (array) plugins to use, see [plugins](#plugins) for more info
- `schemaExtensions` (array)- schema extensions to use, see [schema extensions](#schema-extensions) for more info
- `prettify`: (boolean) format the generated files using `prettier`, default: `false`

## Plugins

- 

## Schema Extensions

- Modes -> allow you to override tokens per mode (dark, light, etc) and generate a theme for each mode, enabled by default.
- Color Modifiers -> allow you to modify colors using common color modifiers like lighten, darken, saturate, etc, enabled by default.
- Color Generators  -> allow you to generate more colors dynamically using color modifiers, enabled by default.

## Development

- Clone this repository
- Install latest LTS version of [Node.js](https://nodejs.org/en/)
- Enable [Corepack](https://github.com/nodejs/corepack) using `corepack enable`
- Install dependencies using `pnpm install`
- Run interactive tests using `pnpm dev`

## License

Made with 💛

Published under [MIT License](./LICENSE).

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/@design-sync/cli?style=flat&colorA=18181B&colorB=F0DB4F
[npm-version-href]: https://npmjs.com/package/@design-sync/cli
[npm-downloads-src]: https://img.shields.io/npm/dm/@design-sync/cli?style=flat&colorA=18181B&colorB=F0DB4F
[npm-downloads-href]: https://npmjs.com/package/@design-sync/cli
<!-- [codecov-src]: https://img.shields.io/codecov/c/gh/unjs/@design-sync/cli/main?style=flat&colorA=18181B&colorB=F0DB4F
[codecov-href]: https://codecov.io/gh/unjs/@design-sync/cli
[bundle-src]: https://img.shields.io/bundlephobia/minzip/@design-sync/cli?style=flat&colorA=18181B&colorB=F0DB4F
[bundle-href]: https://bundlephobia.com/result?p=@design-sync/cli -->
