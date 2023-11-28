import { isObject, isRegExp, toArray } from '@design-sync/utils';
import { SUPPORTED_TYPES } from '../constants';
import {
  DesignTokenValueByMode,
  DesignTokenValueRecord,
  PathMatcher,
  TokenFilterObj,
  TokensFilterParams,
  TokensWalkerFilter,
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

function isMatchingFilterObject(params: TokensFilterParams, predicate: TokenFilterObj): boolean {
  const { type, path } = predicate;
  const [tokenPath, { $type }] = params;
  const typeMatched = typeof type === 'undefined' || toArray(type).some((t) => t === $type);
  const pathMatched = typeof path === 'undefined' || toArray(path).some((t) => isMatchingStringOrRegExp(tokenPath, t));
  return typeMatched && pathMatched;
}

export function isMatchingTokensFilter(params: TokensFilterParams, filter?: TokensWalkerFilter): boolean {
  if (!filter) {
    return false;
  }
  const [tokenPath, token] = params;
  return toArray(filter).some((t) => {
    if (t === '*') {
      return true;
    }

    if (typeof t === 'function') {
      return t(params);
    }

    if (typeof t === 'object' && !isRegExp(t)) {
      return isMatchingFilterObject(params, t);
    }
    return isMatchingStringOrRegExp(tokenPath, t) || isMatchingStringOrRegExp(token.$type, t);
  });
}

export function isSupportedTypeFilter(params: TokensFilterParams): boolean {
  return SUPPORTED_TYPES.includes(params[1].$type);
}
