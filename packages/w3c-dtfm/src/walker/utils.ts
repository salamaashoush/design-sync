import { isObject, isRegExp, toArray } from '@design-sync/utils';
import {
  DesignTokenValueByMode,
  DesignTokenValueRecord,
  PathMatcher,
  ProcessedDesignToken,
  TokensWalkerExtension,
  TokensWalkerExtensionFilterObj,
} from './types';

export function isDesignTokenValueRecord(value: unknown): value is DesignTokenValueRecord {
  return isObject(value) && value !== null && 'normalized' in value && 'raw' in value;
}

export function getModeNormalizeValue(valueByMode: DesignTokenValueByMode, mode: string) {
  const value = valueByMode[mode];
  if (!value) {
    return undefined;
  }
  return isDesignTokenValueRecord(value) ? value.normalized : value;
}

export function getModeRawValue(valueByMode: DesignTokenValueByMode, mode: string) {
  const value = valueByMode[mode];
  if (!value) {
    return undefined;
  }
  return isDesignTokenValueRecord(value) ? value.raw : value;
}

function isMatchingStringOrRegExp(value: string, predicate: PathMatcher): boolean {
  if (typeof predicate === 'string') {
    return value === predicate || value.includes(predicate);
  }

  if (isRegExp(predicate)) {
    return predicate.test(value);
  }

  return false;
}

function isMatchingFilterObject(token: ProcessedDesignToken, predicate: TokensWalkerExtensionFilterObj): boolean {
  const { type, path } = predicate;
  const typeMatched = typeof type === 'undefined' || toArray(type).some((t) => t === token.type);
  const pathMatched = typeof path === 'undefined' || toArray(path).some((t) => isMatchingStringOrRegExp(token.path, t));
  return typeMatched && pathMatched;
}

export function isMatchTokenExtensionFilter(
  token: ProcessedDesignToken,
  target?: TokensWalkerExtension['filter'],
): boolean {
  if (!target) {
    return false;
  }
  return toArray(target).some((t) => {
    if (t === '*') {
      return true;
    }

    if (typeof t === 'function') {
      return t(token);
    }

    if (typeof t === 'object' && !isRegExp(t)) {
      return isMatchingFilterObject(token, t);
    }
    return isMatchingStringOrRegExp(token.path, t) || isMatchingStringOrRegExp(token.type, t);
  });
}
