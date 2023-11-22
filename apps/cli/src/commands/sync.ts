import { TokensManager, logger } from '@design-sync/manager';
import { defineCommand } from 'citty';

export default defineCommand({
  meta: {
    name: 'sync',
    description: 'Sync tokens from the git repo',
  },
  args: {
    uri: {
      type: 'positional',
      description: 'git repo url',
      valueHint: 'gh:username/repo/path/to/files#branch',
      required: false,
    },
    out: {
      type: 'string',
      description: 'path to output file',
    },
    config: {
      type: 'string',
      description: 'path to config file',
    },
    auth: {
      type: 'string',
      description: 'git provider auth token',
    },
    cwd: {
      type: 'string',
      description: 'path to working directory',
    },
    prettify: {
      type: 'boolean',
      description: 'prettify output',
    },
  },
  async run({ args }) {
    const tokensManager = new TokensManager();
    try {
      await tokensManager.run(args);
    } catch (error) {
      // eslint-disable-next-line no-console
      logger.error(error);
    }
  },
});
