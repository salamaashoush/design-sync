import { isObject } from "@design-sync/utils";

export interface TokenEntry {
  path: string;
  token: {
    $type: string;
    $value: unknown;
    $description?: string;
    [key: string]: unknown;
  };
}

/**
 * Walk a token tree and yield `[path, token]` for every node that has a `$type` property.
 * This handles arbitrary nesting depth.
 */
export function* walkTokens(obj: Record<string, unknown>, prefix = ""): Generator<TokenEntry> {
  for (const [key, value] of Object.entries(obj)) {
    if (key.startsWith("$")) continue;
    if (!isObject(value)) continue;

    const path = prefix ? `${prefix}/${key}` : key;
    const record = value as Record<string, unknown>;

    if ("$type" in record && "$value" in record) {
      yield { path, token: record as TokenEntry["token"] };
    } else {
      yield* walkTokens(record, path);
    }
  }
}
