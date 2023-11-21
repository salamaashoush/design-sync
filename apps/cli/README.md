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

The configuration file is a `design-sync.config.ts` file in the root of your project.

- `uri`: (string) the uri of a git repository to download the design tokens from, eg `gh:owner/repo/path/to/file/or/folder#branch` supports `github`, `gitlab`, `sourcehut` and `bitbucket` see [giget](https://github.com/unjs/giget) for more info.
- `auth`: (string) Custom Authorization token to use for downloading tokens. (Can be overridden with `GIGET_AUTH` environment variable).
- `out`: (string) the output directory for the generated files
- `plugins`: (array) plugins to use, see [plugins](#plugins) for more info
- `schemaExtensions` (array)- schema extensions to use, see [schema extensions](#schema-extensions) for more info
- `prettify`: (boolean) format the generated files using `prettier`, default: `false`

## Plugins

### Css

Transforms DTFM json to css variables and classes

Usage:

in the config file add the plugin to the plugins array

```ts
import { cssPlugin } from '@design-sync/sync'

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

### Vanilla Extract

Transforms DTFM json to vanilla extract themes

Usage:

in the config file add the plugin to the plugins array

```ts
import { vanillaExtractPlugin } from '@design-sync/sync'

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

### JSON (flat)

Transforms DTFM json to flat json file without all the tokens metadata and types, also dereference all token aliases

Usage:

in the config file add the plugin to the plugins array

```ts
import { jsonPlugin } from '@design-sync/sync'

export default {
  plugins: [jsonPlugin({
    // relative path in the `out` root config, default ''
    outDir: 'json',
  })],
}
```

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

[npm-version-src]: https://img.shields.io/npm/v/@design-sync/sync?style=flat&colorA=18181B&colorB=F0DB4F
[npm-version-href]: https://npmjs.com/package/@design-sync/sync
[npm-downloads-src]: https://img.shields.io/npm/dm/@design-sync/sync?style=flat&colorA=18181B&colorB=F0DB4F
[npm-downloads-href]: https://npmjs.com/package/@design-sync/sync
<!-- [codecov-src]: https://img.shields.io/codecov/c/gh/unjs/@design-sync/sync/main?style=flat&colorA=18181B&colorB=F0DB4F
[codecov-href]: https://codecov.io/gh/unjs/@design-sync/sync
[bundle-src]: https://img.shields.io/bundlephobia/minzip/@design-sync/sync?style=flat&colorA=18181B&colorB=F0DB4F
[bundle-href]: https://bundlephobia.com/result?p=@design-sync/sync -->
