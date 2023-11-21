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
    const config = await resolveConfig(args);
    const tokensManager = new TokensManager(config);
    const { uri, auth, plugins = [] } = config;
    for (const plugin of plugins) {
      logger.info(`Loading plugin ${plugin.name}`);
      tokensManager.use(plugin);
    }

    try {
      const tokensObj = await fetchTokens(uri, auth);
      logger.start('Processing tokens...');
      await tokensManager.run(tokensObj);
      logger.success('Tokens processed successfully.');
    } catch (error) {
      // eslint-disable-next-line no-console
      logger.error(error);
    }
  },
});
