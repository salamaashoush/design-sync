# @design-sync/sync

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
<!-- [![bundle][bundle-src]][bundle-href]
[![Codecov][codecov-src]][codecov-href] -->

Design Sync CLI

## Usage

Install package:

```sh
# npm
npm install -D @design-sync/sync

# yarn
yarn add --dev @design-sync/sync

# pnpm
pnpm install @design-sync/sync

# bun
bun install @design-sync/sync
```

Initialize:

```sh
# npm
npm run design-sync init

# yarn
yarn design-sync init

# pnpm
pnpm design-sync init

# bun
bun design-sync init
```

follow the prompt to create a `design-sync.config` file or pass `-y` to skip the prompt and use the default values.


Sync:
  
```sh
# npm
npm run design-sync sync

# yarn
yarn dlx design-sync sync

# pnpm
pnpm dlx design-sync sync

# bun
bun design-sync sync
```

## Configuration
WIP

## Plugins
WIP

## Schema Extensions
WIP


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

[npm-version-src]: https://img.shields.io/npm/v/@design-sync/sync?style=flat&colorA=18181B&colorB=F0DB4F
[npm-version-href]: https://npmjs.com/package/@design-sync/sync
[npm-downloads-src]: https://img.shields.io/npm/dm/@design-sync/sync?style=flat&colorA=18181B&colorB=F0DB4F
[npm-downloads-href]: https://npmjs.com/package/@design-sync/sync
<!-- [codecov-src]: https://img.shields.io/codecov/c/gh/unjs/@design-sync/sync/main?style=flat&colorA=18181B&colorB=F0DB4F
[codecov-href]: https://codecov.io/gh/unjs/@design-sync/sync
[bundle-src]: https://img.shields.io/bundlephobia/minzip/@design-sync/sync?style=flat&colorA=18181B&colorB=F0DB4F
[bundle-href]: https://bundlephobia.com/result?p=@design-sync/sync -->
