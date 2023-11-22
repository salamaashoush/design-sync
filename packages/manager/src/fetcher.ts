import { deepMerge } from '@design-sync/utils';
import { default as fg } from 'fast-glob';
import { downloadTemplate } from 'giget';
import { mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { logger } from './logger';

export async function fetchTokens(repo: string, auth?: string) {
  logger.start(`Downloading tokens from ${repo} ...`);
  const tmpDir = await mkdtemp(join(tmpdir(), 'tokenize-'));
  const { dir } = await downloadTemplate(repo, {
    cwd: tmpDir,
    dir: tmpDir,
    auth,
  });
  logger.success(`Tokens downloaded to ${dir}`);
  // read all json files in the directory
  const files = await fg.glob('**/*.json', { cwd: dir });
  logger.info(`Found ${files.length} tokens files`);
  const tokensSets = await Promise.all(
    files.map(async (file) => {
      const content = await readFile(join(dir, file), 'utf-8');
      return content;
    }),
  );
  // merge all tokens into one object
  logger.start(`Merging tokens...`);
  let mergedTokens = {};
  for (const tokenSet of tokensSets) {
    const parsedTokens = JSON.parse(tokenSet);
    mergedTokens = deepMerge(mergedTokens, parsedTokens);
  }
  logger.success(`Tokens merged`);
  return mergedTokens;
}
