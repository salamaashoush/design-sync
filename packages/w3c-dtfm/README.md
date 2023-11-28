# @design-sync/w3c-dtfm

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
<!-- [![bundle][bundle-src]][bundle-href]
[![Codecov][codecov-src]][codecov-href] -->

Design tokens module format (DTFM) utils and types

## Usage

Install package:

```sh
# npm
npm install @design-sync/w3c-dtfm

# yarn
yarn add @design-sync/w3c-dtfm

# pnpm
pnpm install @design-sync/w3c-dtfm

# bun
bun install @design-sync/w3c-dtfm
```

Import:

```js
import { TokensWalker } from "@design-sync/w3c-dtfm";

const tokens = {
  "color": {
    "primary": {
      "$value": "#000000",
      "$type": "color"
    }
  }
  ... // rest of tokens
};
const walker = new TokensWalker(tokens);

walker.walk((token) => {
  // do something with token
  console.log(token);
});
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

[npm-version-src]: https://img.shields.io/npm/v/@design-sync/w3c-dtfm?style=flat&colorA=18181B&colorB=F0DB4F
[npm-version-href]: https://npmjs.com/package/@design-sync/w3c-dtfm
[npm-downloads-src]: https://img.shields.io/npm/dm/@design-sync/w3c-dtfm?style=flat&colorA=18181B&colorB=F0DB4F
[npm-downloads-href]: https://npmjs.com/package/@design-sync/w3c-dtfm
<!-- [codecov-src]: https://img.shields.io/codecov/c/gh/unjs/@design-sync/w3c-dtfm/main?style=flat&colorA=18181B&colorB=F0DB4F
[codecov-href]: https://codecov.io/gh/unjs/@design-sync/w3c-dtfm
[bundle-src]: https://img.shields.io/bundlephobia/minzip/@design-sync/w3c-dtfm?style=flat&colorA=18181B&colorB=F0DB4F
[bundle-href]: https://bundlephobia.com/result?p=@design-sync/w3c-dtfm -->
