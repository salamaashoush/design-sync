# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DesignSync is a monorepo for synchronizing design tokens across platforms. It processes W3C DTFM (Design Token Format Module) tokens and transforms them into various output formats via a plugin system.

## Build & Test Commands

```bash
# Install dependencies (requires Node >=22, uses Bun)
bun install

# Build all packages (Turbo respects dependency graph)
bun run build

# Run all tests / lint / type-check
bun run test
bun run lint
bun run lint:fix
bun run test:types
```

### Single Package

```bash
# Build/test one package (cd into it)
cd packages/w3c-dtfm && bun run build
cd packages/css-plugin && bun run test

# Run a single test file (Bun's native test runner, NOT vitest)
cd packages/w3c-dtfm && bun test test/processor/processor.test.ts

# Run tests matching a name pattern
cd packages/manager && bun test -t "config"
```

### Figma Plugin

```bash
cd apps/figma-plugin
bun run build          # esbuild (main thread IIFE) + Vite (Solid.js UI → singlefile)
bun run dev            # Watch mode for both
bun run build:main     # esbuild only → dist/code.js
bun run build:ui       # Vite only → dist/index.html
```

## Code Style

oxlint + oxfmt: semicolons, single quotes, trailing commas, 120 char width, 2-space indent.

Workspace constraints enforced by sherif on postinstall:
- `workspace:*` versions must match across all packages
- devDependencies must be alphabetically ordered

## Architecture

### Core Flow

```
@design-sync/cli
  └─> @design-sync/manager (plugin orchestration, config, file writing)
        └─> @design-sync/w3c-dtfm (token processor, query API, color utils)
        └─> @design-sync/utils (shared utilities)
```

### Token Processor API

Use `createTokenProcessor` (NOT deprecated `TokensWalker`):

```typescript
import { createTokenProcessor } from '@design-sync/w3c-dtfm';

const processor = createTokenProcessor(tokens, {
  defaultMode: 'default',
  requiredModes: ['light', 'dark'],
  filter: { type: 'color' },
  extensions: [myExtension],
});

await processor.process();
const colors = processor.query().ofType('color').toArray();
```

### Plugin System

Plugins implement `DesignSyncPlugin` (lifecycle hooks) or use the `definePlugin` helper:

```typescript
import { definePlugin } from '@design-sync/manager';

const myPlugin = definePlugin('my-plugin', async (context) => {
  const colors = context.query().ofType('color').toArray();
  return { files: [{ path: 'out.css', content: '...' }] };
});
```

`PluginContext` provides: `processor`, `query()`, `tokens()`, `getToken(path)`, `modes`, `logger`, `config`.

Plugin utilities exported from `@design-sync/manager`: `getAllModes`, `getModesToIterate`, `createFileBuilder`, `serializeToCSS`, `serializeNestedToCSS`, `stripTokenPrefix`, `simplifyTokenName`, `buildNestedObject`, `flattenNestedObject`.

### Figma Plugin Architecture

- **Main thread** (`src/main/`): esbuild IIFE bundle, Figma API access
- **UI** (`src/ui/`): Solid.js + vanilla-extract + Kobalte, Vite singlefile build
- **Shared** (`src/shared/`): Types and constants shared between main/UI
- **RPC** (`@design-sync/rpc`): JSON-RPC 2.0 over postMessage with transport abstraction

### Theme System (`@design-sync/design-tokens`)

```typescript
// Contract with null placeholders (imported by UIKit components)
import { theme } from '@design-sync/design-tokens';

// Platform-specific themes apply actual values
import { figmaTheme } from '@design-sync/design-tokens';   // Figma CSS vars
import { neutralTheme } from '@design-sync/design-tokens'; // Standalone values
```

UIKit components reference `theme` contract vars — they work with any theme class applied.

### Package Build Status

- **Source-only** (no build step): `rpc`, `storage`, `design-tokens`, `uikit`
- **Built with obuild** (ESM/CJS): `utils`, `w3c-dtfm`, `manager`, all output plugins
- **Figma plugin**: esbuild + Vite → `dist/code.js` + `dist/index.html`

## Configuration

```typescript
// design-sync.config.ts
export default {
  uri: 'gh:owner/repo/path#branch',
  out: './tokens',
  plugins: [cssPlugin(), jsonPlugin()],
  requiredModes: ['dark', 'light'],
  defaultMode: 'default',
};
```

## Pre-commit

Husky runs `bun test` on commit. Tests must pass before committing.

## Monorepo Structure

- `apps/` — CLI, Figma plugin
- `packages/` — Core libraries and output plugins
- `examples/` — Example integrations (css, styled-components, vanilla-extract)
- `tooling/` — Shared tsconfig
