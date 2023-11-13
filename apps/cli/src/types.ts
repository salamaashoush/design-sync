import { TokensWalkerExtension } from '@design-sync/w3c-dtfm';
import { TokensManagerPlugin } from './manager';

export interface DesignSyncConfig {
  repo: string;
  tokensPath: string;
  out: string;
  auth?: string;
  cwd?: string;
  plugins?: TokensManagerPlugin[];
  schemaExtensions?: TokensWalkerExtension[];
  prettify?: boolean;
}
