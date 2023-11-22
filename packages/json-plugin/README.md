# @design-sync/json-plugin

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
<!-- [![bundle][bundle-src]][bundle-href]
[![Codecov][codecov-src]][codecov-href] -->

Transforms design tokens to flat json structure without all the tokens metadata and types, also dereference all token aliases

## Usage

Install package:

```sh
# npm
npm install @design-sync/json-plugin

# yarn
yarn add @design-sync/json-plugin

# pnpm
pnpm install @design-sync/json-plugin

# bun
bun install @design-sync/json-plugin
```

in the config file add the plugin to the plugins array

```ts
import { jsonPlugin } from '@design-sync/json-plugin'

export default {
  plugins: [jsonPlugin({
    // relative path in the `out` root config, default ''
    outDir: 'json',
  })],
}
```

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

[npm-version-src]: https://img.shields.io/npm/v/@design-sync/json-plugin?style=flat&colorA=18181B&colorB=F0DB4F
[npm-version-href]: https://npmjs.com/package/@design-sync/json-plugin
[npm-downloads-src]: https://img.shields.io/npm/dm/@design-sync/json-plugin?style=flat&colorA=18181B&colorB=F0DB4F
[npm-downloads-href]: https://npmjs.com/package/@design-sync/json-plugin
<!-- [codecov-src]: https://img.shields.io/codecov/c/gh/unjs/@design-sync/json-plugin/main?style=flat&colorA=18181B&colorB=F0DB4F
[codecov-href]: https://codecov.io/gh/unjs/@design-sync/json-plugin
[bundle-src]: https://img.shields.io/bundlephobia/minzip/@design-sync/json-plugin?style=flat&colorA=18181B&colorB=F0DB4F
[bundle-href]: https://bundlephobia.com/result?p=@design-sync/json-plugin -->
