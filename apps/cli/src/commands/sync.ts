import { defineCommand } from 'citty';
import { resolveConfig } from '../config';
import { fetchTokens } from '../fetch';
import { logger } from '../logger';
import { TokensManager } from '../manager';

export default defineCommand({
  meta: {
    name: 'sync',
    description: 'Sync tokens from the git repo',
  },
  args: {
    repo: {
      type: 'positional',
      description: 'git repo url',
      valueHint: 'gh:username/repo#branch',
      required: false,
    },
    tokensPath: {
      type: 'string',
      description: 'path to tokens file in repo',
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
  },
  async run({ args }) {
    const config = await resolveConfig();
    const tokensManager = new TokensManager(config);
    const { repo, tokensPath, auth, plugins = [] } = config;
    for (const plugin of plugins) {
      logger.debug(`loading plugin ${plugin.name}`);
      tokensManager.use(plugin);
    }

    try {
      const tokensObj = await fetchTokens(repo, tokensPath, auth);
      tokensManager.setTokens(tokensObj);
      logger.debug('processing tokens');
      await tokensManager.run();
      logger.debug('tokens processed successfully');
    } catch (error) {
      // eslint-disable-next-line no-console
      logger.error(error);
    }
  },
});
