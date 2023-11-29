import { TokensWalkerOptions } from '@design-sync/w3c-dtfm';
import type { TokensManagerPlugin } from './manager';

/**
 * Design Sync TokensManager configuration
 */
export interface DesignSyncConfig extends TokensWalkerOptions {
  /**
   * remote repository uri to fetch the tokens from
   */
  uri: string;
  /**
   * output directory for the generated files
   */
  out: string;
  /**
   * authentication token to be used for fetching the tokens from the remote repository (if needed)
   * @default undefined
   */
  auth?: string;
  /**
   * current working directory to be used for resolving the config file and the output directory
   * @default process.cwd()
   */
  cwd?: string;
  /**
   * plugins to be used during the build process
   */
  plugins: TokensManagerPlugin[];

  /**
   * format the generated files using prettier
   * @default false
   */
  prettify?: boolean;
}
