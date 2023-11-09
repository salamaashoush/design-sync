import { DerefToken, DesignToken, TokenGeneratorsExtension, TokenModifiersExtension, TokenType } from '../types';
import type { TokensWalker } from './walker';

export interface DesignTokenValueRecord {
  normalized: DerefToken<DesignToken>['$value'];
  raw: DesignToken['$value'];
}
export type DesignTokenValueByMode = Record<
  string,
  DerefToken<DesignToken>['$value'] | DesignToken['$value'] | DesignTokenValueRecord
>;

export interface TokenExtensions extends TokenGeneratorsExtension, TokenModifiersExtension {}
export interface ProcessedDesignToken {
  normalized: DerefToken<DesignToken>['$value'];
  type: TokenType;
  raw: DesignToken['$value'];
  extensions: TokenExtensions;
  description?: string;
  fullPath: string;
  parentPath: string;
  key: string;
  valueByMode: DesignTokenValueByMode;
}

export type TokensWalkerExtensionAction =
  | {
      type: 'update';
      path: string;
      payload: DesignTokenValueByMode;
    }
  | {
      type: 'add';
      path: string;
      payload: DesignTokenValueByMode;
    }
  | {
      type: 'remove';
      path: string;
    };

export abstract class TokensWalkerExtension {
  abstract name: string;
  abstract target: TokenType | TokenType[];
  constructor(protected walker: TokensWalker) {}
  abstract run(token: ProcessedDesignToken): TokensWalkerExtensionAction[];
}
