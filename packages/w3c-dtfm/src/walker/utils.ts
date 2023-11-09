import { isObject } from '@design-sync/utils';
import { DesignTokenValueByMode, DesignTokenValueRecord } from './types';

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
