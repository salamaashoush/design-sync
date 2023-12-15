import { TEMPLATE_STRING_REGEX, hasTemplateString, isObjectPath, isValidJsObjectKey } from '@design-sync/utils';
import { normalizeTokenAlias } from './alias';
import { TOKEN_ALIAS_REGEX } from './constants';
import { hasTokenAlias, isTokenAlias } from './guards';

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

export function correctJSObjectPath(path: string): string {
  // Regular expression to match valid JavaScript identifiers
  const validIdentifier = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;

  // Split the path into parts
  const parts = path.split('.');

  // Process each part
  for (let i = 0; i < parts.length; i++) {
    // Check if the part is a valid identifier
    if (!validIdentifier.test(parts[i])) {
      // If not, enclose it in brackets and quotes
      parts[i] = `['${parts[i]}']`;
    }
  }

  // Join the parts back together
  return parts.join('.').replace(/\.\[/g, '['); // Replace ".[" with "["
}

export function processJSValue(value: unknown) {
  if (typeof value === 'undefined' || value === null) {
    return value;
  }

  if (typeof value === 'number') {
    return `"${value}"`;
  }

  if (hasTemplateString(value)) {
    const processed = value.replace(TEMPLATE_STRING_REGEX, (_, match) => `\${${correctJSObjectPath(match)}\}`);
    return `\`${processed}\``;
  }

  if (isObjectPath(value)) {
    return correctJSObjectPath(value);
  }

  return JSON.stringify(value);
}

export function processCSSKey(key: string): string {
  return key.replace(/([A-Z])/g, '-$1').toLowerCase();
}

interface SerializeObjectOptions {
  processKey?: (key: string) => string;
  processValue?: (value: unknown) => string;
  separator?: string;
  wrap?: (entries: string) => string;
  indent?: string;
  filterEmpty?: boolean;
  docsComment?: (path: string) => string;
}

function serializeObjectHelper(obj: object, options: SerializeObjectOptions = {}, path = ''): string {
  const {
    indent = '  ',
    processKey = processJSKey,
    processValue = processJSValue,
    separator = ',\n',
    wrap = (s) => `{\n${s}\n}`,
    filterEmpty = false,
    docsComment,
  } = options;
  const entries: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    const currentPath = path ? `${path}.${key}` : key;
    const processedKey = processKey(key);
    const processedValue =
      typeof value === 'object' ? serializeObjectHelper(value, options, currentPath) : processValue(value);
    if (filterEmpty && !processedValue) {
      continue;
    }
    const entry = `${processedKey}: ${processedValue}`;
    if (docsComment) {
      entries.push(`${docsComment(currentPath)}${entry}`);
    } else {
      entries.push(entry);
    }
  }
  return wrap(entries.join(separator).replace(/^/gm, indent));
}

export function serializeObject(obj: object, options: SerializeObjectOptions = {}): string {
  return serializeObjectHelper(obj, options);
}

export function serializeObjectToCSS(obj: object, selector: string, mediaQuery?: string): string {
  return serializeObject(obj, {
    processKey: processCSSKey,
    processValue: (value) => `${value}`,
    separator: ';\n',
    wrap: (s) => (mediaQuery ? `${mediaQuery} {\n${selector} {\n${s}\n}\n}` : `${selector} {\n${s}\n}`),
  });
}
