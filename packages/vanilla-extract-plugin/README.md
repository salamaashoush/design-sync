# @design-sync/vanilla-extract-plugin

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
<!-- [![bundle][bundle-src]][bundle-href]
[![Codecov][codecov-src]][codecov-href] -->


Transforms design tokens to vanilla extract themes and styles

## Usage

Install package:

```sh
# npm
npm install @design-sync/vanilla-extract-plugin

# yarn
yarn add @design-sync/vanilla-extract-plugin

# pnpm
pnpm install @design-sync/vanilla-extract-plugin

# bun
bun install @design-sync/vanilla-extract-plugin
```

in the config file add the plugin to the plugins array

```ts
import { vanillaExtractPlugin } from '@design-sync/cli'

export default {
  plugins: [vanillaExtractPlugin({
    // relative path in the `out` root config, default ''
    outDir: 'vanilla-extract',
    // name of the file used to export the theme contract using `createThemeContract`, default: 'contract.css.ts'
    themeContractName: 'contract',
    // name of the exported variable from the theme contract and would also be used to reference the tokens, default: 'vars'
    themeContractVarName: 'theme',
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

[npm-version-src]: https://img.shields.io/npm/v/@design-sync/vanilla-extract-plugin?style=flat&colorA=18181B&colorB=F0DB4F
[npm-version-href]: https://npmjs.com/package/@design-sync/vanilla-extract-plugin
[npm-downloads-src]: https://img.shields.io/npm/dm/@design-sync/vanilla-extract-plugin?style=flat&colorA=18181B&colorB=F0DB4F
[npm-downloads-href]: https://npmjs.com/package/@design-sync/vanilla-extract-plugin
<!-- [codecov-src]: https://img.shields.io/codecov/c/gh/unjs/@design-sync/vanilla-extract-plugin/main?style=flat&colorA=18181B&colorB=F0DB4F
[codecov-href]: https://codecov.io/gh/unjs/@design-sync/vanilla-extract-plugin
[bundle-src]: https://img.shields.io/bundlephobia/minzip/@design-sync/vanilla-extract-plugin?style=flat&colorA=18181B&colorB=F0DB4F
[bundle-href]: https://bundlephobia.com/result?p=@design-sync/vanilla-extract-plugin -->
