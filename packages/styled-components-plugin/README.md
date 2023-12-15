# @design-sync/styled-components-plugin

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
<!-- [![bundle][bundle-src]][bundle-href]
[![Codecov][codecov-src]][codecov-href] -->


Transforms design tokens to vanilla extract themes and styles

## Usage

Install package:

```sh
# npm
npm install @design-sync/styled-components-plugin

# yarn
yarn add @design-sync/styled-components-plugin

# pnpm
pnpm install @design-sync/styled-components-plugin

# bun
bun install @design-sync/styled-components-plugin
```

in the config file add the plugin to the plugins array

```ts
import { vanillaExtractPlugin } from '@design-sync/styled-components-plugin'

export default {
  plugins: [vanillaExtractPlugin({
    // relative path in the `out` root config, default ''
    outDir: 'styled-components',
    // name of the exported variable from the theme contract, default: 'contract'
    contractName: 'contract',
    // global theme selector, default: ':root'
    globalThemeSelector: ':root',
    // create global themes, default: false
    createGlobalThemes: false,
    // create global theme contract, default: false
    createGlobalContract: false,
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

[npm-version-src]: https://img.shields.io/npm/v/@design-sync/styled-components-plugin?style=flat&colorA=18181B&colorB=F0DB4F
[npm-version-href]: https://npmjs.com/package/@design-sync/styled-components-plugin
[npm-downloads-src]: https://img.shields.io/npm/dm/@design-sync/styled-components-plugin?style=flat&colorA=18181B&colorB=F0DB4F
[npm-downloads-href]: https://npmjs.com/package/@design-sync/styled-components-plugin
<!-- [codecov-src]: https://img.shields.io/codecov/c/gh/unjs/@design-sync/styled-components-plugin/main?style=flat&colorA=18181B&colorB=F0DB4F
[codecov-href]: https://codecov.io/gh/unjs/@design-sync/styled-components-plugin
[bundle-src]: https://img.shields.io/bundlephobia/minzip/@design-sync/styled-components-plugin?style=flat&colorA=18181B&colorB=F0DB4F
[bundle-href]: https://bundlephobia.com/result?p=@design-sync/styled-components-plugin -->
