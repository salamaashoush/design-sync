# @design-sync/css-plugin

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
<!-- [![bundle][bundle-src]][bundle-href]
[![Codecov][codecov-src]][codecov-href] -->

Transforms design tokens to css variables and classes

## Usage

Install package:

```sh
# npm
npm install @design-sync/css-plugin

# yarn
yarn add @design-sync/css-plugin

# pnpm
pnpm install @design-sync/css-plugin

# bun
bun install @design-sync/css-plugin
```

in the config file add the plugin to the plugins array

```ts
import { cssPlugin } from '@design-sync/css-plugin'

export default {
  plugins: [cssPlugin({
    // extract token types as css classes default: ['typography']
    extractAsStyles: ['typography'],
    // relative path in the `out` root config, default ''
    outDir: 'css',
    // extract typography as css variables in the format of `font` css property, default: false
    typographyAsFontProperty: false,
    // css selector per mode to wrap the css variables, default: ':root'
    selectors: {
      dark: '@media (prefers-color-scheme: dark)',
      light: '@media (prefers-color-scheme: light)',
    },
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

[npm-version-src]: https://img.shields.io/npm/v/@design-sync/css-plugin?style=flat&colorA=18181B&colorB=F0DB4F
[npm-version-href]: https://npmjs.com/package/@design-sync/css-plugin
[npm-downloads-src]: https://img.shields.io/npm/dm/@design-sync/css-plugin?style=flat&colorA=18181B&colorB=F0DB4F
[npm-downloads-href]: https://npmjs.com/package/@design-sync/css-plugin
<!-- [codecov-src]: https://img.shields.io/codecov/c/gh/unjs/@design-sync/css-plugin/main?style=flat&colorA=18181B&colorB=F0DB4F
[codecov-href]: https://codecov.io/gh/unjs/@design-sync/css-plugin
[bundle-src]: https://img.shields.io/bundlephobia/minzip/@design-sync/css-plugin?style=flat&colorA=18181B&colorB=F0DB4F
[bundle-href]: https://bundlephobia.com/result?p=@design-sync/css-plugin -->
