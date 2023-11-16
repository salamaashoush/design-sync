import { isValidJsObjectKey } from '@design-sync/utils';
import { normalizeTokenAlias } from './alias';

function addPrefix(path: string, prefix?: string | ((s: string) => string)) {
  const normalizedPath = normalizeTokenAlias(path);
  if (!prefix) {
    return normalizedPath;
  }
  return typeof prefix === 'function' ? prefix(normalizedPath) : `${prefix}.${normalizeTokenAlias(path)}`;
}

export function processPrimitiveValue(
  value: string | number,
  prefix?: string | ((s: string) => string),
): string | number {
  if (typeof value === 'number') {
    return value;
  }
  // Rule 1: Check if the value is a single object path
  if (value.startsWith('{') && value.endsWith('}')) {
    return addPrefix(value, prefix);
  }
  /// Rule 2: If the value contains an object path amongst other text
  const objectPathRegex = /\{[^}]+\}/g;
  if (objectPathRegex.test(value)) {
    return value.replace(objectPathRegex, (match) => `\${${addPrefix(match, prefix)}}`);
  }

  return value;
}

export function serializeObject(obj: object): string {
  const entries = [];
  for (const [key, value] of Object.entries(obj)) {
    const validKey = isValidJsObjectKey(key) ? key : JSON.stringify(key);
    if (typeof value === 'undefined' || value === null) {
      entries.push(`${validKey}: ${value}`);
      continue;
    }
    if (typeof value === 'object') {
      entries.push(`${validKey}: ${serializeObject(value)}`);
      continue;
    }
    const isTemplateString = /\${[^}]+}/g.test(value);
    if (isTemplateString) {
      entries.push(`${validKey}: \`${value}\``);
      continue;
    }

    const isJSObjectPath = /[a-z_](\w*\.[a-z_]\w*)+/gi.test(value);
    if (isJSObjectPath) {
      entries.push(`${validKey}: ${value}`);
      continue;
    }

    if (typeof value === 'number') {
      entries.push(`${validKey}: "${value}"`);
      continue;
    }

    entries.push(`${validKey}: ${JSON.stringify(value)}`);
  }
  return `{\n${entries.join(',\n')}\n}`;
}
