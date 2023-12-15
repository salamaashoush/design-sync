import type { DerefToken, DesignToken, TokenDefinition, TokenType } from '../types';
import type { WalkerDesignToken } from './token';
import type { TokensWalker } from './walker';

export interface DesignTokenValueRecord {
  normalized: DerefToken<DesignToken>['$value'];
  raw: DesignToken['$value'];
}
export type DesignTokenValueByMode = Record<
  string,
  DerefToken<DesignToken>['$value'] | DesignToken['$value'] | DesignTokenValueRecord
>;

export interface TokensWalkerBaseAction {
  extension: string;
  isResponsive?: boolean;
}

export type TokensWalkerAction = TokensWalkerBaseAction &
  (
    | {
        type: 'update';
        path: string;
        payload: Record<string, unknown>;
      }
    | {
        type: 'add';
        path: string;
        payload: Record<string, unknown>;
      }
    | {
        type: 'remove';
        path: string | string[];
      }
  );

export type PathMatcher = string | RegExp;
export interface TokenFilterObj {
  type?: TokenType | TokenType[];
  path?: PathMatcher | PathMatcher[];
}
export type TokensFilterParams = [string, TokenDefinition<any, any>];
export type TokensFilter =
  | '*'
  | string
  | TokenFilterObj
  | ((params: TokensFilterParams) => boolean)
  | RegExp
  | TokenType;

export type TokensWalkerFilter = TokensFilter | TokensFilter[];
export interface TokensWalkerSchemaExtension {
  name: string;
  filter: TokensWalkerFilter;
  run(token: WalkerDesignToken, walker: TokensWalker): TokensWalkerAction[];
}

export type TokenOverrideFn = (mode: string, token: DesignToken) => unknown;
export type TokenOverrides = Record<string, TokenOverrideFn>;
