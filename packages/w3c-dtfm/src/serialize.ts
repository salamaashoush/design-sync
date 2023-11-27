import { TEMPLATE_STRING_REGEX, hasTemplateString, isObjectPath, isValidJsObjectKey } from '@design-sync/utils';
import { normalizeTokenAlias } from './alias';
import { TOKEN_ALIAS_REGEX, hasTokenAlias, isTokenAlias } from './guards';

type WrapFn = (s: string, isSingleAlias: boolean) => string;
function processPath(path: string, wrap?: WrapFn, isSingleAlias = false) {
  const normalizedPath = normalizeTokenAlias(path);
  return typeof wrap === 'function' ? wrap(normalizedPath, isSingleAlias) : normalizedPath;
}

export function processPrimitiveValue(value: string | number, wrap?: WrapFn): string | number {
  if (typeof value !== 'string') {
    return value;
  }
  if (isTokenAlias(value.trim())) {
    return processPath(value, wrap, true);
  }
  if (hasTokenAlias(value)) {
    TOKEN_ALIAS_REGEX.lastIndex = 0;
    return value.replace(TOKEN_ALIAS_REGEX, (match) => processPath(match, wrap));
  }
  return value;
}

export function processJSKey(key: string): string {
  return isValidJsObjectKey(key) ? key : JSON.stringify(key);
}

export function correctJSObjectKey(path: string): string {
  // Regular expression to match valid JavaScript identifiers
  const validIdentifier = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;

  return path
    .split('.')
    .map((part) => {
      // Check if the part is a valid identifier
      if (validIdentifier.test(part)) {
        return part;
      } else {
        // If not, enclose it in brackets and quotes
        return `['${part}']`;
      }
    })
    .join('.')
    .replace(/\.\[/g, '['); // Replace ".[" with "["
}
export function processJSValue(value: unknown) {
  if (typeof value === 'undefined' || value === null) {
    return value;
  }

  if (typeof value === 'number') {
    return `"${value}"`;
  }

  if (hasTemplateString(value)) {
    const processed = value.replace(TEMPLATE_STRING_REGEX, (_, match) => `\${${correctJSObjectKey(match)}\}`);
    return `\`${processed}\``;
  }

  if (isObjectPath(value)) {
    return value;
  }

  return JSON.stringify(value);
}

export function processCSSKey(key: string): string {
  return key.replace(/([A-Z])/g, '-$1').toLowerCase();
}

interface SerializeObjectOptions {
  processKey?: (key: string) => string;
  processValue?: (value: string) => string;
  separator?: string;
  wrap?: (entries: string) => string;
  indent?: string;
  filterEmpty?: boolean;
}
export function serializeObject(obj: object, options: SerializeObjectOptions = {}): string {
  const {
    indent = '  ',
    processKey = processJSKey,
    processValue = processJSValue,
    separator = ',\n',
    wrap = (s) => `{\n${s}\n}`,
    filterEmpty = false,
  } = options;
  const entries = [];
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined || value === null || (filterEmpty && value === '')) {
      continue;
    }
    const processedKey = processKey(key);
    const processedValue = typeof value === 'object' ? serializeObject(value, options) : processValue(value);
    entries.push(`${processedKey}: ${processedValue}`);
  }
  return wrap(entries.join(separator).replace(/^/gm, indent));
}

export function serializeObjectToCSS(obj: object, selector: string, mediaQuery?: string): string {
  return serializeObject(obj, {
    processKey: processCSSKey,
    processValue: (value) => value,
    separator: ';\n',
    wrap: (s) => (mediaQuery ? `${mediaQuery} {\n${selector} {\n${s}\n}\n}` : `${selector} {\n${s}\n}`),
  });
}
