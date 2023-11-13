import { downloadTemplate } from 'giget';
import { mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { logger } from './logger';

export async function fetchTokens(repo: string, filePath: string, auth?: string) {
  logger.debug(`fetching tokens from ${repo}`);
  const tmpDir = await mkdtemp(join(tmpdir(), 'tokenize-'));
  const { dir } = await downloadTemplate(repo, {
    cwd: tmpDir,
    dir: tmpDir,
    auth,
  });
  logger.debug(`tokens downloaded to ${dir}`);
  const tokens = await readFile(join(dir, filePath), 'utf-8');
  logger.debug(`passing tokens to the manager`);
  return JSON.parse(tokens);
}
