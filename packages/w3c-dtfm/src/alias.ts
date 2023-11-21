import { TokenAlias } from './types';

export function normalizeTokenAlias(tokenAlias: TokenAlias | string) {
  return (
    tokenAlias
      // TODO: this is a hack to remove the $value from the token path, until we migrate isa figma plugin
      .replace('.$value', '')
      .replace(/[{}]/g, '')
  );
}
