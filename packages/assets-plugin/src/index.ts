/**
 * @design-sync/assets-plugin
 *
 * Assets and icons plugin for Design Sync.
 * Generates SVG sprites, React/Vue/Solid components, CSS utilities, and more from icon tokens.
 *
 * @example
 * ```typescript
 * import { assetsPlugin } from '@design-sync/assets-plugin';
 *
 * export default defineConfig({
 *   plugins: [
 *     assetsPlugin({
 *       // Generate SVG sprite sheet
 *       sprite: true,
 *
 *       // Generate React components
 *       components: {
 *         framework: 'react',
 *         prefix: '',
 *         suffix: 'Icon',
 *       },
 *
 *       // Generate CSS with data URLs and utility classes
 *       css: {
 *         utilityClasses: true,
 *         prefix: 'icon',
 *       },
 *
 *       // Generate TypeScript types
 *       typescript: {
 *         enumStyle: 'union',
 *       },
 *
 *       // Generate JSON manifest
 *       manifest: true,
 *     }),
 *   ],
 * });
 * ```
 */

export {
  assetsPlugin,
  type AssetsPluginConfig,
  type SpriteConfig,
  type ComponentsConfig,
  type CssConfig,
  type TypeScriptConfig,
  type IconFramework,
  type SpriteFormat,
} from "./plugin";

// Re-export icon utilities from w3c-dtfm for convenience
export {
  type NormalizedIconValue,
  type NormalizedAssetValue,
  type IconStyle,
  normalizeIconValue,
  normalizeAssetValue,
  isNormalizedIconValue,
  isNormalizedAssetValue,
  isSvgString,
  isDataUrl,
  isAbsoluteUrl,
  svgToDataUrl,
  svgToBase64DataUrl,
  iconToCssValue,
  assetToCssValue,
  extractSvgDimensions,
} from "@design-sync/w3c-dtfm";
