# DesignSync

[![figma](https://img.shields.io/badge/built%20for-figma-fb6558.svg?style=for-the-badge&logo=figma)](https://pnpm.io/)
[![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-f69220.svg?style=for-the-badge&logo=pnpm)](https://pnpm.io/)
[![turborepo](https://img.shields.io/badge/built%20with-turborepo-803261.svg?style=for-the-badge&logo=turborepo)](https://turborepo.org/)
[![solid](https://img.shields.io/badge/made%20with-solid-4f88c6.svg?style=for-the-badge&logo=solid)](https://solidjs.com/)

Figma plugin and a set of utils to tokenize your design system

## Why?

Token studio is great but it's not completely free. This project aims to provide a free alternative to token studio with more features.

🚧 In early development. 🚧

## Project goals

- Develop a Figma plugin to help you tokenize your design system.
- Develop a set of utils and libraries to help you sync/convert tokens to other formats.
- Extract some useful libraries from the plugin and make them available as standalone packages.
  - Full accessible Figma UI design system for solidjs to help you build your own plugins.
  - Useful set of development utils for Figma plugins development (RPC utils, Transformers, Converters, etc. )

## Development

### Install dependencies

```bash
pnpm install
```

### Run the dev server

We need tp run build at least once to generate the `manifest.json` file in the dist folder.

go to the plugin folder and run the build command.

```bash
cd apps/plugin
pnpm run build
```

Then we can run the dev server to watch for changes in the plugin and ui code.

```bash
pnpm run dev
```

### Load the plugin into Figma

Load the `manifest.json` file in the `apps/plugin/dist` folder into Figma.

### Build the plugin

```bash
pnpm run build
```
