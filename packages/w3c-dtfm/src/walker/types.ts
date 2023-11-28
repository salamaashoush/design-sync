import { DerefToken, DesignToken, TokenDefinition, TokenType } from '../types';
import { TokensWalker } from './walker';

export interface DesignTokenValueRecord {
  normalized: DerefToken<DesignToken>['$value'];
  raw: DesignToken['$value'];
}
export type DesignTokenValueByMode = Record<
  string,
  DerefToken<DesignToken>['$value'] | DesignToken['$value'] | DesignTokenValueRecord
>;

export interface ProcessedDesignToken {
  normalizedValue?: DerefToken<DesignToken>['$value'];
  type: TokenType;
  rawValue: DesignToken['$value'];
  extensions?: Record<string, unknown>;
  description?: string;
  path: string;
  valueByMode: DesignTokenValueByMode;
  original: DesignToken;
  isResponsive?: boolean;
  isGenerated?: boolean;
}

export interface TokensWalkerExtensionBaseAction {
  extension: string;
  isResponsive?: boolean;
}

export type TokensWalkerExtensionAction = TokensWalkerExtensionBaseAction &
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
export interface TokensWalkerExtension {
  name: string;
  filter: TokensWalkerFilter;
  run(token: ProcessedDesignToken, walker: TokensWalker): TokensWalkerExtensionAction[];
}
