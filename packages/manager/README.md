# @design-sync/manager

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
<!-- [![bundle][bundle-src]][bundle-href]
[![Codecov][codecov-src]][codecov-href] -->

Plugable design tokens manager

## Usage

Install package:

```sh
# npm
npm install @design-sync/manager

# yarn
yarn add @design-sync/manager

# pnpm
pnpm install @design-sync/manager

# bun
bun install @design-sync/manager
```

Usage:

```ts
import { TokensManager } from '@design-sync/manager'

const tokensManager = new TokensManager();
tokensManager.use({
  name: 'my-plugin',
  build: async (manager) => {
    const walker = manager.getWalker();
    walker.walk((token) => {
      // do something with token
    });

    return [{
     name: 'my-plugin-emitted-file.css',
     content: 'transformed tokens or whatever',
    }];
  },
});
// what will happen? 
// 1. resolve config from .design-sync.config file in current working directory or user home directory
// 2. override config with the provided config
// 3. fetch tokens from the provided uri or use the provided tokens
// 4. run plugins
// 5. write emitted files to disk
await tokensManager.run({
  // override config
  uri: 'gh:owner/repo#branch',
});
console.log("done");
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

[npm-version-src]: https://img.shields.io/npm/v/@design-sync/manager?style=flat&colorA=18181B&colorB=F0DB4F
[npm-version-href]: https://npmjs.com/package/@design-sync/manager
[npm-downloads-src]: https://img.shields.io/npm/dm/@design-sync/manager?style=flat&colorA=18181B&colorB=F0DB4F
[npm-downloads-href]: https://npmjs.com/package/@design-sync/manager
<!-- [codecov-src]: https://img.shields.io/codecov/c/gh/unjs/@design-sync/manager/main?style=flat&colorA=18181B&colorB=F0DB4F
[codecov-href]: https://codecov.io/gh/unjs/@design-sync/manager
[bundle-src]: https://img.shields.io/bundlephobia/minzip/@design-sync/manager?style=flat&colorA=18181B&colorB=F0DB4F
[bundle-href]: https://bundlephobia.com/result?p=@design-sync/manager -->
