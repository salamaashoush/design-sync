import type { TokensWalkerExtension } from '@design-sync/w3c-dtfm';
import { TokensManagerPlugin } from './manager';

export interface DesignSyncConfig {
  uri: string;
  out: string;
  auth?: string;
  cwd?: string;
  plugins?: TokensManagerPlugin[];
  schemaExtensions?: TokensWalkerExtension[];
  prettify?: boolean;
}
