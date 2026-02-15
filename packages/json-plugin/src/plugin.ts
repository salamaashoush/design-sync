import {
  createFileBuilder,
  createModeRecord,
  definePlugin,
  getModesToIterate,
} from "@design-sync/manager";
import { set } from "@design-sync/utils";

export interface JSONPluginConfig {
  /** Output directory for JSON files (relative to main out dir) */
  outDir?: string;
}

/**
 * JSON Plugin - Exports design tokens as JSON files per mode
 *
 * Creates one JSON file per mode containing all token values.
 *
 * @example
 * ```typescript
 * // design-sync.config.ts
 * import { jsonPlugin } from '@design-sync/json-plugin';
 *
 * export default {
 *   plugins: [jsonPlugin({ outDir: 'json' })],
 * };
 * ```
 *
 * Output structure:
 * ```
 * json/
 *   default.json   // { "colors": { "primary": "#ff0000", ... }, ... }
 *   dark.json      // { "colors": { "primary": "#0000ff", ... }, ... }
 * ```
 */
export function jsonPlugin(config: JSONPluginConfig = {}): ReturnType<typeof definePlugin> {
  const { outDir = "" } = config;

  return definePlugin("json-plugin", (context) => {
    const { modes } = context;
    const builder = createFileBuilder(outDir);

    // Create a record for each mode
    const tokens = createModeRecord<Record<string, unknown>>(modes, () => ({}));

    // Iterate over all tokens and populate mode records
    context.query().forEach((token) => {
      for (const mode of getModesToIterate(modes)) {
        const value = token.getValue(mode);
        set(tokens[mode], token.path, value);
      }
    });

    // Create a JSON file for each mode
    for (const mode of getModesToIterate(modes)) {
      builder.addJson(`${mode}.json`, tokens[mode]);
    }

    return builder.build();
  });
}
